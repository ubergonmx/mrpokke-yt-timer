import {
  clearYouTubeStreamTimeCache,
  getYouTubeStreamTime,
  getYouTubeStreamTimeCached,
  isYouTubeStreaming,
  setYouTubeStreamTimeCache,
} from "@/lib/actions";
import { calculateDuration, calculateStartTime } from "@/utils";

// Prevents this route's response from being cached on Vercel
export const dynamic = "force-dynamic";

export async function GET() {
  const isLive = await isYouTubeStreaming();
  let message = "MrPokke is not live.";

  if (isLive) {
    message = "MrPokke is live!";

    const timeCached = await getYouTubeStreamTimeCached();
    if (timeCached) {
      message = `MrPokke has been live for ${calculateDuration(
        timeCached,
        true
      )}.`;
    } else {
      const [, timeAgo] = await getYouTubeStreamTime(true);
      const datetime = (
        timeAgo ? calculateStartTime(timeAgo) : new Date()
      ).toISOString();
      await setYouTubeStreamTimeCache(datetime);
      message = "MrPokke is live! Stream time has been cached: " + datetime;
    }
  } else {
    await clearYouTubeStreamTimeCache();
  }

  return Response.json({ message });
}
