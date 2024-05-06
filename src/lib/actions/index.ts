"use server";

import { scrapeYouTubeStreams, scrapeLiveYouTubeVideo } from "../scraper";
import { calculateDuration } from "@/utils";
import { Redis } from "@upstash/redis";

export async function isYouTubeStreaming(): Promise<boolean> {
  const [isLive] = await scrapeYouTubeStreams();
  return isLive;
}

export async function getYouTubeStreamTime(
  useAgo: boolean = false,
  skipScraper: boolean = false
): Promise<[string, string, boolean]> {
  console.log(
    "Getting YouTube stream time... [useAgo: %s, skipScraper: %s]",
    useAgo,
    skipScraper
  );
  if (!skipScraper) {
    console.log("Running scraper...");
    const [_, videoId] = await scrapeYouTubeStreams();
    if (!videoId) return ["", "", false];
    const [title, startTime] = await scrapeLiveYouTubeVideo(videoId);
    if (!title || !startTime) return ["", "", false];
    if (useAgo) return [title, startTime, false];
    const hasMinutes = startTime.includes("minute");
    const duration = hasMinutes
      ? calculateDuration(startTime)
      : calculateDuration(await getYouTubeStreamTimeCached(), true);

    return [title, duration, hasMinutes];
  } else {
    console.log("Skipping scraper...");
    const duration = calculateDuration(
      await getYouTubeStreamTimeCached(),
      true
    );
    return ["", duration, true];
  }
}

export async function getYouTubeStreamTimeCached(): Promise<string> {
  const redis = Redis.fromEnv();
  const cachedData = await redis.srandmember<string>("streamstart");
  return cachedData ?? "";
}

export async function setYouTubeStreamTimeCache(
  startStream: string
): Promise<void> {
  const redis = Redis.fromEnv();
  await redis.sadd("streamstart", startStream);
}

export async function clearYouTubeStreamTimeCache(): Promise<void> {
  const redis = Redis.fromEnv();
  await redis.spop("streamstart");
}
