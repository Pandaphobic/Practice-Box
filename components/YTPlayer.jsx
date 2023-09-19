import React from "react";
import YTPlayer from "yt-player";

export default function YTVideoPlayer({ ytSource }) {
  const [player, setPlayer] = React.useState(null);
  YTPlayer.player = player;

  useEffect(() => {
    const ytPlayer = new YTPlayer("#youtube-player");
    ytPlayer.load(ytSource, true);

    ytPlayer.on("timeupdate", (time) => {
      const percentage = (time / ytPlayer.getDuration()) * 100;
      setProgress(percentage);
    });

    setPlayer(ytPlayer);

    // Cleanup
    return () => {
      ytPlayer.destroy();
    };
  }, [ytSource]);

  return <div id="youtube-player" style={{ display: "none" }}></div>;
}
