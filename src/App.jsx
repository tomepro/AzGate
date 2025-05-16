import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";
import PasswdRecoveryScreen from "./PasswdRecoveryScreen";
import HomeScreen from "./HomeScreen";
import ArmoryScreen from "./ArmoryScreen";
import RankingScreen from "./RankingScreen";
import MacrosScreen from "./MacrosScreen";
import ChangelogScreen from "./ChangelogScreen";
import NewsScreen from "./NewsScreen";
import ShopScreen from "./ShopScreen";
import ShoppingCartScreen from "./ShoppingCartScreen";

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
        <Route path="/macrosScreen" element={<MacrosScreen />} />
        <Route path="/changelogScreen" element={<ChangelogScreen />} />
        <Route path="/newsScreen" element={<NewsScreen />} />
        <Route path="/shopScreen" element={<ShopScreen />} />
        <Route path="/shoppingCartScreen" element={<ShoppingCartScreen />} />
      </Routes>
    </Router>
  );
}

export default App;