"use server";

import { scrapeMrPokkeStreams, scrapeLiveYouTubeVideo } from "../scraper";
import { calculateDuration } from "@/utils";

export async function isMrPokkeStreaming() : Promise<boolean>{
  const [isLive] = await scrapeMrPokkeStreams();
  return isLive;
}

export async function getMrPokkeStreamTime() : Promise<[string, string]> {
  const [_, videoId] = await scrapeMrPokkeStreams();
  if (!videoId) return ["", ""];
  const [title, startTime] = await scrapeLiveYouTubeVideo(videoId);
  return [ title, calculateDuration(startTime)]
}
