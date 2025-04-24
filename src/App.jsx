import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";
import PasswdRecoveryScreen from "./PasswdRecoveryScreen";
import HomeScreen from "./HomeScreen";
import ArmoryScreen from "./ArmoryScreen";
import RankingScreen from "./rankingScreen";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/registerScreen" element={<RegisterScreen />} />
        <Route path="/passwdRecoveryScreen" element={<PasswdRecoveryScreen />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/armoryScreen" element={<ArmoryScreen />} />
        <Route path="/rankingScreen" element={<RankingScreen />} />
      </Routes>
    </Router>
  );
}

export default App;