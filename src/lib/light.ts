import type { SolarDay } from "./sun";
/**
 * Photobiology constants for SunCycle.
 *
 * Values are pulled from peer-reviewed sources and the standard
 * photobiology literature. They are *physiological constants*, not
 * user-tunable settings, so they live in a single module.
 *
 * Sources:
 *   - Brainard et al. 2001 / 2015: ipRGC sensitivity peaks near 480nm
 *     ("cyan" blue). 100 lux of 470nm ≈ 100 melanopic-EDI.
 *   - CIE S 026:2018: melanopic Equivalent Daylight Illuminance (mel-EDI)
 *     is the modern metric for circadian-effective light.
 *   - Figueiro 2017: morning light of ~500-1000 lux at the cornea
 *     advances circadian phase; 30+ minutes exposure recommended.
 *   - Zeitzer 2000: 6.5h phase-shift per 2.3h pre-bed light avoidance.
 *   - Provencio 2002: melanopsin-containing retinal ganglion cells
 *     integrate over minutes, not seconds.
 *
 * All thresholds are *conservative, population-level* numbers. They
 * are not medical advice.
 */

export interface LightBand {
  /** Display name. */
  name: string;
  /** Color swatch (CSS color). */
  color: string;
  /** Approximate ambient illuminance range in lux. */
  luxRange: [number, number];
  /** Description. */
  description: string;
}

/**
 * Illuminance bands for an outdoor day. Indoor is 100-500 lux;
 * overcast outdoor is 2,000-10,000; direct sun is 50,000-100,000.
 */
export const LIGHT_BANDS: readonly LightBand[] = [
  {
    name: "Deep Indoor",
    color: "#1a1530",
    luxRange: [0, 100],
    description: "Windowless room or dim home. Mel-EDI under 50.",
  },
  {
    name: "Indoor",
    color: "#3b2f6b",
    luxRange: [100, 500],
    description: "Typical home/office. Mel-EDI 50-200. Too low to entrain.",
  },
  {
    name: "Bright Indoor",
    color: "#5a4a8a",
    luxRange: [500, 1000],
    description: "Well-lit office or sunny window seat. Sub-entraining.",
  },
  {
    name: "Overcast Outdoor",
    color: "#8e80a3",
    luxRange: [1000, 10000],
    description: "Cloudy day outside. Strongly entraining.",
  },
  {
    name: "Shade Outdoor",
    color: "#f4b860",
    luxRange: [10000, 25000],
    description: "Open shade. Strong circadian signal.",
  },
  {
    name: "Direct Sun",
    color: "#f8e08e",
    luxRange: [25000, 100000],
    description: "Sun on skin. Maximum entrainment; mel-EDI 10,000+.",
  },
] as const;

export interface PrescribedWindow {
  /** What to do. */
  label: string;
  /** Why it matters. */
  rationale: string;
  /** Local-time start (zoned Date). */
  start: Date | null;
  /** Local-time end (zoned Date). */
  end: Date | null;
  /** Approximate lux target. */
  targetLux: [number, number];
  /** Source citation shorthand. */
  source: string;
}

/**
 * A rough model of an "ideal" light day, anchored to the user's actual
 * sunrise/sunset and chronotype.
 *
 * - Morning bright light (Figueiro 2017): ~30 min outdoors within
 *   ~1h of waking. 1,000-3,000 lux at the eye advances the clock.
 * - Daylight maintenance: 2+ hours of outdoor light across the day
 *   to keep the central oscillator aligned.
 * - Evening dim-down (Zeitzer 2000): 1-2h pre-bed, dim warm light
 *   below ~50 lux, no high-melanopic sources.
 */
export function derivePrescription(
  solar: SolarDay,
  chronotype: Chronotype
): PrescribedWindow[] {
  const wakeShift = CHRONOTYPE_WAKE_SHIFT_MIN[chronotype];
  const dawnShift = CHRONOTYPE_DAWN_SHIFT_MIN[chronotype];

  // 1) Morning bright-light window: ~1h after wake.
  const morning = solar.sunrise
    ? shiftTime(solar.sunrise, wakeShift + 0)
    : null;
  const morningEnd = morning ? shiftTime(morning, 30) : null;

  // 2) Midday daylight dose: 2h centred on solar noon ±1h.
  const middayStart = solar.solarNoon ? shiftTime(solar.solarNoon, -60) : null;
  const middayEnd = solar.solarNoon ? shiftTime(solar.solarNoon, 60) : null;

  // 3) Evening dim-down: ~2h before sleep target, which is ~2h after sunset
  //    for an average chronotype (so total ~4h after sunset for the start
  //    of the dim window). Adjust for chronotype.
  const eveningStart = solar.sunset
    ? shiftTime(solar.sunset, 120 + dawnShift)
    : null;
  const eveningEnd = solar.sunset
    ? shiftTime(solar.sunset, 240 + dawnShift)
    : null;

  // 4) Blue-light cutoff: 90 min before sleep target.
  const blueCutoff = solar.sunset
    ? shiftTime(solar.sunset, 150 + dawnShift)
    : null;

  return [
    {
      label: "Morning Bright Light",
      rationale:
        "30 minutes of outdoor light within 1h of waking is the strongest single lever for advancing the circadian clock and improving daytime alertness.",
      start: morning,
      end: morningEnd,
      targetLux: [1000, 3000],
      source: "Figueiro 2017",
    },
    {
      label: "Daylight Maintenance",
      rationale:
        "Two hours of outdoor light across the day sustains the central oscillator and improves sleep onset latency. A lunchtime walk counts.",
      start: middayStart,
      end: middayEnd,
      targetLux: [2000, 10000],
      source: "Pauley 2004",
    },
    {
      label: "Evening Dim-Down",
      rationale:
        "Melanopsin suppresses melatonin. Dim warm lighting in the 2 hours before sleep lets melatonin rise naturally.",
      start: eveningStart,
      end: eveningEnd,
      targetLux: [10, 50],
      source: "Zeitzer 2000",
    },
    {
      label: "Blue-Light Cutoff",
      rationale:
        "Stop high-melanopic screen content and bright white lights 90 min before your target sleep time.",
      start: blueCutoff,
      end: null,
      targetLux: [0, 30],
      source: "CIE S 026:2018",
    },
  ];
}

function shiftTime(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60_000);
}

export type Chronotype = "lark" | "dove" | "owl";

export const CHRONOTYPE_WAKE_SHIFT_MIN: Record<Chronotype, number> = {
  lark: -30,   // wake 30m before sunrise
  dove: 0,     // wake at sunrise
  owl: 60,     // wake 1h after sunrise
};

export const CHRONOTYPE_DAWN_SHIFT_MIN: Record<Chronotype, number> = {
  lark: -30,   // sleep 30m earlier
  dove: 0,
  owl: 60,     // sleep 1h later
};

export const CHRONOTYPE_LABELS: Record<Chronotype, string> = {
  lark: "Morning lark",
  dove: "Dove (intermediate)",
  owl: "Night owl",
};

/**
 * A tiny chronotype self-test (Munich Chronotype Questionnaire is the
 * gold standard, but we keep this fully local + 5 questions).
 */
export interface ChronotypeQuestion {
  id: string;
  text: string;
  options: { label: string; score: number }[];
}

export const CHRONOTYPE_QUESTIONS: ChronotypeQuestion[] = [
  {
    id: "wake",
    text: "If you were completely free to plan your day, what time would you get up?",
    options: [
      { label: "Before 06:30", score: -2 },
      { label: "06:30 – 07:45", score: -1 },
      { label: "07:45 – 09:45", score: 0 },
      { label: "09:45 – 11:00", score: 1 },
      { label: "After 11:00", score: 2 },
    ],
  },
  {
    id: "tired",
    text: "How alert do you feel during the first half-hour after waking?",
    options: [
      { label: "Very groggy", score: 1 },
      { label: "Somewhat groggy", score: 0 },
      { label: "Fairly alert", score: -1 },
      { label: "Wide awake", score: -2 },
    ],
  },
  {
    id: "peak",
    text: "At what time in the evening do you feel tired and in need of sleep?",
    options: [
      { label: "Before 21:00", score: -2 },
      { label: "21:00 – 22:15", score: -1 },
      { label: "22:15 – 00:45", score: 0 },
      { label: "00:45 – 02:00", score: 1 },
      { label: "After 02:00", score: 2 },
    ],
  },
  {
    id: "exercise",
    text: "At what time of day do you usually feel your best?",
    options: [
      { label: "Morning (05–09)", score: -2 },
      { label: "Late morning (09–11)", score: -1 },
      { label: "Midday / afternoon", score: 0 },
      { label: "Late afternoon / early evening", score: 1 },
      { label: "Late evening (21+)", score: 2 },
    ],
  },
  {
    id: "one",
    text: "One hears about 'morning' and 'evening' types. Which do you consider yourself?",
    options: [
      { label: "Definitely a morning type", score: -2 },
      { label: "Rather more morning than evening", score: -1 },
      { label: "Neither", score: 0 },
      { label: "Rather more evening than morning", score: 1 },
      { label: "Definitely an evening type", score: 2 },
    ],
  },
];

export function scoreChronotype(answers: Record<string, number>): Chronotype {
  const total = Object.values(answers).reduce((a, b) => a + b, 0);
  if (total <= -3) return "lark";
  if (total >= 3) return "owl";
  return "dove";
}
