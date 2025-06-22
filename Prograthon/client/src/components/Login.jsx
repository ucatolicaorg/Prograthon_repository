import React, { useState } from "react";
import { login } from "../api";
import "./Login.css";

const Login = ({ onLogin, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Por favor completa todos los campos");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await login(formData);
      if (response.role) {
        await onLogin();
      }
    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* TITULO “PROGRATHON” centrado entre ambas mitades */}
      <div className="login-title">
        <h1>PROGRATHON</h1>
      </div>

      {/* PANEL IZQUIERDO: Degradado púrpura + ilustración */}
      <div className="login-left">
        <img
          src="https://imgur.com/yxRapZk.png"
          alt="Ilustración Login"
        />
      </div>

      {/* PANEL DERECHO: Formulario de Login (ahora ocupa todo el ancho de su mitad) */}
      <div className="login-right">
        <div className="auth-container glass-card animate-slide-in-up w-full mt-32 p-8">
          {/* Logo circular de la página */}
          <div className="text-center mb-6">
            <img
              src="https://i.imgur.com/MKpzI59.png"
              alt="Logo de la Página"
              className="w-24 h-24 rounded-full mx-auto mb-4 shadow-lg"
            />
          </div>

          {error && <div className="error-message mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6 px-8">
            <div>
              <label
                htmlFor="email"
                className="block text-base font-medium text-white mb-2"
              >
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="glass-input"
                placeholder="tu@ejemplo.com"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-base font-medium text-white mb-2"
              >
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="glass-input"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="glass-button w-full py-4 text-xl"
            >
              {loading ? <div className="loader"></div> : "Iniciar Sesión"}
            </button>
          </form>

          <div className="text-center mt-8">
            <p className="text-secondary text-sm">
              ¿No tienes una cuenta?{" "}
              <button
                onClick={onSwitchToRegister}
                className="switch-link text-lg"
                disabled={loading}
              >
                Regístrate aquí
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
