import { Route, Routes } from "react-router-dom";
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
import CreatedTokens from "./components/tokenSPL/TokenList";
import ManageAuthorityERC20Page from "./pages/tokenERC/ManageAuthoritiesERC";

function App({ activeSection }: { activeSection: "solana" | "ethereum" }) {
  return (
    <Routes>
      <Route index element=<Home activeSection={activeSection} /> />
      <Route path="/login" element=<Login activeSection={activeSection} /> />
      <Route path="/signup" element=<Signup activeSection={activeSection} /> />
      <Route
        path="/deposit"
        element=<Deposit activeSection={activeSection} />
      />
      <Route
        path="/withdraw"
        element=<Withdraw activeSection={activeSection} />
      />
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
      <Route path="/erc-manage" element=<ManageAuthorityERC20Page /> />
      <Route
        path="/created-tokens"
        element=<CreatedTokens activeSection={activeSection} />
      />
    </Routes>
  );
}

export default App;
