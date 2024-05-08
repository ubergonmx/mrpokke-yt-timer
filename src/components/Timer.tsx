"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getYouTubeStreamTime } from "@/lib/actions";
import Image from "next/image";

const defaultSettings = {
  img: "/img/pokkeDINKDONKKE.gif",
  hour: 5,
  minute: 55,
};

const nowSettings = {
  img: "/img/pokkeNOW.gif",
  hour: 5,
  minute: 57,
};

const panicSettings = {
  img: "/img/pokkePANIC.gif",
  hour: 5,
  minute: 58,
};

const maxSettings = {
  img: "/img/pokkeDed.png",
  hour: 6,
  minute: 0,
};

export default function Timer({ isLive }: { isLive: boolean }) {
  const [live, setLive] = useState(isLive);
  const [duration, setDuration] = useState("");
  const [notification, setNotification] = useState(false);
  const [image, setImage] = useState(defaultSettings.img);
  const [skipScraper, setSkipScraper] = useState(false);

  const searchParams = useSearchParams();
  const isDark = searchParams.get("dark") === "true";

  // Custom notification time
  const hourQuery = searchParams.get("hour") ?? defaultSettings.hour.toString();
  const minuteQuery =
    searchParams.get("minute") ?? defaultSettings.minute.toString();
  const intervalQuery = parseInt(searchParams.get("interval") ?? "60");

  useEffect(() => {
    const checkStream = () => {
      try {
        getYouTubeStreamTime(false, skipScraper).then(
          ([, duration, hasMinutes]) => {
            if (duration === "") {
              setLive(false);
              setSkipScraper(false);
              return;
            } else if (!live && duration !== "") {
              setLive(true);
            }
            setSkipScraper(hasMinutes);
            setDuration(duration);
          }
        );
      } catch (e) {
        console.error("Error fetching stream time", e);
      }
    };

    checkStream();
    const interval = setInterval(checkStream, 1000 * intervalQuery);
    return () => clearInterval(interval);
  }, [skipScraper]);

  useEffect(() => {
    const hour = parseInt(duration.split(" ")[0]);
    const minute = parseInt(duration.split(" ")[2]);
    const hourQueryInt = parseInt(hourQuery);
    const minuteQueryInt = parseInt(minuteQuery);

    if (hour == maxSettings.hour && minute == maxSettings.minute) {
      setImage(maxSettings.img);
      setNotification(true);
    } else if (hour == panicSettings.hour && minute == panicSettings.minute) {
      setImage(panicSettings.img);
      setNotification(true);
    } else if (hour == nowSettings.hour && minute == nowSettings.minute) {
      setImage(nowSettings.img);
      setNotification(true);
    } else if (hour == hourQueryInt && minute == minuteQueryInt) {
      setImage(defaultSettings.img);
      setNotification(true);
    } else if (hour == maxSettings.hour && minute > maxSettings.minute) {
      setNotification(false);
    }
  }, [duration]);

  // Play when notification is true
  useEffect(() => {
    const audio = new Audio("/sfx/notification.mp3");
    audio.volume = 0.5;

    // Play
    if (notification) {
      audio.play();
    } else {
      audio.pause();
    }

    // Stop for cleanup
    return () => {
      audio.pause();
    };
  }, [notification]);

  return (
    <main
      className={`bg-opacity-50 h-screen flex justify-center items-center overflow-hidden p-4 ${
        isDark ? "bg-white" : "bg-black"
      }`}
    >
      <p
        className={`text-lg font-semibold ${
          isDark ? "text-black" : "text-white"
        }`}
      >
        {live ? duration : "MrPokke is not live on YT"}
      </p>
      {notification && (
        <>
          <p
            className={`text-lg font-semibold text-center ${
              isDark ? "text-black" : "text-white"
            }`}
          >
            END YT STREAM
          </p>
          <Image src={image} alt="END YT STREAM" width={70} height={70} />
        </>
      )}
    </main>
  );
}
