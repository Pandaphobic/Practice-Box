import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Card,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
// Icons
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import PauseIcon from "@mui/icons-material/Pause";

export default function AudioPlayer({ audioSrc }) {
  // Metronome state
  const [bpm, setBpm] = useState(140);
  const [countIn, setCountIn] = useState(4);
  const [currentCount, setCurrentCount] = useState(null);
  const [isFlashing, setIsFlashing] = useState(false);
  // Imported audio state
  const [startTime, setStartTime] = useState(0);
  const [volume, setVolume] = useState(0.45);
  const [progress, setProgress] = useState(0);
  // Song / imported audio
  const audioRef = useRef(null);
  // Block sound
  const blockAudioRef = useRef(null);

  useEffect(() => {
    if (currentCount !== null && currentCount > 0) {
      const millisecondsPerBeat = (60 / bpm) * 1000;

      // Play the block sound for every number except 0
      if (blockAudioRef.current) {
        blockAudioRef.current.currentTime = 0; // Reset audio to start
        blockAudioRef.current.play();
      }

      setIsFlashing(true); // Visual cue for countdown

      const countdownInterval = setInterval(() => {
        setCurrentCount((prevCount) => prevCount - 1);
        setIsFlashing(false); // Reset flashing
      }, millisecondsPerBeat);

      return () => {
        clearInterval(countdownInterval); // Clean up the interval
      };
    } else if (currentCount === 0) {
      const audioElement = document.querySelector("audio:not(#block-audio)");
      if (audioElement) {
        audioElement.play();
      }
      setCurrentCount(null); // Reset currentCount
    }
  }, [currentCount, bpm]);

  useEffect(() => {
    const audioElement = audioRef.current;
    const handleTimeUpdate = () => {
      const percentage =
        (audioElement.currentTime / audioElement.duration) * 100;
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
  }, []);

  const playWithCountIn = () => {
    setCurrentCount(countIn);
  };

  const onTimeChange = (event) => {
    const newStartTime = parseFloat(event.target.value);
    setStartTime(newStartTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newStartTime;
    }
  };

  const onPlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const onStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = startTime;
    }
  };

  const onRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = startTime;
    }
  };

  const onVolumeChange = (event) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const onTimelineClick = (event) => {
    if (audioRef.current) {
      const rect = event.target.getBoundingClientRect();
      const clickPosition = (event.clientX - rect.left) / rect.width;
      audioRef.current.currentTime = clickPosition * audioRef.current.duration;
    }
  };

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

  return (
    <Box>
      {currentCount !== null && (
        <Box
          style={{
            fontSize: "100px",
            textAlign: "center",
            backgroundColor: "black",
            color: isFlashing ? "white" : "black",
            transition: "color 0.2s",
          }}
        >
          {currentCount}
        </Box>
      )}
      <Card style={{ padding: "20px", marginTop: "20px" }}>
        <audio id="block-audio" ref={blockAudioRef} src="/block.wav"></audio>

        <Grid container xs={12}>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              justifyContent: "center",
              paddingBottom: "1em",
            }}
          >
            <Typography
              variant="h5"
              color="primary"
              style={{ fontWeight: "600" }}
            >
              Practice Box
            </Typography>
          </Grid>

          <Grid
            item
            xs={4}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
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
          </Grid>
          <Grid
            item
            xs={4}
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "left",
            }}
          >
            <Typography variant="body1">Count-In: </Typography>
            <input
              style={inputStyle}
              size="small"
              type="number"
              value={countIn}
              onChange={(e) => setCountIn(Number(e.target.value))}
            />
          </Grid>
          <Grid
            item
            xs={4}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "left",
            }}
          >
            <Typography variant="body1">Start Time:</Typography>
            <input
              style={inputStyle}
              size="small"
              type="number"
              value={startTime}
              onChange={onTimeChange}
              step="0.01"
            />
          </Grid>
        </Grid>
        <Grid item xs={2} style={{ paddingTop: "1em" }}>
          <Box
            style={{
              // take up all available space
              width: "100%",
              height: "325px",
              // make it a flex container
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#000000",
            }}
          >
            <Typography variant="h5">Imported Audio</Typography>
            <Typography variant="body1">
              The imported audio will play at {bpm} BPM.
            </Typography>
          </Box>
          <Box
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
          <Box id="controls">
            <IconButton variant="contained" onClick={onPlay}>
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
          </Box>
        </Grid>
      </Card>

      <Box>
        <audio ref={audioRef} style={{ display: "none" }}>
          <source src={audioSrc} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </Box>
    </Box>
  );
}
const MAX_TAP_INTERVAL = (60 / 50) * 1000; // Equivalent to 50 BPM

function TapTempo({ setMainBpm }) {
  const [taps, setTaps] = useState([]);
  const [bpm, setBpm] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(null);

  useEffect(() => {
    if (lastTapTime && Date.now() - lastTapTime > MAX_TAP_INTERVAL) {
      setTaps([]); // Clear taps if the interval exceeds the max tap interval
      setLastTapTime(null);
    }
  }, [lastTapTime]);

  const handleTap = () => {
    const now = Date.now();
    setLastTapTime(now);

    const newTaps = [...taps, now];
    if (newTaps.length > 4) {
      newTaps.shift(); // Remove the oldest tap if we exceed 4 taps
    }
    setTaps(newTaps);

    if (newTaps.length > 1) {
      const intervals = [];
      for (let i = 1; i < newTaps.length; i++) {
        intervals.push(newTaps[i] - newTaps[i - 1]);
      }
      const averageInterval =
        intervals.reduce((a, b) => a + b) / intervals.length;
      setBpm(Math.round((60 * 1000) / averageInterval));
      setMainBpm(Math.round((60 * 1000) / averageInterval));
    }
  };

  return (
    <Button
      style={{
        width: "2",
        borderRadius: "6px",
        padding: "0",
      }}
      variant="contained"
      onClick={handleTap}
    >
      Tap
    </Button>
  );
}
