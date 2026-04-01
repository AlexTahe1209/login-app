import { useState } from "react";
import "./Login.css";
import modemImage from "../assets/modem.jpg";

export default function Login({ setView }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Completa correo y contraseña.");
      return;
    }

    console.log("Login data:", { email, password });
  };

  
 const handleRegister = () => {
  setView("register");
};

const handleForgotPassword = () => {
  setView("forgot");
};

  return (
    <div className="login-page">
      <div className="login-left">
        <h1 className="login-heading">
          Velocidad
          <br />
          <span>en la palma</span>
          <br />
          de tu mano.
        </h1>

        <div className="login-image-wrapper">
          <img src={modemImage} alt="Conectividad y velocidad" className="login-image" />
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <h2 className="login-title">Iniciar sesión</h2>

          <form onSubmit={handleSubmit} className="login-form">
            <input
              type="email"
              placeholder="Correo electrónico o número de celular"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
            />

            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
            />

            {error && <p className="login-error">{error}</p>}

            <button type="submit" className="btn-primary">
              Iniciar sesión
            </button>
          </form>

          <button type="button" onClick={handleForgotPassword} className="link-button">
            ¿Olvidaste tu contraseña?
          </button>

          <div className="divider" />

          <button type="button" onClick={handleRegister} className="btn-secondary">
            Crear cuenta nueva
          </button>

          <p className="brand-text">Alesitos Net</p>
        </div>
      </div>
    </div>
  );
}