import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { QueryClient, QueryClientProvider } from "react-query";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'

// optional configuration
const alertOptions = {
  // you can also just use 'bottom center'
  position: positions.MIDDLE,
  timeout: 5000,
  offset: '30px',
  // you can also just use 'scale'
  transition: transitions.SCALE
}

const queryClient = new QueryClient();

const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
});

ReactDOM.render(
    <React.StrictMode>
        <ThemeProvider theme={darkTheme}>
            <AlertProvider template={AlertTemplate} {...alertOptions}>
                <QueryClientProvider client={queryClient}>
                    <CssBaseline/>
                    <App />
                </QueryClientProvider>
            </AlertProvider>
        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
