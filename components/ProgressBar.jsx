import { Box } from "@mui/material";
import React from "react";

export default function ProgressBar({ onTimelineClick, progress }) {
  return (
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
  );
}
