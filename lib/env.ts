const requiredKeys = [
  "PLEX_BASE_URL",
  "PLEX_TOKEN",
  "PLEX_COLLECTION_RATING_KEY",
  "TAUTULLI_BASE_URL",
  "TAUTULLI_API_KEY"
] as const;

export type AppEnv = {
  PLEX_BASE_URL: string;
  PLEX_TOKEN: string;
  PLEX_TV_LIBRARY_SECTION_ID?: string;
  PLEX_COLLECTION_RATING_KEY: string;
  TAUTULLI_BASE_URL: string;
  TAUTULLI_API_KEY: string;
};

let cachedEnv: AppEnv | null = null;

export function getEnv(): AppEnv {
  if (cachedEnv) {
    return cachedEnv;
  }

  const missing = requiredKeys.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(", ")}`);
  }

  cachedEnv = {
    PLEX_BASE_URL: normalizeBaseUrl(process.env.PLEX_BASE_URL!),
    PLEX_TOKEN: process.env.PLEX_TOKEN!,
    PLEX_TV_LIBRARY_SECTION_ID: process.env.PLEX_TV_LIBRARY_SECTION_ID,
    PLEX_COLLECTION_RATING_KEY: process.env.PLEX_COLLECTION_RATING_KEY!,
    TAUTULLI_BASE_URL: normalizeBaseUrl(process.env.TAUTULLI_BASE_URL!),
    TAUTULLI_API_KEY: process.env.TAUTULLI_API_KEY!
  };

  return cachedEnv;
}

function normalizeBaseUrl(value: string) {
  return value.replace(/\/+$/, "");
}
