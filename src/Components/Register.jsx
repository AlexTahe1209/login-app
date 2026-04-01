import { useEffect, useState } from "react";
import "./Register.css";

export default function Register({ setView }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    day: "",
    month: "",
    year: "",
    gender: "",
    contact: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [modalType, setModalType] = useState("");
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleMotionChange = (event) => {
      setReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handleMotionChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMotionChange);
    };
  }, []);

  const handleMouseMove = (e) => {
    if (reducedMotion || window.innerWidth < 768) return;

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const moveX = (e.clientX - centerX) / 45;
    const moveY = (e.clientY - centerY) / 45;

    setOffset({ x: moveX, y: moveY });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (error) {
      setError("");
    }
  };

  const monthMap = {
    Enero: 0,
    Febrero: 1,
    Marzo: 2,
    Abril: 3,
    Mayo: 4,
    Junio: 5,
    Julio: 6,
    Agosto: 7,
    Septiembre: 8,
    Octubre: 9,
    Noviembre: 10,
    Diciembre: 11,
  };

  const isEmpty = (value) => String(value).trim() === "";

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

  const isValidBirthDate = (day, month, year) => {
    if (!day || !month || !year) return false;

    const monthIndex = monthMap[month];
    if (monthIndex === undefined) return false;

    const birthDate = new Date(Number(year), monthIndex, Number(day));

    return (
      birthDate.getFullYear() === Number(year) &&
      birthDate.getMonth() === monthIndex &&
      birthDate.getDate() === Number(day)
    );
  };

  const isAdult = (day, month, year) => {
    if (!isValidBirthDate(day, month, year)) return false;

    const monthIndex = monthMap[month];
    const today = new Date();
    const birthDate = new Date(Number(year), monthIndex, Number(day));

    let age = today.getFullYear() - birthDate.getFullYear();
    const hadBirthdayThisYear =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() >= birthDate.getDate());

    if (!hadBirthdayThisYear) {
      age -= 1;
    }

    return age >= 18;
  };

  const firstNameError = submitted && isEmpty(form.firstName);
  const lastNameError = submitted && isEmpty(form.lastName);

  const dayError = submitted && isEmpty(form.day);
  const monthError = submitted && isEmpty(form.month);
  const yearError = submitted && isEmpty(form.year);

  const genderError = submitted && isEmpty(form.gender);
  const contactSubmitError = submitted && isEmpty(form.contact);
  const passwordSubmitError = submitted && isEmpty(form.password);
  const confirmPasswordSubmitError =
    submitted && isEmpty(form.confirmPassword);
  const termsError = submitted && !form.acceptTerms;

  const birthDateStarted = form.day && form.month && form.year;
  const birthDateIsValid = isValidBirthDate(form.day, form.month, form.year);
  const birthDateIsAdult =
    birthDateIsValid && isAdult(form.day, form.month, form.year);
  const birthDateIsUnderage =
    birthDateStarted && birthDateIsValid && !birthDateIsAdult;
  const birthDateHasError = birthDateStarted && !birthDateIsValid;

  const contactStarted = form.contact.trim() !== "";
  const contactIsValid = isValidContact(form.contact);
  const contactIsInvalid = contactStarted && !contactIsValid;

  const passwordStarted = form.password.trim() !== "";
  const passwordTooShort = passwordStarted && form.password.length < 8;

  const isConfirmStarted = form.confirmPassword.trim() !== "";
  const passwordsMatch =
    form.password.trim() !== "" &&
    form.confirmPassword.trim() !== "" &&
    form.password === form.confirmPassword;

  const passwordsDoNotMatch =
    form.password.trim() !== "" &&
    form.confirmPassword.trim() !== "" &&
    form.password !== form.confirmPassword;

  const getFirstNameClassName = () => {
    if (firstNameError) return "register-input input-error";
    return "register-input";
  };

  const getLastNameClassName = () => {
    if (lastNameError) return "register-input input-error";
    return "register-input";
  };

  const getBirthDateClassName = () => {
    if (
      dayError ||
      monthError ||
      yearError ||
      birthDateHasError ||
      birthDateIsUnderage
    ) {
      return "register-input input-error";
    }

    if (birthDateStarted && birthDateIsAdult) {
      return "register-input input-success";
    }

    return "register-input";
  };

  const getGenderClassName = () => {
    if (genderError) return "register-input full-width input-error";
    return "register-input full-width";
  };

  const getContactClassName = () => {
    if (contactSubmitError || contactIsInvalid) {
      return "register-input full-width input-error";
    }

    if (contactStarted && contactIsValid) {
      return "register-input full-width input-success";
    }

    return "register-input full-width";
  };

  const getPasswordClassName = () => {
    if (passwordSubmitError || passwordTooShort) {
      return "register-input full-width input-error";
    }

    return "register-input full-width";
  };

  const getConfirmPasswordClassName = () => {
    if (confirmPasswordSubmitError || passwordsDoNotMatch) {
      return "register-input full-width input-error";
    }

    if (passwordsMatch) {
      return "register-input full-width input-success";
    }

    return "register-input full-width";
  };

  const getTermsClassName = () => {
    if (termsError) return "terms-section terms-section-error";
    return "terms-section";
  };

  const isFormSubmittable = form.acceptTerms;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setError("");

    const requiredFields = [
      form.firstName,
      form.lastName,
      form.day,
      form.month,
      form.year,
      form.gender,
      form.contact,
      form.password,
      form.confirmPassword,
    ];

    const hasEmptyField = requiredFields.some((value) =>
      String(value).trim() === ""
    );

    if (hasEmptyField) {
      setError("Completa los campos obligatorios.");
      return;
    }

    if (!isValidBirthDate(form.day, form.month, form.year)) {
      setError("Ingresa una fecha de nacimiento válida.");
      return;
    }

    if (!isAdult(form.day, form.month, form.year)) {
      setError("Debes ser mayor de edad para registrarte.");
      return;
    }

    if (!isValidContact(form.contact)) {
      setError("Ingresa un correo o número de celular válido.");
      return;
    }

    if (form.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (!form.acceptTerms) {
      setError("Debes aceptar los términos y condiciones para continuar.");
      return;
    }

    console.log("Register data:", form);
  };

  const renderModalContent = () => {
    if (modalType === "terms") {
      return {
        title: "Términos y condiciones",
        body: (
          <>
            <p>
              Al registrarte en Alesitos Net aceptas usar la plataforma de forma
              lícita y proporcionar información veraz para la gestión de tu
              cuenta, contratación, renovación y modificación de servicios.
            </p>
            <p>
              Los pagos, cambios de plan, activación de servicios y cualquier
              ajuste relacionado con tu suscripción estarán sujetos a validación
              operativa, disponibilidad técnica y confirmación de cobro.
            </p>
            <p>
              El uso indebido de la cuenta, intentos de fraude, suplantación de
              identidad o alteración no autorizada de servicios podrá derivar en
              suspensión temporal o cancelación definitiva.
            </p>
          </>
        ),
      };
    }

    return {
      title: "Política de privacidad",
      body: (
        <>
          <p>
            Alesitos Net podrá tratar tus datos de contacto, información de
            acceso, historial de suscripción y datos relacionados con pagos para
            operar la cuenta, brindar soporte y mejorar la experiencia del
            servicio.
          </p>
          <p>
            La información se utilizará únicamente para fines relacionados con
            la prestación del servicio, atención al cliente, autenticación,
            notificaciones relevantes y cumplimiento de obligaciones
            contractuales o regulatorias.
          </p>
          <p>
            Tus datos no deben exponerse sin base legal o consentimiento
            aplicable, y deberán manejarse con medidas razonables de seguridad
            administrativas y técnicas.
          </p>
        </>
      ),
    };
  };

  const modalContent = modalType ? renderModalContent() : null;

  return (
    <div
      className="register-page"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="parallax-shape shape-one"
        style={{
          transform: reducedMotion
            ? "translate3d(0, 0, 0)"
            : `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        }}
      />

      <div
        className="parallax-shape shape-two"
        style={{
          transform: reducedMotion
            ? "translate3d(0, 0, 0)"
            : `translate3d(${-offset.x * 1.4}px, ${-offset.y * 1.4}px, 0)`,
        }}
      />

      <div
        className="parallax-shape shape-three"
        style={{
          transform: reducedMotion
            ? "translate3d(0, 0, 0)"
            : `translate3d(${offset.x * 0.7}px, ${-offset.y * 0.7}px, 0)`,
        }}
      />

      <div
        className="parallax-shape shape-four"
        style={{
          transform: reducedMotion
            ? "translate3d(0, 0, 0)"
            : `translate3d(${-offset.x * 0.9}px, ${offset.y * 0.9}px, 0)`,
        }}
      />

      <div className="register-wrapper">
        <button
          type="button"
          className="back-button"
          onClick={() => setView("login")}
          aria-label="Volver al login"
        >
          ←
        </button>

        <p className="brand-mini">Alesitos Net</p>

        <h1 className="register-title">Crea tu cuenta</h1>
        <p className="register-subtitle">
          Regístrate para acceder a una conexión rápida, simple y confiable.
        </p>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="field-group">
            <label className="field-label">Nombre</label>

            <div className="two-columns">
              <input
                type="text"
                name="firstName"
                placeholder="Nombre"
                value={form.firstName}
                onChange={handleChange}
                className={getFirstNameClassName()}
              />

              <input
                type="text"
                name="lastName"
                placeholder="Apellido"
                value={form.lastName}
                onChange={handleChange}
                className={getLastNameClassName()}
              />
            </div>

            <div className="two-columns field-error-grid">
              <div>
                {firstNameError && (
                  <p className="validation-message validation-error">
                    ¿Cuál es tu nombre?
                  </p>
                )}
              </div>

              <div>
                {lastNameError && (
                  <p className="validation-message validation-error">
                    ¿Cuál es tu apellido?
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">Fecha de nacimiento</label>

            <div className="three-columns">
              <select
                name="day"
                value={form.day}
                onChange={handleChange}
                className={getBirthDateClassName()}
              >
                <option value="">Día</option>
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i + 1} value={String(i + 1)}>
                    {i + 1}
                  </option>
                ))}
              </select>

              <select
                name="month"
                value={form.month}
                onChange={handleChange}
                className={getBirthDateClassName()}
              >
                <option value="">Mes</option>
                {[
                  "Enero",
                  "Febrero",
                  "Marzo",
                  "Abril",
                  "Mayo",
                  "Junio",
                  "Julio",
                  "Agosto",
                  "Septiembre",
                  "Octubre",
                  "Noviembre",
                  "Diciembre",
                ].map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>

              <select
                name="year"
                value={form.year}
                onChange={handleChange}
                className={getBirthDateClassName()}
              >
                <option value="">Año</option>
                {Array.from({ length: 100 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return (
                    <option key={year} value={String(year)}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>

            {(dayError || monthError || yearError) && (
              <p className="validation-message validation-error">
                Selecciona tu fecha de nacimiento.
              </p>
            )}

            {birthDateHasError && (
              <p className="validation-message validation-error">
                Ingresa una fecha de nacimiento válida.
              </p>
            )}

            {birthDateIsUnderage && (
              <p className="validation-message validation-error">
                Debes ser mayor de edad para registrarte.
              </p>
            )}

            {birthDateStarted && birthDateIsAdult && (
              <p className="validation-message validation-success">
                Edad válida para continuar.
              </p>
            )}
          </div>

          <div className="field-group">
            <label className="field-label">Género</label>

            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className={getGenderClassName()}
            >
              <option value="">Selecciona tu género</option>
              <option value="femenino">Femenino</option>
              <option value="masculino">Masculino</option>
              <option value="prefiero-no-decirlo">Prefiero no decirlo</option>
              <option value="otro">Otro</option>
            </select>

            {genderError && (
              <p className="validation-message validation-error">
                Elige un género.
              </p>
            )}
          </div>

          <div className="field-group">
            <label className="field-label">
              Número de celular o correo electrónico
            </label>

            <input
              type="text"
              name="contact"
              placeholder="Número de celular o correo electrónico"
              value={form.contact}
              onChange={handleChange}
              className={getContactClassName()}
            />

            {!contactStarted && !submitted && (
              <p className="helper-text">
                Puedes ingresar un correo electrónico o un número de celular.
              </p>
            )}

            {contactSubmitError && (
              <p className="validation-message validation-error">
                Ingresa un número de celular o correo electrónico.
              </p>
            )}

            {!contactSubmitError && contactStarted && contactIsInvalid && (
              <p className="validation-message validation-error">
                Ingresa un correo o número de celular válido.
              </p>
            )}

            {!contactSubmitError && contactStarted && contactIsValid && (
              <p className="validation-message validation-success">
                Contacto válido.
              </p>
            )}
          </div>

          <div className="field-group">
            <label className="field-label">Contraseña</label>

            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              className={getPasswordClassName()}
            />

            {passwordSubmitError && (
              <p className="validation-message validation-error">
                Ingresa una combinación de al menos seis números, letras y signos de puntuación (como ! y &).
              </p>
            )}

            {!passwordSubmitError &&
              form.password.trim() !== "" &&
              form.password.length < 8 && (
                <p className="validation-message validation-error">
                  Debe tener al menos 8 caracteres.
                </p>
              )}
          </div>

          <div className="field-group">
            <label className="field-label">Confirmar contraseña</label>

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirma tu contraseña"
              value={form.confirmPassword}
              onChange={handleChange}
              className={getConfirmPasswordClassName()}
            />

            {confirmPasswordSubmitError && (
              <p className="validation-message validation-error">
                Confirma tu contraseña.
              </p>
            )}

            {!confirmPasswordSubmitError &&
              isConfirmStarted &&
              passwordsDoNotMatch && (
                <p className="validation-message validation-error">
                  Las contraseñas no coinciden.
                </p>
              )}

            {!confirmPasswordSubmitError && isConfirmStarted && passwordsMatch && (
              <p className="validation-message validation-success">
                Las contraseñas coinciden.
              </p>
            )}
          </div>

          <div className={getTermsClassName()}>
            <label className="terms-checkbox-row">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={form.acceptTerms}
                onChange={handleChange}
                className="terms-checkbox"
              />
              <span className="terms-text">
                He leído y acepto los{" "}
                <button
                  type="button"
                  className="inline-link-button"
                  onClick={() => setModalType("terms")}
                >
                  términos y condiciones
                </button>{" "}
                y la{" "}
                <button
                  type="button"
                  className="inline-link-button"
                  onClick={() => setModalType("privacy")}
                >
                  política de privacidad
                </button>.
              </span>
            </label>

            <p className="terms-helper">
              Al continuar, aceptas las reglas de uso del portal, la gestión de
              tu cuenta y el tratamiento de datos necesarios para operar el
              servicio.
            </p>

            {termsError && (
              <p className="validation-message validation-error">
                Debes aceptar los términos y condiciones.
              </p>
            )}
          </div>

          {error && <p className="register-error">{error}</p>}

          <button
            type="submit"
            className={`register-primary-button ${
              !isFormSubmittable ? "button-disabled" : ""
            }`}
            disabled={!isFormSubmittable}
          >
            Enviar
          </button>

          <button
            type="button"
            className="register-secondary-button"
            onClick={() => setView("login")}
          >
            Ya tengo una cuenta
          </button>
        </form>
      </div>

      {modalType && (
        <div className="modal-overlay" onClick={() => setModalType("")}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{modalContent.title}</h2>
              <button
                type="button"
                className="modal-close"
                onClick={() => setModalType("")}
                aria-label="Cerrar modal"
              >
                ×
              </button>
            </div>

            <div className="modal-body">{modalContent.body}</div>

            <div className="modal-footer">
              <button
                type="button"
                className="modal-action"
                onClick={() => setModalType("")}
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}