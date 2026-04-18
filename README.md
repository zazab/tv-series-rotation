# TV Series Rotation

A private self-hosted Next.js app that reads one Plex collection, uses Tautulli history to determine when each show was last played, and orders the collection for rotation viewing.

## Setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local`.
3. Fill in these values:
   - `PLEX_BASE_URL`
   - `PLEX_TOKEN`
   - `PLEX_TV_LIBRARY_SECTION_ID` (optional but recommended for Tautulli history filtering)
   - `PLEX_COLLECTION_RATING_KEY`
   - `TAUTULLI_BASE_URL`
   - `TAUTULLI_API_KEY`
4. Start the app with `npm run dev`.

## How ordering works

- The configured Plex collection determines which shows appear in the app.
- Tautulli history is fetched for TV episode playback.
- The app matches history back to Plex shows by preferring direct Plex rating keys from Tautulli fields like `grandparent_rating_key`.
- Shows with no history are treated as `never played` and are shown first.
- Played shows are ordered by the oldest `last played` timestamp first so the most neglected series rises to the top.

## Plex integration

- Posters are proxied through the app so the Plex token never reaches the browser.
- `Mark unwatched` calls Plex's `unscrobble` endpoint for the show `ratingKey`, which resets watched state for the whole series.

## Scripts

- `npm run dev` starts the local development server.
- `npm run build` builds the production app.
- `npm run test` runs the Vitest suite.
