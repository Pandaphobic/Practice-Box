import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AudioContext, AudioProvider } from "@/store/context";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#16171B",
      paper: "#202125",
    },
    primary: {
      main: "#01b075",
    },
    text: {
      primary: "#EEEEEE",
    },
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: '"Rajdhani", sans-serif', // Use Rajdhani as the primary font
  },
});

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider theme={darkTheme}>
      <AudioProvider>
        <CssBaseline />
        <Component {...pageProps} />{" "}
      </AudioProvider>
    </ThemeProvider>
  );
}
