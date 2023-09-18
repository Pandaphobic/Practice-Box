import React, { useState, useEffect, useRef } from "react";
import AudioDropzone from "./AudioDropzone";

function AudioWrapper() {
  const [bpm, setBpm] = useState(0);
  const [countIn, setCountIn] = useState(0);
  const [currentCount, setCurrentCount] = useState(null);
  const [isFlashing, setIsFlashing] = useState(false);

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

  const playWithCountIn = () => {
    setCurrentCount(countIn);
  };

  return (
    <div>
      <div
        style={{ marginBottom: "20px", display: "flex", flexDirection: "row" }}
      >
        <audio id="block-audio" ref={blockAudioRef} src="/block.wav"></audio>

        <p>
          BPM:
          <input
            type="number"
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
          />
        </p>
        <TapTempo setMainBpm={setBpm} />
        <p>
          Count In (beats):
          <input
            type="number"
            value={countIn}
            onChange={(e) => setCountIn(Number(e.target.value))}
          />
        </p>
        <button onClick={playWithCountIn}>Play with Count-In</button>
      </div>
      {currentCount !== null && (
        <div
          style={{
            fontSize: "100px",
            textAlign: "center",
            backgroundColor: "black",
            color: isFlashing ? "white" : "black",
            transition: "color 0.2s",
          }}
        >
          {currentCount}
        </div>
      )}
      <AudioDropzone />
    </div>
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

  return <button onClick={handleTap}>Tap</button>;
}

export default AudioWrapper;
