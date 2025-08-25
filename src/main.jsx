import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./router/AppRouter";
import studio from "@theatre/studio";
import extension from "@theatre/r3f/dist/extension";
import "./index.css";

const CURRENT_VERSION = '2.3.0';
const storedVersion = localStorage.getItem('app_version');

if (storedVersion !== CURRENT_VERSION) {
  localStorage.clear();
  localStorage.setItem('app_version', CURRENT_VERSION);
  window.location.reload();
}

ReactDOM.createRoot(document.getElementById("root")).render(
    <AppRouter />
);
