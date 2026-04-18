import { NextRequest, NextResponse } from "next/server";
import { markSeriesUnwatched } from "@/lib/plex";

export async function POST(
  _request: NextRequest,
  context: { params: Promise<{ ratingKey: string }> }
) {
  const { ratingKey } = await context.params;

  try {
    await markSeriesUnwatched(ratingKey);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Plex error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
