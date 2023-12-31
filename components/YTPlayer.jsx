import React, { useEffect, useRef, useState } from "react";
import YouTubePlayer from "yt-player";
import { Box, Button, IconButton, Typography } from "@mui/material";
// Material UI Icons
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import StopIcon from "@mui/icons-material/Stop";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

// You can copy the ProgressBar component from your FilePlayer component
import { useAudio } from "@/store/context";
import { TapTempo } from "./TapTempo";
import urlParser from "js-video-url-parser";
import Countdown from "./Countdown";

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
  // Metronome block sound ref
  // Setting it here allows us to watch it here, but use it in Countdown.jsx
  const blockAudioRef = useRef(null);

  const [videoId, setVideoId] = useState(null);

  const {
    volume,
    setVolume,
    countIn,
    setCountIn,
    setCurrentCount,
    currentCount,
    startTime,
    setStartTime,
    bpm,
    setBpm,
  } = useAudio();

  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!videoUrl) return;
    const parsed = urlParser.parse(videoUrl);
    if (!parsed || !parsed.id) return;
    setVideoId(parsed.id);
  }, [videoUrl]);

  useEffect(() => {
    if (currentCount !== null && currentCount > 0) {
      const millisecondsPerBeat = (60 / bpm) * 1000;

      // Play the block sound for every number except 0
      if (blockAudioRef.current) {
        blockAudioRef.current.currentTime = 0; // Reset audio to start
        blockAudioRef.current.play();
      }

      const countdownInterval = setInterval(() => {
        setCurrentCount((prevCount) => prevCount - 1);
      }, millisecondsPerBeat);

      return () => {
        clearInterval(countdownInterval); // Clean up the interval
      };
    } else if (currentCount === 0) {
      const audioElement = playerElRef.current;
      if (audioElement) {
        handlePlay();
      }
      setCurrentCount(null); // Reset currentCount
    }
  }, [currentCount, bpm, setCurrentCount]);

  useEffect(() => {
    if (!videoId) return;

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

    ytPlayerRef.current.on("playing", () => {
      setIsPlaying(true);
    });

    ytPlayerRef.current.on("paused", () => {
      setIsPlaying(false);
    });

    return () => {
      ytPlayerRef.current.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  const handleStartTimeChange = (event) => {
    const newStartTime = parseFloat(event.target.value);
    setStartTime(newStartTime);
    if (ytPlayerRef.current) {
      ytPlayerRef.current.seek(newStartTime);
    }
  };

  const playWithCountIn = () => {
    setCurrentCount(countIn);
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

  const handleStop = () => {
    if (ytPlayerRef.current) {
      ytPlayerRef.current.seek(startTime);
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

    if (ytPlayerRef.current && progressBarRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect(); // <-- use progressBarRef's bounding box
      const clickPosition = (event.clientX - rect.left) / rect.width;
      ytPlayerRef.current.seek(
        // round to 2 decimal places
        Math.round(clickPosition * ytPlayerRef.current.getDuration())
      );
    }
  };

  const handleRestart = () => {
    if (ytPlayerRef.current) {
      ytPlayerRef.current.seek(startTime);
    }
  };

  const handleSetTime = () => {
    // get the current time
    const currentTime = ytPlayerRef.current.getCurrentTime();
    // set the startTime to the currentTime
    setStartTime(currentTime);
    // pause the video
    ytPlayerRef.current.pause();
  };

  // return null if no videoId
  if (!videoId) return null;
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <div
        // this will sit in the middle of the screen, on top of the video
        style={{
          padding: "20px",
          position: "relative",
          height: "40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Countdown currentCount={currentCount} blockAudioRef={blockAudioRef} />
      </div>

      <Box display="flex" justifyContent="center">
        <Box
          maxWidth={550}
          display="flex"
          alignItems="center"
          flexWrap="wrap"
          gap={0}
          justifyContent="space-around"
        >
          <div
            style={{
              // center
              margin: "0 auto",
              width: "640px",
              height: "360px",
            }}
            ref={playerElRef}
          ></div>
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
          {isPlaying ? (
            <IconButton variant="contained" onClick={handlePause}>
              <PauseIcon />
            </IconButton>
          ) : (
            <IconButton variant="contained" onClick={playWithCountIn}>
              <PlayArrowIcon />
            </IconButton>
          )}
          <IconButton variant="contained" onClick={handleStop}>
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
          <Button
            style={{
              borderRadius: "6px",
              padding: "0",
            }}
            variant="contained"
            onClick={handleSetTime}
          >
            Set Start
          </Button>
        </Box>
      </Box>
      <Box display="flex" justifyContent="center" maxWidth={500}>
        <Box
          display="flex"
          alignItems="center"
          flexWrap="wrap"
          gap={1}
          justifyContent="space-around"
        >
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
      </Box>
    </Box>
  );
}

export default YouTubeComponent;
