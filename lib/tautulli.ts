import { getEnv } from "@/lib/env";
import { aggregateHistoryBySeries } from "@/lib/rotation";
import type { TautulliHistoryEntry } from "@/lib/types";

type TautulliHistoryResponse = {
  response?: {
    result?: string;
    data?: {
      data?: TautulliHistoryEntry[];
      recordsFiltered?: number;
      recordsTotal?: number;
    };
    message?: string;
  };
};

const PAGE_SIZE = 200;
const MAX_PAGES = 10;

export async function getLastPlayedMapForSeries(seriesKeys: string[]) {
  const env = getEnv();
  const knownSeriesKeys = new Set(seriesKeys);
  const historyEntries: TautulliHistoryEntry[] = [];
  const foundKeys = new Set<string>();

  for (let page = 0; page < MAX_PAGES; page += 1) {
    const start = page * PAGE_SIZE;
    const url = new URL(`${env.TAUTULLI_BASE_URL}/api/v2`);
    url.searchParams.set("apikey", env.TAUTULLI_API_KEY);
    url.searchParams.set("cmd", "get_history");
    url.searchParams.set("media_type", "episode");
    url.searchParams.set("length", String(PAGE_SIZE));
    url.searchParams.set("start", String(start));
    url.searchParams.set("order_column", "date");
    url.searchParams.set("order_dir", "desc");

    if (env.PLEX_TV_LIBRARY_SECTION_ID) {
      url.searchParams.set("section_id", env.PLEX_TV_LIBRARY_SECTION_ID);
    }

    const response = await fetch(url, {
      headers: {
        Accept: "application/json"
      },
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`Tautulli history request failed with status ${response.status}.`);
    }

    const payload = (await response.json()) as TautulliHistoryResponse;

    if (payload.response?.result !== "success") {
      throw new Error(payload.response?.message ?? "Tautulli returned an unsuccessful response.");
    }

    const pageEntries = payload.response?.data?.data ?? [];
    historyEntries.push(...pageEntries);

    const aggregatedPage = aggregateHistoryBySeries(pageEntries, knownSeriesKeys);
    for (const key of aggregatedPage.keys()) {
      foundKeys.add(key);
    }

    if (pageEntries.length < PAGE_SIZE || foundKeys.size === knownSeriesKeys.size) {
      break;
    }
  }

  return aggregateHistoryBySeries(historyEntries, knownSeriesKeys);
}
