import fetch from "node-fetch";

export async function scrapeYouTubeStreams(): Promise<[boolean, string, string]> {
  let error = "";
  const res = await fetch("https://www.youtube.com/@mrpokkee/streams");
  error = res.ok ? "" : res.statusText;
  const text = await res.text();
  const isLive = !!text.match(/"iconType":"LIVE"/);
  const videoId = text.match(/"videoId":"(.+?)"/);
  if (!videoId) {
    if (!error) error = "No video ID found";
    return [isLive, "", error];
  }
  return [isLive, videoId[1], error];
}

export async function scrapeLiveYouTubeVideo(
  videoId: string
): Promise<[string, string]> {
  const res = await fetch(`https://www.youtube.com/watch?v=${videoId}`);
  const text = await res.text();
  const title = text.match(/<title>(.+?)<\/title>/);
  const startMatch = text.match(/Started streaming (.+?) ago/);
  if (!title || !startMatch) return ["", ""];
  const startTime = startMatch[0].replace("Started streaming ", "").trim();
  return [title[1], startTime];
}
