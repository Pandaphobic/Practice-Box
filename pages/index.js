import AudioPlayer from "@/components/AudioPlayer";
import FilePlayer from "@/components/FilePlayer";
import YouTubeComponent from "@/components/YTPlayer";
import { Box, Card, CardContent, TextField, Typography } from "@mui/material";
import { useState } from "react";

export default function Home() {
  const [audioSrc, setAudioSrc] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const onDrop = (event) => {
    event.preventDefault();

    setVideoUrl("");

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
    <>
      <Box>
        <Card
          style={{
            maxWidth: 700,
            // center on screen
            margin: "auto",
            marginTop: "20px",
            marginBottom: "20px",
          }}
        >
          <CardContent>
            {!(audioSrc || videoUrl) && (
              <>
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
                  <Typography variant="h5">
                    Drop your audio file here
                  </Typography>
                </div>
                <div
                  style={{
                    border: "2px dashed #aaa",
                    padding: "20px",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "10px",
                  }}
                >
                  <TextField
                    id="outlined-basic"
                    label="YouTube URL"
                    variant="outlined"
                    value={videoUrl}
                    onChange={(event) => {
                      setVideoUrl(event.target.value);
                    }}
                  />
                </div>
              </>
            )}

            {videoUrl && <YouTubeComponent videoUrl={videoUrl} />}
            {audioSrc && <FilePlayer audioSrc={audioSrc} />}
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
