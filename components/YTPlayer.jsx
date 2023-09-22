import React, { useEffect, useRef, useState } from "react";
import YouTubePlayer from "yt-player";
import { Box, IconButton, Input, Typography } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

// You can copy the ProgressBar component from your FilePlayer component
import ProgressBar from "./ProgressBar";
import { useAudio } from "@/store/context";
import { TapTempo } from "./TapTempo";

const inputStyle = {
  width: "5em",
  backgroundColor: "#16171B",
  color: "#FFFFFF",
  outline: "none",
  border: "none",
  padding: "4px",
  // on focus
  "&:focus": {
    backgroundColor: "#000000",
    color: "#FFFFFF",
    outline: "none",
  },
};

function YouTubeComponent({ videoUrl }) {
  const playerElRef = useRef(null);
  const ytPlayerRef = useRef(null);
  const progressBarRef = useRef(null);

  const { volume, setVolume, countIn, setStartTime, startTime, bpm, setBpm } =
    useAudio();

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!videoUrl) return;

    const videoId = videoUrl.split("v=")[1].split("&")[0];

    ytPlayerRef.current = new YouTubePlayer(playerElRef.current, {
      width: 640,
      height: 360,
    });
    ytPlayerRef.current.load(videoId, false);
    ytPlayerRef.current.setVolume(volume * 100);

    // Update progress based on currentTime
    ytPlayerRef.current.on("timeupdate", (currentTime) => {
      const percentage =
        (currentTime / ytPlayerRef.current.getDuration()) * 100;
      setProgress(percentage);
    });

    return () => {
      ytPlayerRef.current.destroy();
    };
  }, [videoUrl]);

  const handleStartTimeChange = (event) => {
    const newStartTime = parseFloat(event.target.value);
    setStartTime(newStartTime);
    if (ytPlayerRef.current) {
      ytPlayerRef.current.seek(newStartTime);
    }
  };

  const handlePlay = () => {
    if (ytPlayerRef.current) {
      ytPlayerRef.current.play();
    }
  };

  const handlePause = () => {
    if (ytPlayerRef.current) {
      ytPlayerRef.current.pause();
    }
  };

  const handleVolumeChange = (event) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    if (ytPlayerRef.current) {
      ytPlayerRef.current.setVolume(newVolume * 100);
    }
  };

  const handleTimelineClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (ytPlayerRef.current && progressBarRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect(); // <-- use progressBarRef's bounding box
      console.log("rect: ", rect);
      const clickPosition = (event.clientX - rect.left) / rect.width;
      console.log("clickPosition: ", clickPosition);
      console.log("duration: ", ytPlayerRef.current.getDuration());
      ytPlayerRef.current.seek(
        // round to 2 decimal places
        Math.round(clickPosition * ytPlayerRef.current.getDuration())
      );
      setStartTime(
        Math.round(clickPosition * ytPlayerRef.current.getDuration())
      );
    }
  };

  const handleRestart = () => {
    if (ytPlayerRef.current) {
      ytPlayerRef.current.seek(startTime);
    }
  };

  return (
    <Box>
      <div ref={playerElRef}></div>
      <Box
        ref={progressBarRef}
        style={{
          width: "100%",
          height: "20px",
          backgroundColor: "#ddd",
          marginTop: "20px",
          position: "relative",
          cursor: "pointer",
        }}
        onClick={handleTimelineClick}
      >
        <Box
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: `${progress}%`,
            backgroundColor: "#666",
          }}
        />
      </Box>
      {/* Pass the click handler to ProgressBar */}
      <IconButton variant="contained" onClick={handlePlay}>
        <PlayArrowIcon />
      </IconButton>
      <IconButton variant="contained" onClick={handlePause}>
        <StopIcon />
      </IconButton>
      <IconButton variant="contained" onClick={handleRestart}>
        <RestartAltIcon />
      </IconButton>
      Volume:
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={handleVolumeChange}
      />
      <Typography variant="body1">BPM:</Typography>
      <input
        style={inputStyle}
        size="small"
        type="number"
        value={bpm}
        onChange={(e) => setBpm(Number(e.target.value))}
      />
      <TapTempo setMainBpm={setBpm} />
      <Typography variant="body1">Count-In: </Typography>
      <input
        style={inputStyle}
        size="small"
        type="number"
        value={countIn}
        onChange={(e) => setCountIn(Number(e.target.value))}
      />
      <Typography variant="body1">Start Time:</Typography>
      <input
        style={inputStyle}
        size="small"
        type="number"
        value={startTime}
        onChange={handleStartTimeChange}
        step="0.01"
      />
    </Box>
  );
}

export default YouTubeComponent;
