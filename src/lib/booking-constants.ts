/** Client-safe booking constants (no server imports). */
export const TOPICS = [
  'Product demo',
  'Pricing & plans',
  'White Label program',
  'Onboarding help',
  'Something else',
] as const;

export const TEAM_SIZES = ['1-10', '11-50', '51-200', '201-1000', '1000+'] as const;

/** Call lengths a visitor can choose (minutes). Slots sit on the admin-set grid; a shorter call just ends earlier. */
export const DURATIONS = [20, 30] as const;
