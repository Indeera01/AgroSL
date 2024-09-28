import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { SpeedInsights } from "@vercel/speed-insights/react";

const theme = createTheme({
  palette: {
    primary: {
      main: "#4B8412",
    },
    secondary: {
      main: "#000000",
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
      <SpeedInsights />
    </ThemeProvider>
  </React.StrictMode>
);
