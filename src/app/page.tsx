import Timer from "@/components/Timer";
import { isMrPokkeStreaming } from "@/lib/actions";

export default async function Home() {
  return <Timer isLive={await isMrPokkeStreaming()} />;
}
