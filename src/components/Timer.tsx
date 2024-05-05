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
  const searchParams = useSearchParams();
  const isDark = searchParams.get("dark") === "true";

  // Custom notification time
  const hourQuery = searchParams.get("hour") ?? defaultSettings.hour.toString();
  const minuteQuery =
    searchParams.get("minute") ?? defaultSettings.minute.toString();

  useEffect(() => {
    checkStream();
    const interval = setInterval(checkStream, 1000 * 60); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const checkStream = () => {
    try {
      getYouTubeStreamTime().then(([, duration]) => {
        if (duration === "") {
          setLive(false);
          return;
        } else if (!live && duration !== "") {
          setLive(true);
        }
        setDuration(duration);
      });
    } catch (e) {
      console.error("Error fetching stream time", e);
    }
  };

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

  // play when notification is true
  useEffect(() => {
    const audio = new Audio("/sfx/notification.mp3");

    audio.loop = true;
    audio.volume = 0.5;

    // Play
    if (notification) {
      audio.play();
    } else {
      audio.pause();
    }

    // Stop
    return () => {
      audio.pause();
    };
  }, [notification]);

  return (
    <main className="bg-transparent h-screen flex flex-col justify-center items-center">
      <p
        className={`text-xl font-semibold ${
          isDark ? "text-black" : "text-white"
        }`}
      >
        {live ? duration : "MrPokke is not live."}
      </p>
      {notification && (
        <>
          <p
            className={`text-2xl font-semibold ${
              isDark ? "text-black" : "text-white"
            }`}
          >
            END YT STREAM
          </p>
          <Image src={image} alt="END YT STREAM" width={200} height={200} />
        </>
      )}
    </main>
  );
}
