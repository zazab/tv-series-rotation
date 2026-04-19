# TV Series Rotation

A private self-hosted Next.js app that reads one Plex collection, uses Tautulli history to determine when each show was last played, and orders the collection for rotation viewing.

## Setup

1. Install dependencies with `npm install`.
2. Copy `config.example.json` to `config.local.json`.
3. Fill in the Plex and Tautulli values in `config.local.json`.
4. Start the app with `npm run dev`.

## Docker Compose

The app now reads its secrets from a JSON config file instead of environment variables.

1. Copy `config.example.json` to `config.local.json`.
2. Fill in the Plex and Tautulli values.
3. Build and start the app with `docker-compose up --build`.
4. Open `http://localhost:3000`.

By default Compose mounts `./config.local.json` into the container at `/config/config.json`.

If your config file lives elsewhere, point Compose at it with a non-secret path override:

```bash
CONFIG_FILE_PATH=/mnt/apps/tv-series-rotation/config.json docker-compose up --build
```

For TrueNAS, mount your external config file to `/config/config.json` in the container instead of storing secrets in environment variables.

The config file uses this shape:

```json
{
  "PLEX_BASE_URL": "http://localhost:32400",
  "PLEX_TOKEN": "your-plex-token",
  "PLEX_TV_LIBRARY_SECTION_ID": "2",
  "PLEX_COLLECTION_RATING_KEY": "12345",
  "TAUTULLI_BASE_URL": "http://localhost:8181",
  "TAUTULLI_API_KEY": "your-tautulli-api-key"
}
```

The app looks for config in these locations:

1. `TV_SERIES_ROTATION_CONFIG_PATH`, if you explicitly set it.
2. `config.local.json` in the project root.
3. `/config/config.json` inside the container.

To stop it, run `docker-compose down`.

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
