import React from "react";
import { createRoot } from "react-dom/client";
import "zmp-ui/zaui.css";
import appConfig from "../app-config.json";
import MyApp from "./components/app";
import "./css/app.scss";
import "./css/tailwind.css";

if (!window.APP_CONFIG) {
  window.APP_CONFIG = appConfig;
}

// Mount React App
const root = createRoot(document.getElementById("app")!);
root.render(React.createElement(MyApp));
