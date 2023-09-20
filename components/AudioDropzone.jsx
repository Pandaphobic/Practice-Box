import React, { useState } from "react";
import AudioPlayer from "./AudioPlayer";
import { Box, Typography } from "@mui/material";
import YouTubeComponent from "./YTPlayer";

export default function AudioDropzone() {
  const [audioSrc, setAudioSrc] = useState(null);

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

  const onDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <Box>
      {!audioSrc && (
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
            borderRadius: "10px",
          }}
        >
          <Typography variant="h5">Drop your audio file here</Typography>
        </div>
      )}
      <YouTubeComponent />
      <AudioPlayer audioSrc={audioSrc} />
    </Box>
  );
}
