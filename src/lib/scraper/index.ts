export async function scrapeYouTubeStreams(): Promise<[boolean, string]> {
  require("isomorphic-fetch");
  const res = await fetch("https://www.youtube.com/@mrpokkee/streams");
  const text = await res.text();
  const isLive = !!text.match(/"iconType":"LIVE"/);
  const videoId = text.match(/"videoId":"(.+?)"/);
  if (!videoId) return [isLive, ""];
  return [isLive, videoId[1]];
}

export async function scrapeLiveYouTubeVideo(
  videoId: string
): Promise<[string, string]> {
  require("isomorphic-fetch");
  const res = await fetch(`https://www.youtube.com/watch?v=${videoId}`);
  const text = await res.text();
  const title = text.match(/<title>(.+?)<\/title>/);
  const startMatch = text.match(/Started streaming (.+?) ago/);
  if (!title || !startMatch) return ["", ""];
  const startTime = startMatch[0].replace("Started streaming ", "").trim();
  return [title[1], startTime];
}
