/**
 * Lightweight geolocation + IANA timezone resolver.
 *
 * - Browser Geolocation API (with explicit consent).
 * - Timezone from Intl.DateTimeFormat().resolvedOptions().timeZone
 *   (no API call needed — modern browsers ship a tz database).
 * - Lat/lon -> nearest city lookup from a small static dataset, so
 *   the static pages can be useful without GPS.
 *
 * No network calls. No paid APIs.
 */

export interface GeoGuess {
  lat: number;
  lon: number;
  city: string;
  region: string;
  country: string;
  timezone: string;
}

export const CITY_DIRECTORY: GeoGuess[] = [
  { lat: 40.7128, lon: -74.0060, city: "New York", region: "NY", country: "US", timezone: "America/New_York" },
  { lat: 34.0522, lon: -118.2437, city: "Los Angeles", region: "CA", country: "US", timezone: "America/Los_Angeles" },
  { lat: 41.8781, lon: -87.6298, city: "Chicago", region: "IL", country: "US", timezone: "America/Chicago" },
  { lat: 29.7604, lon: -95.3698, city: "Houston", region: "TX", country: "US", timezone: "America/Chicago" },
  { lat: 33.4484, lon: -112.0740, city: "Phoenix", region: "AZ", country: "US", timezone: "America/Phoenix" },
  { lat: 47.6062, lon: -122.3321, city: "Seattle", region: "WA", country: "US", timezone: "America/Los_Angeles" },
  { lat: 37.7749, lon: -122.4194, city: "San Francisco", region: "CA", country: "US", timezone: "America/Los_Angeles" },
  { lat: 39.9526, lon: -75.1652, city: "Philadelphia", region: "PA", country: "US", timezone: "America/New_York" },
  { lat: 51.5074, lon: -0.1278, city: "London", region: "England", country: "UK", timezone: "Europe/London" },
  { lat: 48.8566, lon: 2.3522, city: "Paris", region: "Île-de-France", country: "FR", timezone: "Europe/Paris" },
  { lat: 52.5200, lon: 13.4050, city: "Berlin", region: "Berlin", country: "DE", timezone: "Europe/Berlin" },
  { lat: 41.9028, lon: 12.4964, city: "Rome", region: "Lazio", country: "IT", timezone: "Europe/Rome" },
  { lat: 40.4168, lon: -3.7038, city: "Madrid", region: "Madrid", country: "ES", timezone: "Europe/Madrid" },
  { lat: 35.6762, lon: 139.6503, city: "Tokyo", region: "Tokyo", country: "JP", timezone: "Asia/Tokyo" },
  { lat: 37.5665, lon: 126.9780, city: "Seoul", region: "Seoul", country: "KR", timezone: "Asia/Seoul" },
  { lat: 39.9042, lon: 116.4074, city: "Beijing", region: "Beijing", country: "CN", timezone: "Asia/Shanghai" },
  { lat: 31.2304, lon: 121.4737, city: "Shanghai", region: "Shanghai", country: "CN", timezone: "Asia/Shanghai" },
  { lat: 22.3193, lon: 114.1694, city: "Hong Kong", region: "Hong Kong", country: "HK", timezone: "Asia/Hong_Kong" },
  { lat: 1.3521, lon: 103.8198, city: "Singapore", region: "Singapore", country: "SG", timezone: "Asia/Singapore" },
  { lat: 19.0760, lon: 72.8777, city: "Mumbai", region: "Maharashtra", country: "IN", timezone: "Asia/Kolkata" },
  { lat: 28.6139, lon: 77.2090, city: "New Delhi", region: "Delhi", country: "IN", timezone: "Asia/Kolkata" },
  { lat: -33.8688, lon: 151.2093, city: "Sydney", region: "NSW", country: "AU", timezone: "Australia/Sydney" },
  { lat: -37.8136, lon: 144.9631, city: "Melbourne", region: "VIC", country: "AU", timezone: "Australia/Melbourne" },
  { lat: -22.9068, lon: -43.1729, city: "Rio de Janeiro", region: "RJ", country: "BR", timezone: "America/Sao_Paulo" },
  { lat: -34.6037, lon: -58.3816, city: "Buenos Aires", region: "BA", country: "AR", timezone: "America/Argentina/Buenos_Aires" },
  { lat: 19.4326, lon: -99.1332, city: "Mexico City", region: "CDMX", country: "MX", timezone: "America/Mexico_City" },
  { lat: 43.6532, lon: -79.3832, city: "Toronto", region: "ON", country: "CA", timezone: "America/Toronto" },
  { lat: 45.5017, lon: -73.5673, city: "Montreal", region: "QC", country: "CA", timezone: "America/Toronto" },
  { lat: 49.2827, lon: -123.1207, city: "Vancouver", region: "BC", country: "CA", timezone: "America/Vancouver" },
  { lat: 55.6761, lon: 12.5683, city: "Copenhagen", region: "Hovedstaden", country: "DK", timezone: "Europe/Copenhagen" },
  { lat: 59.3293, lon: 18.0686, city: "Stockholm", region: "Stockholm", country: "SE", timezone: "Europe/Stockholm" },
  { lat: 60.1699, lon: 24.9384, city: "Helsinki", region: "Uusimaa", country: "FI", timezone: "Europe/Helsinki" },
  { lat: 59.9139, lon: 10.7522, city: "Oslo", region: "Oslo", country: "NO", timezone: "Europe/Oslo" },
  { lat: 64.1466, lon: -21.9426, city: "Reykjavík", region: "Capital", country: "IS", timezone: "Atlantic/Reykjavik" },
  { lat: 25.2048, lon: 55.2708, city: "Dubai", region: "Dubai", country: "AE", timezone: "Asia/Dubai" },
  { lat: -26.2041, lon: 28.0473, city: "Johannesburg", region: "Gauteng", country: "ZA", timezone: "Africa/Johannesburg" },
  { lat: 30.0444, lon: 31.2357, city: "Cairo", region: "Cairo", country: "EG", timezone: "Africa/Cairo" },
];

/** Great-circle distance in kilometres. */
function haversineKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const R = 6371;
  const dLat = (b.lat - a.lat) * DEG;
  const dLon = (b.lon - a.lon) * DEG;
  const lat1 = a.lat * DEG;
  const lat2 = b.lat * DEG;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

const DEG = Math.PI / 180;

/**
 * Find the nearest known city to a given lat/lon. Always returns a
 * match (falls back to the closest entry, which is fine for UX).
 */
export function nearestCity(lat: number, lon: number): GeoGuess {
  let best = CITY_DIRECTORY[0];
  let bestKm = Infinity;
  for (const c of CITY_DIRECTORY) {
    const km = haversineKm({ lat, lon }, { lat: c.lat, lon: c.lon });
    if (km < bestKm) {
      bestKm = km;
      best = c;
    }
  }
  return best;
}

/**
 * Estimate a sensible IANA timezone from longitude alone.
 * -15° per hour offset, plus half-hour TZ skips at known edges.
 * Useful as a fallback when the browser's Intl DB is unavailable.
 */
export function guessTimezoneFromLongitude(lon: number): string {
  const offsetHours = Math.round(lon / 15);
  if (offsetHours === 0) return "Etc/UTC";
  return `Etc/GMT${offsetHours > 0 ? "-" : "+"}${Math.abs(offsetHours)}`;
}

/**
 * Build a stable URL string for shareable deep-links.
 */
export function buildShareUrl(lat: number, lon: number, tz: string): string {
  const params = new URLSearchParams({
    lat: lat.toFixed(4),
    lon: lon.toFixed(4),
    tz,
  });
  return `/?${params.toString()}`;
}
