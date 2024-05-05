"use server";

import { scrapeYouTubeStreams, scrapeLiveYouTubeVideo } from "../scraper";
import { calculateDuration } from "@/utils";
import { Redis } from "@upstash/redis";

export async function isYouTubeStreaming(): Promise<boolean> {
  const [isLive] = await scrapeYouTubeStreams();
  return isLive;
}

export async function getYouTubeStreamTime(
  useAgo: boolean = false
): Promise<[string, string]> {
  const [_, videoId] = await scrapeYouTubeStreams();
  if (!videoId) return ["", ""];
  const [title, startTime] = await scrapeLiveYouTubeVideo(videoId);
  if (useAgo) return [title, startTime];
  const duration = startTime.includes("minutes")
    ? calculateDuration(startTime)
    : calculateDuration(await getYouTubeStreamTimeCached(), true);
  return [title, duration];
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
