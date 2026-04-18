export type SeriesRotationItem = {
  plexRatingKey: string;
  title: string;
  posterUrl?: string;
  lastPlayedAt: string | null;
  playState: "never_played" | "played";
  episodeCount?: number;
  watchedEpisodeCount?: number;
};

export type PlexCollectionItem = {
  ratingKey: string;
  title: string;
  thumb?: string;
  leafCount?: number;
  viewedLeafCount?: number;
  type: string;
};

export type TautulliHistoryEntry = {
  date: number | string;
  grandparent_rating_key?: string;
  parent_rating_key?: string;
  rating_key?: string;
  media_type?: string;
  title?: string;
  grandparent_title?: string;
};
