import React, { useEffect, useRef, useState } from "react";
import YouTubePlayer from "yt-player";

function YouTubeComponent() {
  const [videoId, setVideoId] = useState("T1xLQG0OakM");

  const playerElRef = useRef(null);
  const ytPlayerRef = useRef(null);

  useEffect(() => {
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
  }, [videoId]);

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

  const handleVideoIdChange = (event) => {
    // incoming video link - trim so that only the video id is used
    // ex: https://www.youtube.com/watch?v=T1xLQG0OakM
    // becomes: T1xLQG0OakM

    const videoId = event.target.value.split("=")[1];
    setVideoId(videoId);
  };

  return (
    <div>
      <div ref={playerElRef}></div>
      <button onClick={handleStart}>Start</button>
      <button onClick={handlePause}>Pause</button>
      <input type="text" value={videoId} onChange={handleVideoIdChange} />
    </div>
  );
}

export default YouTubeComponent;
