import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const requiredKeys = [
  "PLEX_BASE_URL",
  "PLEX_TOKEN",
  "PLEX_COLLECTION_RATING_KEY",
  "TAUTULLI_BASE_URL",
  "TAUTULLI_API_KEY"
] as const;

const defaultConfigPaths = [
  path.join(process.cwd(), "config.local.json"),
  "/config/config.json"
];

export type AppConfig = {
  PLEX_BASE_URL: string;
  PLEX_TOKEN: string;
  PLEX_TV_LIBRARY_SECTION_ID?: string;
  PLEX_COLLECTION_RATING_KEY: string;
  TAUTULLI_BASE_URL: string;
  TAUTULLI_API_KEY: string;
};

let cachedConfig: AppConfig | null = null;

export function getConfig(): AppConfig {
  if (cachedConfig) {
    return cachedConfig;
  }

  const configPath = resolveConfigPath();
  const parsedConfig = JSON.parse(readFileSync(configPath, "utf8")) as Partial<AppConfig>;
  const missing = requiredKeys.filter((key) => !parsedConfig[key]);

  if (missing.length > 0) {
    throw new Error(`Missing config values in ${configPath}: ${missing.join(", ")}`);
  }

  cachedConfig = {
    PLEX_BASE_URL: normalizeBaseUrl(parsedConfig.PLEX_BASE_URL!),
    PLEX_TOKEN: parsedConfig.PLEX_TOKEN!,
    PLEX_TV_LIBRARY_SECTION_ID: normalizeOptionalValue(parsedConfig.PLEX_TV_LIBRARY_SECTION_ID),
    PLEX_COLLECTION_RATING_KEY: parsedConfig.PLEX_COLLECTION_RATING_KEY!,
    TAUTULLI_BASE_URL: normalizeBaseUrl(parsedConfig.TAUTULLI_BASE_URL!),
    TAUTULLI_API_KEY: parsedConfig.TAUTULLI_API_KEY!
  };

  return cachedConfig;
}

export function resetConfigCache() {
  cachedConfig = null;
}

function resolveConfigPath() {
  const configuredPath = process.env.TV_SERIES_ROTATION_CONFIG_PATH;
  const candidatePaths = configuredPath
    ? [configuredPath, ...defaultConfigPaths]
    : defaultConfigPaths;

  for (const candidatePath of candidatePaths) {
    if (existsSync(candidatePath)) {
      return candidatePath;
    }
  }

  throw new Error(`Config file not found. Checked: ${candidatePaths.join(", ")}`);
}

function normalizeBaseUrl(value: string) {
  return value.replace(/\/+$/, "");
}

function normalizeOptionalValue(value?: string) {
  return value && value.trim().length > 0 ? value : undefined;
}
