import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./router/AppRouter";
import studio from "@theatre/studio";
import extension from "@theatre/r3f/dist/extension";
import "./index.css";



ReactDOM.createRoot(document.getElementById("root")).render(
    <AppRouter />
);
