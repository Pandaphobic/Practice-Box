import { Button } from "@mui/material";
import { useEffect, useState } from "react";

const MAX_TAP_INTERVAL = (60 / 50) * 1000; // Equivalent to 50 BPM

export function TapTempo({ setMainBpm }) {
  const [taps, setTaps] = useState([]);
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
      setMainBpm(Math.round((60 * 1000) / averageInterval));
    }
  };

  return (
    <Button
      style={{
        width: "2",
        borderRadius: "6px",
        padding: "0",
      }}
      variant="contained"
      onClick={handleTap}
    >
      Tap
    </Button>
  );
}
