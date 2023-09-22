import { useEffect, useRef, useState } from "react";
import { useAudio } from "@/store/context";
import { Box, IconButton, Input, Typography } from "@mui/material";

// Material UI Icons
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
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

export default function FilePlayer({ audioSrc }) {
  const fileAudioRef = useRef(null);
  const progressBarRef = useRef(null);

  const {
    volume,
    setVolume,
    countIn,
    setCurrentCount,
    startTime,
    bpm,
    setBpm,
    setStartTime,
  } = useAudio();

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const audioElement = fileAudioRef.current;
    const handleTimeUpdate = () => {
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

  const onStop = () => {
    if (fileAudioRef.current) {
      fileAudioRef.current.pause();
      fileAudioRef.current.currentTime = startTime;
    }
  };

  const onRestart = () => {
    if (fileAudioRef.current) {
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
  // THIS COULD BE BETTER
  const playWithCountIn = () => {
    setCurrentCount(countIn);
    if (fileAudioRef.current) {
      fileAudioRef.current.play();
    }
  };
  const onStartTimeChange = (event) => {
    const newStartTime = parseFloat(event.target.value);
    setStartTime(newStartTime);
    if (fileAudioRef.current) {
      fileAudioRef.current.currentTime = newStartTime;
    }
  };

  return (
    <Box>
      <audio ref={fileAudioRef}>
        <source src={audioSrc} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
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
      <IconButton variant="contained" onClick={playWithCountIn}>
        <PlayArrowIcon />
      </IconButton>
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
        onChange={(e) => setCurrentCount(Number(e.target.value))}
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
  );
}
