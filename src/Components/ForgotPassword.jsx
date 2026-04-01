import { useEffect, useMemo, useState } from "react";
import "./ForgotPassword.css";

export default function ForgotPassword({ setView }) {
  // ====== ESTADO ======
  const [step, setStep] = useState("search"); // search | method | code | password | reset
  const [contact, setContact] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [selectedMethod, setSelectedMethod] = useState("code");

  const [verificationCode, setVerificationCode] = useState("");
  const [codeSubmitted, setCodeSubmitted] = useState(false);

  const [password, setPassword] = useState("");
  const [passwordLoginSubmitted, setPasswordLoginSubmitted] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [passwordSubmitted, setPasswordSubmitted] = useState(false);
  const [logoutAll, setLogoutAll] = useState(false);

  const [cooldown, setCooldown] = useState(0);
  const [showToast, setShowToast] = useState(false);

  // ====== COOLDOWN ======
  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  // ====== VALIDACIONES ======
  const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  const isValidPhone = (v) => {
    const d = v.replace(/\D/g, "");
    return d.length >= 10 && d.length <= 15;
  };
  const isValidContact = (v) => isValidEmail(v) || isValidPhone(v);

  const contactEmpty = submitted && contact.trim() === "";
  const contactInvalid =
    submitted && contact.trim() !== "" && !isValidContact(contact);

  // ====== MASK DINÁMICO ======
  const foundAccount = useMemo(() => {
    const trimmed = contact.trim();

    const maskEmail = (email) => {
      const [local, domain] = email.split("@");
      if (!local || !domain) return email;
      const visible = local[0];
      const masked = "*".repeat(Math.max(local.length - 1, 3));
      return `${visible}${masked}@${domain}`;
    };

    const maskPhone = (phone) => {
      const digits = phone.replace(/\D/g, "");
      if (digits.length < 4) return phone;
      const last4 = digits.slice(-4);
      return `*** *** ${last4}`;
    };

    return {
      name: "Ale Rivera",
      provider: "Alesitos Net",
      maskedDestination: isValidEmail(trimmed)
        ? maskEmail(trimmed)
        : maskPhone(trimmed),
    };
  }, [contact]);

  // ====== CLASE INPUT OTP ======
  const getCodeInputClassName = () => {
    const empty = codeSubmitted && verificationCode.trim() === "";
    const invalid =
      codeSubmitted &&
      verificationCode.trim() !== "" &&
      !/^\d{6}$/.test(verificationCode);

    if (empty || invalid) return "forgot-input input-error";
    if (/^\d{6}$/.test(verificationCode))
      return "forgot-input input-success";

    return "forgot-input";
  };

  // ====== HANDLERS ======
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!isValidContact(contact)) return;
    setStep("method");
  };

  const handleContinueMethod = () => {
    if (selectedMethod === "code") {
      setStep("code");
    } else {
      setStep("password"); // 👈 pantalla tipo imagen 2
    }
  };

  const handleResendCode = () => {
    if (cooldown > 0) return;
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    setCooldown(30);
  };

  const handleVerifyCode = (e) => {
    e.preventDefault();
    setCodeSubmitted(true);
    if (!/^\d{6}$/.test(verificationCode)) return;
    setStep("reset");
  };

  const handleLoginWithPassword = (e) => {
    e.preventDefault();
    setPasswordLoginSubmitted(true);
    if (password.trim() === "") return;

    console.log("Login con contraseña:", password);
    alert("Aquí validarías login real");
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    setPasswordSubmitted(true);
    if (newPassword.length < 6) return;

    console.log("Nueva contraseña:", newPassword);
    console.log("Cerrar sesiones:", logoutAll);

    alert("Contraseña actualizada correctamente");
  };

  // ====== STEP: RESET ======
  if (step === "reset") {
    return (
      <div className="forgot-page">
        <div className="forgot-wrapper">
          <h1 className="forgot-title">Crea una contraseña nueva</h1>

          <p className="forgot-subtitle">
            Usarás esta contraseña para iniciar sesión en tu cuenta. Crea una que
            tenga al menos 6 caracteres.
          </p>

          <div className="account-card">
            <div className="account-avatar">AR</div>
            <div className="account-info">
              <p className="account-name">{foundAccount.name}</p>
              <p className="account-provider">
                {foundAccount.provider}
              </p>
            </div>
          </div>

          <form onSubmit={handleResetPassword} className="forgot-form">
            <input
              type="password"
              placeholder="Contraseña nueva"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`forgot-input ${
                passwordSubmitted && newPassword.length < 6
                  ? "input-error"
                  : ""
              }`}
            />

            {passwordSubmitted && newPassword.length < 6 && (
              <p className="forgot-message forgot-error with-icon">
                Debe tener al menos 6 caracteres.
              </p>
            )}

            <button className="forgot-primary-button">
              Continuar
            </button>

            <button
              type="button"
              className="forgot-secondary-button"
              onClick={() => alert("Se omitió el cambio de contraseña")}
            >
              Omitir
            </button>

            <label className="logout-checkbox">
              <input
                type="checkbox"
                checked={logoutAll}
                onChange={() => setLogoutAll(!logoutAll)}
              />
              <span>
                Cerrar el resto de las sesiones para asegurarte de que nadie más
                pueda acceder a tu cuenta
              </span>
            </label>
          </form>
        </div>
      </div>
    );
  }

  // ====== STEP: PASSWORD (imagen 2) ======
  if (step === "password") {
    return (
      <div className="forgot-page">
        <div className="forgot-wrapper">
          <button
            type="button"
            className="forgot-back-button"
            onClick={() => setStep("method")}
          >
            ←
          </button>

          <div className="account-card">
            <div className="account-avatar">AR</div>
            <div className="account-info">
              <p className="account-name">{foundAccount.name}</p>
              <p className="account-provider">
                {foundAccount.provider}
              </p>
            </div>
          </div>

          <form onSubmit={handleLoginWithPassword} className="forgot-form">
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`forgot-input ${
                passwordLoginSubmitted && password.trim() === ""
                  ? "input-error"
                  : ""
              }`}
            />

            {passwordLoginSubmitted && password.trim() === "" && (
              <p className="forgot-message forgot-error with-icon">
                Deberás ingresar una contraseña para continuar.
              </p>
            )}

            <button className="forgot-primary-button">
              Iniciar sesión
            </button>

            <button
              type="button"
              className="forgot-secondary-button"
              onClick={() => setStep("method")}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ====== STEP: CODE ======
  if (step === "code") {
    return (
      <div className="forgot-page">
        <div className="forgot-wrapper">
          <button
            className="forgot-back-button"
            onClick={() => setStep("method")}
          >
            ←
          </button>

          {cooldown > 0 && (
            <div className="cooldown-banner">
              Espera {cooldown}s antes de solicitar un nuevo código
            </div>
          )}

          <h1 className="forgot-title">Confirma tu cuenta</h1>

          <p className="forgot-subtitle">
            Enviamos un código a{" "}
            <strong>{foundAccount.maskedDestination}</strong>. Ingrésalo para
            confirmar tu cuenta.
          </p>

          <form onSubmit={handleVerifyCode} className="forgot-form">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={verificationCode}
              onChange={(e) =>
                setVerificationCode(e.target.value.replace(/\D/g, ""))
              }
              className={getCodeInputClassName()}
              placeholder="Ingresa el código"
            />

            {codeSubmitted && verificationCode.trim() === "" && (
              <p className="forgot-message forgot-error with-icon">
                Ingresa un código.
              </p>
            )}

            {codeSubmitted &&
              verificationCode.trim() !== "" &&
              !/^\d{6}$/.test(verificationCode) && (
                <p className="forgot-message forgot-error with-icon">
                  El código debe tener 6 dígitos.
                </p>
              )}

            <button className="forgot-primary-button">
              Continuar
            </button>

            <button
              type="button"
              className={`forgot-secondary-button ${
                cooldown > 0 ? "button-disabled" : ""
              }`}
              onClick={handleResendCode}
              disabled={cooldown > 0}
            >
              {cooldown > 0
                ? `Reenviar en ${cooldown}s`
                : "¿No recibiste el código?"}
            </button>
          </form>
        </div>

        {showToast && (
          <div className="toast">
            Se ha enviado el código correctamente
          </div>
        )}
      </div>
    );
  }

  // ====== STEP: METHOD (imagen 1) ======
  if (step === "method") {
    return (
      <div className="forgot-page">
        <div className="forgot-wrapper">
          <button
            type="button"
            className="forgot-back-button"
            onClick={() => setStep("search")}
          >
            ←
          </button>

          <h1 className="forgot-title">
            Elige un método para iniciar sesión
          </h1>

          <div className="account-card">
            <div className="account-avatar">AR</div>
            <div className="account-info">
              <p className="account-name">{foundAccount.name}</p>
              <p className="account-provider">
                {foundAccount.provider}
              </p>
            </div>
          </div>

          <div className="method-card">
            <button
              type="button"
              className={`method-option ${
                selectedMethod === "code"
                  ? "method-option-selected"
                  : ""
              }`}
              onClick={() => setSelectedMethod("code")}
            >
              <div className="method-texts">
                <p className="method-title">
                  Obtener código por correo electrónico
                </p>
                <p className="method-subtitle">
                  {foundAccount.maskedDestination}
                </p>
              </div>

              <span
                className={`radio-circle ${
                  selectedMethod === "code"
                    ? "radio-circle-selected"
                    : ""
                }`}
              />
            </button>

            <button
              type="button"
              className={`method-option ${
                selectedMethod === "password"
                  ? "method-option-selected"
                  : ""
              }`}
              onClick={() => setSelectedMethod("password")}
            >
              <div className="method-texts">
                <p className="method-title">
                  Continuar con contraseña
                </p>
                <p className="method-subtitle">
                  Usa tu contraseña para continuar
                </p>
              </div>

              <span
                className={`radio-circle ${
                  selectedMethod === "password"
                    ? "radio-circle-selected"
                    : ""
                }`}
              />
            </button>
          </div>

          <button className="forgot-link-button">
            ¿Ya no tienes acceso?
          </button>

          <button
            className="forgot-primary-button"
            onClick={handleContinueMethod}
          >
            Continuar
          </button>

          <button
            className="forgot-secondary-button"
            onClick={() => {
              setStep("search");
              setContact("");
              setSubmitted(false);
            }}
          >
            ¿No eres tú?
          </button>
        </div>
      </div>
    );
  }

  // ====== STEP: SEARCH ======
  return (
    <div className="forgot-page">
      <div className="forgot-wrapper">
        <button
          className="forgot-back-button"
          onClick={() => setView("login")}
        >
          ←
        </button>

        <h1 className="forgot-title">Encuentra tu cuenta</h1>
        <h1 className="forgot-subtitle">Ingresa tu número de celular o correo electrónico para recuperar tu contraseña</h1>

        <form onSubmit={handleSearchSubmit} className="forgot-form">
          <input
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className={`forgot-input ${
              contactEmpty || contactInvalid ? "input-error" : ""
            }`}
            placeholder="Correo o celular"
          />

          {contactEmpty && (
            <p className="forgot-message forgot-error with-icon">
              Deberás ingresar un número de celular o correo electrónico para continuar.
            </p>
          )}

          {contactInvalid && (
            <p className="forgot-message forgot-error with-icon">
              Formato inválido
            </p>
          )}

          <button className="forgot-primary-button">
            Continuar
          </button>
        </form>
      </div>
    </div>
  );
}