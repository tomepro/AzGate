import React from "react";
import ReactDOM from "react-dom/client";
import CustomCursor from "./components/cursor";
import App from "./App";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";

ReactDOM.createRoot( document.getElementById( "root" ) ).render(
  <I18nextProvider i18n={i18n}>
    <CustomCursor />
    <App />
  </I18nextProvider>
);
