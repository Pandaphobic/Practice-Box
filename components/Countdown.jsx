import { Typography } from "@mui/material";
import React from "react";

export default function Countdown({ currentCount, blockAudioRef }) {
  return (
    <>
      <audio id="block-audio" ref={blockAudioRef} src="/block.wav"></audio>
      <Typography variant="h1" color="primary" style={{ fontWeight: "600" }}>
        {currentCount}
      </Typography>
    </>
  );
}
