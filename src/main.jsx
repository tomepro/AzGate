import React from "react";
import ReactDOM from "react-dom/client";
import CustomCursor from "./components/cursor";
import LoginScreen from "./LoginScreen";
import App from "./App.jsx";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { BrowserRouter } from 'react-router-dom';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useRoutes,
} from "react-router-dom";

ReactDOM.createRoot( document.getElementById( "root" ) ).render(
  <I18nextProvider i18n={i18n}>
    <App />
  </I18nextProvider>
);
