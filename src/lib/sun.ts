/**
 * SunCycle solar geometry.
 *
 * Low-precision NOAA-style solar position + sunrise/sunset/twilight
 * computation. Accurate to ~1 minute for non-polar latitudes. Good
 * enough for circadian guidance, and the whole stack runs in-browser
 * (no API, no network, no AI).
 *
 * Timezones are handled via Intl.DateTimeFormat. Local-time events are
 * returned as Date objects whose UTC fields *represent* the wall-clock
 * time in the target zone, which makes formatting a one-liner.
 */

const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;

export type Zenith =
  | "official"
  | "civil"
  | "nautical"
  | "astronomical";

const ZENITH_ANGLE: Record<Zenith, number> = {
  official: 90.833,
  civil: 96,
  nautical: 102,
  astronomical: 108,
};

export interface SolarPosition {
  /** Sun's declination in degrees. */
  declination: number;
  /** Equation of time in minutes. */
  equationOfTime: number;
}

export function dayOfYear(date: Date): number {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  return Math.floor((date.getTime() - start) / 86_400_000);
}

export function solarPosition(date: Date): SolarPosition {
  const n = dayOfYear(date);
  const gamma = (2 * Math.PI / 365) * (n - 1 + (date.getUTCHours() - 12) / 24);
  const eqTime = 229.18 * (
    0.000075
    + 0.001868 * Math.cos(gamma)
    - 0.032077 * Math.sin(gamma)
    - 0.014615 * Math.cos(2 * gamma)
    - 0.040849 * Math.sin(2 * gamma)
  );
  const decl = 0.006918
    - 0.399912 * Math.cos(gamma)
    + 0.070257 * Math.sin(gamma)
    - 0.006758 * Math.cos(2 * gamma)
    + 0.000907 * Math.sin(2 * gamma)
    - 0.002697 * Math.cos(3 * gamma)
    + 0.00148 * Math.sin(3 * gamma);
  return { declination: decl * RAD, equationOfTime: eqTime };
}

export function sunElevation(instant: Date, lat: number, lon: number): number {
  const { declination } = solarPosition(instant);
  const t = instant.getUTCHours() + instant.getUTCMinutes() / 60 + instant.getUTCSeconds() / 3600;
  const H = (t - 12) * 15 + lon;
  const latR = lat * DEG;
  const decR = declination * DEG;
  const hR = H * DEG;
  const sinAlt = Math.sin(latR) * Math.sin(decR) + Math.cos(latR) * Math.cos(decR) * Math.cos(hR);
  return Math.asin(sinAlt) * RAD;
}

export interface SolarDay {
  date: string;            // YYYY-MM-DD in local TZ
  sunrise: Date | null;    // zoned Date (UTC fields = local fields)
  sunset: Date | null;
  solarNoon: Date;
  daylightMinutes: number;
  goldenHourMorning: [Date, Date] | null;
  goldenHourEvening: [Date, Date] | null;
  blueHourMorning: [Date, Date] | null;
  blueHourEvening: [Date, Date] | null;
  civilDawn: Date | null;
  civilDusk: Date | null;
}

function solarEventUtc(
  localDayUtcMidnight: Date,
  lat: number,
  lon: number,
  zenithDeg: number,
  rising: boolean
): Date | null {
  const { declination, equationOfTime } = solarPosition(localDayUtcMidnight);
  const latRad = lat * DEG;
  const decRad = declination * DEG;
  const zRad = zenithDeg * DEG;
  const cosH = Math.cos(zRad) - Math.sin(latRad) * Math.sin(decRad);
  const denom = Math.cos(latRad) * Math.cos(decRad);
  const h = cosH / denom;
  if (h > 1 || h < -1) return null;
  const H = Math.acos(h) * RAD;
  const noonUtcMinutes = 720 - 4 * lon - equationOfTime;
  const noonUtc = localDayUtcMidnight.getTime() + noonUtcMinutes * 60_000;
  const offsetMin = rising ? -H * 4 : H * 4;
  return new Date(noonUtc + offsetMin * 60_000);
}

function bracketElevation(
  startMs: number,
  endMs: number,
  lat: number,
  lon: number,
  timeZone: string,
  mode: "morning" | "evening",
  lo: number,
  hi: number
): [Date, Date] | null {
  if (endMs <= startMs) return null;
  const step = 60_000;
  let s: number | null = null;
  let e: number | null = null;
  const iter = mode === "morning"
    ? (cb: (t: number) => void) => { for (let t = startMs; t <= endMs; t += step) cb(t); }
    : (cb: (t: number) => void) => { for (let t = endMs; t >= startMs; t -= step) cb(t); };
  iter((t) => {
    const elev = sunElevation(new Date(t), lat, lon);
    if (elev >= lo && elev <= hi) {
      if (s === null) s = t;
      e = t;
    } else if (s !== null) {
      // First miss after entry — clip.
    }
  });
  if (s === null || e === null) return null;
  return [toZonedDate(new Date(s), timeZone), toZonedDate(new Date(e), timeZone)];
}

function toZonedDate(instant: Date, timeZone: string): Date {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  }).formatToParts(instant);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const hour = get("hour") === 24 ? 0 : get("hour");
  return new Date(Date.UTC(get("year"), get("month") - 1, get("day"), hour, get("minute"), get("second")));
}

function localMidnightUtc(date: Date, timeZone: string): Date {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone, year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(date);
  const y = Number(parts.find((p) => p.type === "year")!.value);
  const m = Number(parts.find((p) => p.type === "month")!.value);
  const d = Number(parts.find((p) => p.type === "day")!.value);
  return new Date(Date.UTC(y, m - 1, d, 0, 0, 0));
}

function formatTime(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone, hour: "2-digit", minute: "2-digit", hour12: false,
  }).format(date);
}

function formatDate(date: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone, year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(date);
  const y = parts.find((p) => p.type === "year")!.value;
  const m = parts.find((p) => p.type === "month")!.value;
  const d = parts.find((p) => p.type === "day")!.value;
  return `${y}-${m}-${d}`;
}

export function computeSolarDay(
  date: Date,
  latitude: number,
  longitude: number,
  timeZone: string
): SolarDay {
  const localDay = localMidnightUtc(date, timeZone);

  const sunrise = solarEventUtc(localDay, latitude, longitude, ZENITH_ANGLE.official, true);
  const sunset = solarEventUtc(localDay, latitude, longitude, ZENITH_ANGLE.official, false);
  const civilDawn = solarEventUtc(localDay, latitude, longitude, ZENITH_ANGLE.civil, true);
  const civilDusk = solarEventUtc(localDay, latitude, longitude, ZENITH_ANGLE.civil, false);

  const { equationOfTime } = solarPosition(localDay);
  const noonUtcMinutes = 720 - 4 * longitude - equationOfTime;
  const solarNoon = toZonedDate(new Date(localDay.getTime() + noonUtcMinutes * 60_000), timeZone);

  const daylightMinutes = sunrise && sunset
    ? Math.round((sunset.getTime() - sunrise.getTime()) / 60_000)
    : 0;

  const goldenHourMorning = sunrise && civilDawn
    ? bracketElevation(civilDawn.getTime(), sunrise.getTime(), latitude, longitude, timeZone, "morning", -4, 6)
    : null;
  const goldenHourEvening = sunset && civilDusk
    ? bracketElevation(sunset.getTime(), civilDusk.getTime(), latitude, longitude, timeZone, "evening", -4, 6)
    : null;
  const blueHourMorning = sunrise && civilDawn
    ? bracketElevation(civilDawn.getTime(), sunrise.getTime(), latitude, longitude, timeZone, "morning", -6, -4)
    : null;
  const blueHourEvening = sunset && civilDusk
    ? bracketElevation(sunset.getTime(), civilDusk.getTime(), latitude, longitude, timeZone, "evening", -6, -4)
    : null;

  return {
    date: formatDate(localDay, timeZone),
    sunrise: sunrise ? toZonedDate(sunrise, timeZone) : null,
    sunset: sunset ? toZonedDate(sunset, timeZone) : null,
    solarNoon,
    daylightMinutes,
    goldenHourMorning,
    goldenHourEvening,
    blueHourMorning,
    blueHourEvening,
    civilDawn: civilDawn ? toZonedDate(civilDawn, timeZone) : null,
    civilDusk: civilDusk ? toZonedDate(civilDusk, timeZone) : null,
  };
}

function minutesFromMidnight(date: Date): number {
  return date.getUTCHours() * 60 + date.getUTCMinutes();
}

export { formatTime, formatDate, minutesFromMidnight };
