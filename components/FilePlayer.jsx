import { useEffect, useRef, useState } from "react";
import { useAudio } from "@/store/context";
import { Box, Button, IconButton, Typography } from "@mui/material";
// Material UI Icons
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import StopIcon from "@mui/icons-material/Stop";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { TapTempo } from "./TapTempo";
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

export default function FilePlayer({ audioSrc }) {
  const fileAudioRef = useRef(null);
  const progressBarRef = useRef(null);
  // Metronome block sound ref
  // Setting it here allows us to watch it here, but use it in Countdown.jsx
  const blockAudioRef = useRef(null);

  const {
    volume,
    setVolume,
    countIn,
    setCountIn,
    currentCount,
    setCurrentCount,
    startTime,
    setStartTime,
    bpm,
    setBpm,
  } = useAudio();

  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

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
      const audioElement = fileAudioRef.current;
      if (audioElement) {
        onPlay();
      }
      setCurrentCount(null); // Reset currentCount
    }
  }, [currentCount, bpm, setCurrentCount]);

  useEffect(() => {
    const audioElement = fileAudioRef.current;
    const handleTimeUpdate = () => {
      // update isPlaying state
      setIsPlaying(audioElement?.paused ? false : true);
      const percentage =
        (audioElement.currentTime / audioElement.duration) * 100;
      console.log("CurrentTime", audioElement.currentTime);
      setProgress(percentage);
    };

    if (audioElement) {
      audioElement.addEventListener("timeupdate", handleTimeUpdate);
    }

    return () => {
      if (audioElement) {
        audioElement.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };
  }, [audioSrc]);

  const onStartTimeChange = (event) => {
    const newStartTime = parseFloat(event.target.value);
    setStartTime(newStartTime);
    if (fileAudioRef.current) {
      fileAudioRef.current.currentTime = newStartTime;
    }
  };

  const playWithCountIn = () => {
    setCurrentCount(countIn);
  };

  const onPlay = () => {
    fileAudioRef.current.play();
  };

  const onPause = () => {
    if (fileAudioRef.current) {
      fileAudioRef.current.pause();
    }
  };

  const onStop = () => {
    if (fileAudioRef.current) {
      fileAudioRef.current.pause();
      fileAudioRef.current.currentTime = startTime;
    }
  };

  const onVolumeChange = (event) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    if (fileAudioRef.current) {
      fileAudioRef.current.volume = newVolume;
    }
  };

  const onTimelineClick = (event) => {
    if (fileAudioRef.current && progressBarRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const clickPosition = (event.clientX - rect.left) / rect.width;
      fileAudioRef.current.currentTime =
        clickPosition * fileAudioRef.current.duration;
    }
  };

  const onRestart = () => {
    if (fileAudioRef.current) {
      fileAudioRef.current.currentTime = startTime;
    }
  };

  const handleSetTime = () => {
    // get the current time
    const currentTime = fileAudioRef.current.currentTime;
    // set the startTime to the currentTime
    setStartTime(currentTime);
    // pause the video
    fileAudioRef.current.pause();
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <div
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
      <audio ref={fileAudioRef}>
        <source src={audioSrc} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <Box display="flex" justifyContent="center">
        <Box
          maxWidth={550}
          display="flex"
          alignItems="center"
          flexWrap="wrap"
          gap={0}
          justifyContent="space-around"
        >
          <Box
            ref={progressBarRef}
            style={{
              width: 550,
              height: "20px",
              backgroundColor: "#ddd",
              marginTop: "20px",
              position: "relative",
              cursor: "pointer",
            }}
            onClick={onTimelineClick}
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
            <IconButton variant="contained" onClick={onPause}>
              <PauseIcon />
            </IconButton>
          ) : (
            <IconButton variant="contained" onClick={playWithCountIn}>
              <PlayArrowIcon />
            </IconButton>
          )}
          <IconButton variant="contained" onClick={onStop}>
            <StopIcon />
          </IconButton>
          <IconButton variant="contained" onClick={onRestart}>
            <RestartAltIcon />
          </IconButton>
          Volume:
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={onVolumeChange}
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
      <Box display="flex" justifyContent="center">
        <Box
          display="flex"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
          justifyContent="space-around"
        >
          <Typography variant="body1">BPM:</Typography>
          <input
            style={inputStyle}
            type="number"
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
          />
          <TapTempo setMainBpm={setBpm} />

          <Typography variant="body1">Count-In: </Typography>
          <input
            style={inputStyle}
            type="number"
            value={countIn}
            onChange={(e) => setCountIn(Number(e.target.value))}
          />

          <Typography variant="body1">Start Time:</Typography>
          <input
            style={inputStyle}
            type="number"
            value={startTime}
            onChange={onStartTimeChange}
            step="0.01"
          />
        </Box>
      </Box>
    </Box>
  );
}
