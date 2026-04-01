import { useState } from "react";
import Login from "./Components/Login";
import Register from "./Components/Register";
import ForgotPassword from "./Components/ForgotPassword";

function App() {
  const [view, setView] = useState("login");

  return (
    <>
      {view === "login" && <Login setView={setView} />}
      {view === "register" && <Register setView={setView} />}
      {view === "forgot" && <ForgotPassword setView={setView} />}
    </>
  );
}

export default App;
