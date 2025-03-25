import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";
import PasswdRecoveryScreen from "./PasswdRecoveryScreen";
import HomeScreen from "./HomeScreen";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/RegisterScreen" element={<RegisterScreen />} />
        <Route path="/PasswdRecoveryScreen" element={<PasswdRecoveryScreen />} />
        <Route path="/home" element={<HomeScreen />} />
      </Routes>
    </Router>
  );
}

export default App;