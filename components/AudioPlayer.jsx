import React, { useState, useEffect, useRef } from "react";
import { Box, Button, Card, Grid, IconButton, Typography } from "@mui/material";
// Icons
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { TapTempo } from "./TapTempo";
import Countdown from "./Countdown";
import ProgressBar from "./ProgressBar";
import { useAudio } from "@/store/context";

export default function AudioPlayer({ audioSrc }) {
  // Metronome state
  const {
    bpm,
    setBpm,
    countIn,
    setCountIn,
    currentCount,
    setCurrentCount,
    startTime,
    setStartTime,
    volume,
    setVolume,
    progress,
    setProgress,
    audioRef,
    blockAudioRef,
  } = useAudio();

  console.log("audioSrc", audioSrc);

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
      const audioElement = audioRef.current;
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
      {audioSrc && (
        <Card style={{ padding: "20px", marginTop: "20px" }}>
          <audio id="block-audio" ref={blockAudioRef} src="/block.wav"></audio>

          <Grid container>
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
              onChange={onTimeChange}
              step="0.01"
            />
          </Grid>
          <Grid item xs={2} style={{ paddingTop: "1em" }}>
            <Countdown currentCount={currentCount} />

            {/* PROGRESS BAR */}
            <ProgressBar
              onTimelineClick={onTimelineClick}
              progress={progress}
            />
            <Box id="controls">
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
            </Box>
          </Grid>
          <Box>
            <audio ref={audioRef}>
              <source src={audioSrc} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </Box>
        </Card>
      )}
    </Box>
  );
}
