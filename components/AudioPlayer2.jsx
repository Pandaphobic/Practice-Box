import React from "react";

export default function AudioPlayer2({ source }) {
  // Accepts either a file src, or a youtube URL
  // File src must be a drag and drop, or a file open dialog
  // Youtube URL must be a text input

  // If a file src is provided, render the AudioPlayer component
  source.src ? (
    <AudioPlayer source={source.src} />
  ) : (
    <YTPlayer source={source.ytUrl} />
  );
}
