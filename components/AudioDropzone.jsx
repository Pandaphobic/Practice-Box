import React, { useState } from "react";
import AudioPlayer from "./AudioPlayer";

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
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      style={{
        border: !audioSrc ? "2px dashed #aaa" : "none",
        padding: "20px",
        position: "relative",
        height: "200px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {audioSrc ? (
        <AudioPlayer audioSrc={audioSrc} />
      ) : (
        <p>Drop your audio file here</p>
      )}
    </div>
  );
}
