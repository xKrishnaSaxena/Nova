import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Deposit from "./pages/Deposit";
import Withdraw from "./pages/Withdraw";
import CreateTokenPage from "./pages/tokenSPL/CreateTokenSPL";
import MintTokenPage from "./pages/tokenSPL/MintTokenSPL";
import TransferTokenPage from "./pages/tokenSPL/TransferTokenSPL";
import BurnTokenPage from "./pages/tokenSPL/BurnTokenSPL";

import ManageAuthorityPage from "./pages/tokenSPL/ManageAuthoritySPL";
import CreateTokenPageERC from "./pages/tokenERC/CreateTokenERC";
import MintTokenPageERC from "./pages/tokenERC/MintTokenERC";
import BurnPage from "./pages/tokenERC/BurnTokenERC";
import TransferPage from "./pages/tokenERC/TransferTokenERC";
import SwapSPL from "./pages/tokenSPL/SwapSPL";

function App({ activeSection }: { activeSection: "solana" | "ethereum" }) {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element=<Home activeSection={activeSection} /> />
        <Route path="/login" element=<Login /> />
        <Route path="/signup" element=<Signup /> />
        <Route path="/deposit" element=<Deposit /> />
        <Route path="/withdraw" element=<Withdraw /> />
        <Route path="/spl-create" element=<CreateTokenPage /> />
        <Route path="/spl-mint" element=<MintTokenPage /> />
        <Route path="/spl-transfer" element=<TransferTokenPage /> />
        <Route path="/spl-burn" element=<BurnTokenPage /> />
        <Route path="/spl-manage" element=<ManageAuthorityPage /> />
        <Route path="/spl-swap" element=<SwapSPL /> />
        <Route path="/erc-create" element=<CreateTokenPageERC /> />
        <Route path="/erc-mint" element=<MintTokenPageERC /> />
        <Route path="/erc-burn" element=<BurnPage /> />
        <Route path="/erc-transfer" element=<TransferPage /> />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
