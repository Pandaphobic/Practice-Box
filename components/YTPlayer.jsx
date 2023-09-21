import React, { useEffect, useRef, useState } from "react";
import YouTubePlayer from "yt-player";

function YouTubeComponent({ videoUrl }) {
  const playerElRef = useRef(null);
  const ytPlayerRef = useRef(null);

  useEffect(() => {
    if (!videoUrl) {
      return;
    }
    // fix the video id https://www.youtube.com/watch?v=-xKM3mGt2pE& should be -xKM3mGt2pE
    const videoId = videoUrl.split("v=")[1].split("&")[0];

    // Initialize the player with the ref to the DOM element
    ytPlayerRef.current = new YouTubePlayer(playerElRef.current, {
      width: 640,
      height: 360,
    });
    // Load the video and set initial configurations
    ytPlayerRef.current.load(videoId, false);
    ytPlayerRef.current.setVolume(100);

    // Cleanup: Destroy the ytPlayerRef.current when the component is unmounted
    return () => {
      ytPlayerRef.current.destroy();
    };
  }, [videoUrl]);

  const handleStart = () => {
    if (playerElRef.current) {
      ytPlayerRef.current.play();
    }
  };

  const handlePause = () => {
    // Renamed from handleStop to handlePause
    if (playerElRef.current) {
      ytPlayerRef.current.pause();
    }
  };

  return (
    <div>
      <div ref={playerElRef}></div>
      <button onClick={handleStart}>Start</button>
      <button onClick={handlePause}>Pause</button>
    </div>
  );
}

export default YouTubeComponent;
