import React, { useState, useRef, useEffect } from "react";

function AudioDropzone() {
  const [audioSrc, setAudioSrc] = useState(null);
  const [startTime, setStartTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);

  const onDrop = (event) => {
    event.preventDefault();

    if (event.dataTransfer.items) {
      for (let i = 0; i < event.dataTransfer.items.length; i++) {
        if (event.dataTransfer.items[i].kind === "file") {
          const file = event.dataTransfer.items[i].getAsFile();
          const objectURL = URL.createObjectURL(file);
          setAudioSrc(objectURL);
        }
      }
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.ontimeupdate = () => {
        setProgress(
          (audioRef.current.currentTime / audioRef.current.duration) * 100
        );
      };
    }
  }, [audioSrc]);

  const onDragOver = (event) => {
    event.preventDefault();
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

  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      style={{
        border: "2px dashed #aaa",
        padding: "20px",
        position: "relative",
        height: "200px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      Drop your audio file here
      {audioSrc && (
        <div>
          <audio ref={audioRef} style={{ display: "none" }}>
            <source src={audioSrc} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
          <button onClick={onPlay}>Play</button>
          <button onClick={onStop}>Stop and Reset</button>
          <div>
            Volume:
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={onVolumeChange}
            />
          </div>
          <div>
            Start Time:
            <input
              type="number"
              value={startTime}
              onChange={onTimeChange}
              step="0.1"
            />
          </div>
          <div
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
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                height: "100%",
                width: `${progress}%`,
                backgroundColor: "#666",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default AudioDropzone;
