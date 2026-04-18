import type { SeriesRotationItem, TautulliHistoryEntry } from "@/lib/types";

export function sortSeriesRotation(items: SeriesRotationItem[]) {
  return [...items].sort((left, right) => {
    if (left.playState !== right.playState) {
      return left.playState === "never_played" ? -1 : 1;
    }

    if (left.lastPlayedAt === right.lastPlayedAt) {
      return left.title.localeCompare(right.title);
    }

    if (!left.lastPlayedAt) {
      return -1;
    }

    if (!right.lastPlayedAt) {
      return 1;
    }

    return new Date(left.lastPlayedAt).getTime() - new Date(right.lastPlayedAt).getTime();
  });
}

export function formatLastPlayedLabel(lastPlayedAt: string | null) {
  if (!lastPlayedAt) {
    return "Never played";
  }

  return `Last played ${new Date(lastPlayedAt).toLocaleString()}`;
}

export function aggregateHistoryBySeries(
  entries: TautulliHistoryEntry[],
  knownSeriesKeys: Set<string>
) {
  const latestBySeries = new Map<string, string>();

  for (const entry of entries) {
    const seriesKey = resolveSeriesKey(entry, knownSeriesKeys);
    if (!seriesKey) {
      continue;
    }

    const isoTimestamp = normalizeHistoryDate(entry.date);
    const previous = latestBySeries.get(seriesKey);

    if (!previous || new Date(isoTimestamp).getTime() > new Date(previous).getTime()) {
      latestBySeries.set(seriesKey, isoTimestamp);
    }
  }

  return latestBySeries;
}

function resolveSeriesKey(entry: TautulliHistoryEntry, knownSeriesKeys: Set<string>) {
  const candidates = [entry.grandparent_rating_key, entry.parent_rating_key, entry.rating_key];

  for (const candidate of candidates) {
    if (candidate && knownSeriesKeys.has(candidate)) {
      return candidate;
    }
  }

  return undefined;
}

function normalizeHistoryDate(date: number | string) {
  const numeric = typeof date === "string" ? Number(date) : date;
  return new Date(numeric * 1000).toISOString();
}
