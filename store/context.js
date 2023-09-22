import React, { createContext, useContext, useState, useRef } from "react";

// Create the AudioContext
export const AudioContext = createContext();

export const useAudio = () => {
  return useContext(AudioContext);
};

export const AudioProvider = ({ children }) => {
  // Only the state
  const [bpm, setBpm] = useState(140);
  const [countIn, setCountIn] = useState(4);
  const [currentCount, setCurrentCount] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [volume, setVolume] = useState(0.45);
  const [progress, setProgress] = useState(0);

  const blockAudioRef = useRef(null);

  return (
    <AudioContext.Provider
      value={{
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
        blockAudioRef,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};
