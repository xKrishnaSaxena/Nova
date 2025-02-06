import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Deposit from "./pages/Deposit";
import Withdraw from "./pages/Withdraw";
import CreateTokenPage from "./pages/CreateTokenSPL";
import MintTokenPage from "./pages/MintTokenSPL";
import TransferTokenPage from "./pages/TransferTokenSPL";
import BurnTokenPage from "./pages/BurnTokenSPL";

import ManageAuthorityPage from "./pages/ManageAuthoritySPL";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element=<Home /> />
        <Route path="/login" element=<Login /> />
        <Route path="/signup" element=<Signup /> />
        <Route path="/deposit" element=<Deposit /> />
        <Route path="/withdraw" element=<Withdraw /> />
        <Route path="/spl-create" element=<CreateTokenPage /> />
        <Route path="/spl-mint" element=<MintTokenPage /> />
        <Route path="/spl-transfer" element=<TransferTokenPage /> />
        <Route path="/spl-burn" element=<BurnTokenPage /> />
        <Route path="/spl-manage" element=<ManageAuthorityPage /> />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
