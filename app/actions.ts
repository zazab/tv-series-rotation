"use server";

import { revalidatePath } from "next/cache";
import { markSeriesUnwatched } from "@/lib/plex";

export async function markSeriesUnwatchedAction(ratingKey: string) {
  await markSeriesUnwatched(ratingKey);
  revalidatePath("/");
}
