import Timer from "@/components/Timer";
import { isYouTubeStreaming } from "@/lib/actions";

export const revalidate = 0; // Disable revalidation or caching

export default async function Home() {
  return (
    <>
      <Timer isLive={(await isYouTubeStreaming())[0]} />
    </>
  );
}
