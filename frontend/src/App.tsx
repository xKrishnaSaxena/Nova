import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Deposit from "./pages/Deposit";
import Withdraw from "./pages/Withdraw";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element=<Home /> />
        <Route path="/login" element=<Login /> />
        <Route path="/signup" element=<Signup /> />
        <Route path="/deposit" element=<Deposit /> />
        <Route path="/withdraw" element=<Withdraw /> />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
