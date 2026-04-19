import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getConfig, resetConfigCache } from "@/lib/config";

describe("getConfig", () => {
  let tempDir: string | null = null;

  beforeEach(() => {
    resetConfigCache();
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    resetConfigCache();
    vi.unstubAllEnvs();

    if (tempDir) {
      rmSync(tempDir, { recursive: true, force: true });
      tempDir = null;
    }
  });

  it("reads config from the configured path and normalizes URLs", () => {
    tempDir = mkdtempSync(path.join(tmpdir(), "tv-series-rotation-"));
    const configPath = path.join(tempDir, "config.json");

    writeFileSync(
      configPath,
      JSON.stringify({
        PLEX_BASE_URL: "http://plex.local/",
        PLEX_TOKEN: "token",
        PLEX_TV_LIBRARY_SECTION_ID: "",
        PLEX_COLLECTION_RATING_KEY: "123",
        TAUTULLI_BASE_URL: "http://tautulli.local/",
        TAUTULLI_API_KEY: "apikey"
      })
    );

    vi.stubEnv("TV_SERIES_ROTATION_CONFIG_PATH", configPath);

    expect(getConfig()).toEqual({
      PLEX_BASE_URL: "http://plex.local",
      PLEX_TOKEN: "token",
      PLEX_TV_LIBRARY_SECTION_ID: undefined,
      PLEX_COLLECTION_RATING_KEY: "123",
      TAUTULLI_BASE_URL: "http://tautulli.local",
      TAUTULLI_API_KEY: "apikey"
    });
  });

  it("throws when required values are missing", () => {
    tempDir = mkdtempSync(path.join(tmpdir(), "tv-series-rotation-"));
    const configPath = path.join(tempDir, "config.json");

    writeFileSync(
      configPath,
      JSON.stringify({
        PLEX_BASE_URL: "http://plex.local",
        PLEX_TOKEN: "token"
      })
    );

    vi.stubEnv("TV_SERIES_ROTATION_CONFIG_PATH", configPath);

    expect(() => getConfig()).toThrow(
      `Missing config values in ${configPath}: PLEX_COLLECTION_RATING_KEY, TAUTULLI_BASE_URL, TAUTULLI_API_KEY`
    );
  });
});
