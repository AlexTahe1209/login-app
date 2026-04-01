import { useMemo, useState, useEffect } from "react";
import "./ForgotPassword.css";

export default function ForgotPassword({ setView }) {
  const [cooldown, setCooldown] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [step, setStep] = useState("search");
  const [contact, setContact] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("code");
  const [verificationCode, setVerificationCode] = useState("");
  const [codeSubmitted, setCodeSubmitted] = useState(false);
  const [codeError, setCodeError] = useState("");

  useEffect(() => {
  if (cooldown <= 0) return;

  const interval = setInterval(() => {
    setCooldown((prev) => prev - 1);
  }, 1000);

  return () => clearInterval(interval);
}, [cooldown]);

  const isValidEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value.trim());
  };

  const isValidPhone = (value) => {
    const cleaned = value.replace(/[^\d]/g, "");
    const phoneRegex = /^[+\d\s\-()]+$/;
    return (
      phoneRegex.test(value.trim()) &&
      cleaned.length >= 10 &&
      cleaned.length <= 15
    );
  };

  const isValidContact = (value) => {
    const trimmedValue = value.trim();
    return isValidEmail(trimmedValue) || isValidPhone(trimmedValue);
  };

  const contactEmpty = submitted && contact.trim() === "";
  const contactInvalid =
    submitted && contact.trim() !== "" && !isValidContact(contact);

  const foundAccount = useMemo(() => {
    const trimmed = contact.trim();

    const maskEmail = (email) => {
      const [localPart, domain] = email.split("@");
      if (!localPart || !domain) return email;

      const visible = localPart.slice(0, 1);
      const maskedLocal = `${visible}${"*".repeat(Math.max(localPart.length - 1, 3))}`;
      return `${maskedLocal}@${domain}`;
    };

    const maskPhone = (phone) => {
      const digits = phone.replace(/[^\d]/g, "");
      if (digits.length < 4) return phone;
      const last4 = digits.slice(-4);
      return `*** *** ${last4}`;
    };

    return {
      name: "Ale Rivera",
      provider: "Alesitos Net",
      deliveryLabel: isValidEmail(trimmed)
        ? "Obtener código por correo electrónico"
        : "Obtener código por celular",
      maskedDestination: isValidEmail(trimmed)
        ? maskEmail(trimmed)
        : maskPhone(trimmed),
    };
  }, [contact]);

const handleResendCode = () => {
  if (cooldown > 0) return;

  console.log("Reenviando código a:", foundAccount.maskedDestination);

  // simular envío
  setShowToast(true);

  setTimeout(() => {
    setShowToast(false);
  }, 3000);

  // activar cooldown (30 segundos)
  setCooldown(30);
};



  const getInputClassName = () => {
    if (contactEmpty || contactInvalid) {
      return "forgot-input input-error";
    }

    if (contact.trim() !== "" && isValidContact(contact)) {
      return "forgot-input input-success";
    }

    return "forgot-input";
  };

  const getCodeInputClassName = () => {
    const codeEmpty = codeSubmitted && verificationCode.trim() === "";
    const codeInvalid =
      codeSubmitted &&
      verificationCode.trim() !== "" &&
      !/^\d{6}$/.test(verificationCode.trim());

    if (codeEmpty || codeInvalid) {
      return "forgot-input input-error";
    }

    if (/^\d{6}$/.test(verificationCode.trim())) {
      return "forgot-input input-success";
    }

    return "forgot-input";
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setError("");

    if (contact.trim() === "") {
      setError("Ingresa tu número de celular o correo electrónico.");
      return;
    }

    if (!isValidContact(contact)) {
      setError("Ingresa un correo o número de celular válido.");
      return;
    }

    setStep("method");
  };

  const handleContinueMethod = () => {
    if (selectedMethod === "code") {
      setStep("code");
      return;
    }

    console.log("Continuar con contraseña para:", contact);
    alert("Aquí después enviaremos al usuario al flujo para ingresar su contraseña.");
  };

  const handleVerifyCode = (e) => {
    e.preventDefault();
    setCodeSubmitted(true);
    setCodeError("");

    if (verificationCode.trim() === "") {
      setCodeError("Ingresa el código de verificación.");
      return;
    }

    if (!/^\d{6}$/.test(verificationCode.trim())) {
      setCodeError("El código debe tener 6 dígitos.");
      return;
    }

   console.log("Código verificado:", verificationCode);

// pasar al siguiente step
setStep("reset");
  };

  if (step === "code") {
    return (
      <div className="forgot-page">
        <div className="forgot-wrapper">
          <button
            type="button"
            className="forgot-back-button"
            onClick={() => setStep("method")}
            aria-label="Volver"
          >
            ←
          </button>
{cooldown > 0 && (
  <div className="cooldown-banner">
    <span className="cooldown-icon">i</span>
    Espera {cooldown}s antes de solicitar un nuevo código.
  </div>
)}
          <h1 className="forgot-title">Confirma tu cuenta</h1>
          <p className="forgot-subtitle">
            Enviamos un código a{" "}
            <span className="forgot-highlight">
              {foundAccount.maskedDestination}
            </span>
            . Ingrésalo para confirmar tu cuenta.
          </p>

          <form className="forgot-form" onSubmit={handleVerifyCode}>
            <div className="forgot-field-group">
              <label className="forgot-label">Código de verificación</label>

              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="Ingresa el código"
                value={verificationCode}
                onChange={(e) => {
                  const onlyDigits = e.target.value.replace(/[^\d]/g, "");
                  setVerificationCode(onlyDigits);
                  if (codeError) setCodeError("");
                }}
                className={getCodeInputClassName()}
              />

              {!codeSubmitted && verificationCode.trim() === "" && (
                <p className="forgot-helper">
                  Ingresa el código de 6 dígitos que enviamos a tu contacto
                  registrado.
                </p>
              )}

              {codeSubmitted && verificationCode.trim() === "" && (
                <p className="forgot-message forgot-error">
                  Ingresa el código de verificación.
                </p>
              )}

              {codeSubmitted &&
                verificationCode.trim() !== "" &&
                !/^\d{6}$/.test(verificationCode.trim()) && (
                  <p className="forgot-message forgot-error">
                    El código debe tener 6 dígitos.
                  </p>
                )}

              {/^\d{6}$/.test(verificationCode.trim()) && (
                <p className="forgot-message forgot-success">
                  Código con formato válido.
                </p>
              )}

              {codeError &&
                !(codeSubmitted && verificationCode.trim() === "") &&
                !(
                  codeSubmitted &&
                  verificationCode.trim() !== "" &&
                  !/^\d{6}$/.test(verificationCode.trim())
                ) && (
                  <p className="forgot-message forgot-error">{codeError}</p>
                )}
            </div>

            <button type="submit" className="forgot-primary-button">
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

  if (step === "method") {
    return (
      <div className="forgot-page">
        <div className="forgot-wrapper">
          <button
            type="button"
            className="forgot-back-button"
            onClick={() => setStep("search")}
            aria-label="Volver"
          >
            ←
          </button>

          <h1 className="forgot-title">Elige un método para iniciar sesión</h1>

          <div className="account-card">
            <div className="account-avatar">
              <span>AR</span>
            </div>

            <div className="account-info">
              <p className="account-name">{foundAccount.name}</p>
              <p className="account-provider">{foundAccount.provider}</p>
            </div>
          </div>

          <div className="method-card">
            <button
              type="button"
              className={`method-option ${
                selectedMethod === "code" ? "method-option-selected" : ""
              }`}
              onClick={() => setSelectedMethod("code")}
            >
              <div className="method-texts">
                <p className="method-title">{foundAccount.deliveryLabel}</p>
                <p className="method-subtitle">{foundAccount.maskedDestination}</p>
              </div>

              <span
                className={`radio-circle ${
                  selectedMethod === "code" ? "radio-circle-selected" : ""
                }`}
              />
            </button>

            <button
              type="button"
              className={`method-option ${
                selectedMethod === "password" ? "method-option-selected" : ""
              }`}
              onClick={() => setSelectedMethod("password")}
            >
              <div className="method-texts">
                <p className="method-title">Continuar con contraseña</p>
                <p className="method-subtitle">
                  Usa tu contraseña para continuar
                </p>
              </div>

              <span
                className={`radio-circle ${
                  selectedMethod === "password" ? "radio-circle-selected" : ""
                }`}
              />
            </button>
          </div>

          <button
            type="button"
            className="forgot-link-button"
            onClick={() => alert("Aquí después iría el flujo de 'ya no tienes acceso'.")}
          >
            ¿Ya no tienes acceso?
          </button>

          <button
            type="button"
            className="forgot-primary-button"
            onClick={handleContinueMethod}
          >
            Continuar
          </button>

          <button
            type="button"
            className="forgot-secondary-button"
            onClick={() => {
              setStep("search");
              setContact("");
              setSubmitted(false);
              setError("");
              setSelectedMethod("code");
            }}
          >
            ¿No eres tú?
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="forgot-page">
      <div className="forgot-wrapper">
        <button
          type="button"
          className="forgot-back-button"
          onClick={() => setView("login")}
          aria-label="Volver al login"
        >
          ←
        </button>

        <p className="forgot-brand">Alesitos Net</p>

        <h1 className="forgot-title">Encuentra tu cuenta</h1>
        <p className="forgot-subtitle">
          Ingresa tu número de celular o correo electrónico para continuar con
          la recuperación de tu contraseña.
        </p>

        <form className="forgot-form" onSubmit={handleSearchSubmit}>
          <div className="forgot-field-group">
            

            <input
              type="text"
              placeholder="Número de celular o correo electrónico"
              value={contact}
              onChange={(e) => {
                setContact(e.target.value);
                if (error) setError("");
              }}
              className={getInputClassName()}
            />

            {!submitted && contact.trim() === "" && (
              <p className="forgot-helper">
              </p>
            )}

            {contactEmpty && (
              <p className="forgot-message forgot-error">
                Deberás ingresar un número de celular o correo electrónico para continuar.
              </p>
            )}

            {!contactEmpty && contactInvalid && (
              <p className="forgot-message forgot-error">
                Ingresa un correo o número de celular válido.
              </p>
            )}

            {!contactEmpty &&
              !contactInvalid &&
              contact.trim() !== "" &&
              isValidContact(contact) && (
                <p className="forgot-message forgot-success">
                  Contacto válido.
                </p>
              )}

            {error && !contactEmpty && !contactInvalid && (
              <p className="forgot-message forgot-error">{error}</p>
            )}
          </div>

          <button type="submit" className="forgot-primary-button">
            Continuar
          </button>

          <button
            type="button"
            className="forgot-secondary-button"
            onClick={() => setView("login")}
          >
            Volver a iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
}