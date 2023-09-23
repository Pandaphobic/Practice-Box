import { Typography } from "@mui/material";
import React from "react";

export default function Countdown({ currentCount }) {
  return (
    <Typography variant="h1" color="primary" style={{ fontWeight: "600" }}>
      {currentCount}
    </Typography>
  );
}
