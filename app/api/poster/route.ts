import { NextRequest, NextResponse } from "next/server";
import { plexHeaders, toPlexUrl } from "@/lib/plex";

export async function GET(request: NextRequest) {
  const thumbPath = request.nextUrl.searchParams.get("path");

  if (!thumbPath) {
    return NextResponse.json({ error: "Missing path parameter." }, { status: 400 });
  }

  const response = await fetch(toPlexUrl(thumbPath), {
    headers: plexHeaders(),
    cache: "no-store"
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Unable to fetch poster from Plex." }, { status: 502 });
  }

  return new NextResponse(response.body, {
    headers: {
      "Content-Type": response.headers.get("Content-Type") ?? "image/jpeg",
      "Cache-Control": "private, max-age=300"
    }
  });
}
