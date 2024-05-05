"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getMrPokkeStreamTime } from "@/lib/actions";

export default function Timer({ isLive }: { isLive: boolean }) {
  const [duration, setDuration] = useState("");
  const searchParams = useSearchParams();
  const isDark = searchParams.get("dark") === "true";

  useEffect(() => {
    fetchStreamTime();
    const interval = setInterval(fetchStreamTime, 1000 * 60); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const fetchStreamTime = () => {
    try{
      getMrPokkeStreamTime().then(([, duration]) => {
        setDuration(duration);
      });
    }
    catch(e){
      console.error("Error fetching stream time", e);
    }
  };

  return (
    <main className="bg-transparent h-screen flex flex-col justify-center items-center">
      <p
        className={`text-6xl font-semibold ${
          isDark ? "text-black" : "text-white"
        }`}
      >
        {isLive ? duration : "MrPokke is not live."}
      </p>
    </main>
  );
}
