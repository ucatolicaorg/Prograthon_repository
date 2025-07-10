import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      {/* TITULO "PROGRATHON" centrado entre ambas mitades */}
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

      {/* PANEL DERECHO: Formulario de Login */}
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

          {error && (
            <div className="error-message mb-4 animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 px-8">
            <div className="fade-in">
              <label
                htmlFor="username"
                className="block text-base font-medium text-white mb-2"
              >
                Usuario
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="glass-input"
                placeholder="Ingresa tu usuario"
                required
                disabled={loading}
              />
            </div>

            <div className="fade-in">
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
              {loading ? (
                <div className="loader"></div>
              ) : (
                "Iniciar Sesión"
              )}
            </button>
          </form>

          <div className="text-center mt-8">
            <p className="text-secondary text-sm">
              ¿No tienes una cuenta?{" "}
              <Link
                to="/register"
                className="switch-link text-lg"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Estilos específicos para el componente Login */
        .login-container {
          position: relative;
          display: flex;
          height: 100vh;
          width: 100vw;
          max-width: 1400px; /* Límite máximo de ancho */
          margin: 0 auto; /* Centrar contenedor */
          overflow: hidden;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        /* Fondo adaptado con los colores del diseño */
        .login-container::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            /* Lado izquierdo - colores morados como en el panel */
            #1e1e3f 0%,
            #2d1b69 20%,
            #3d2c7f 35%,
            #4c3c95 45%,
            /* Transición gradual al lado derecho */
            #2a1f4c 50%,
            #1e1a2e 55%,
            /* Lado derecho - colores oscuros como en el panel */
            #1a1a2f 65%,
            #1e1b2e 80%,
            #151517 100%
          );
          z-index: -1;
        }

        /* Efecto de patrones en el fondo */
        .login-container::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
          background-size: 60px 60px, 80px 80px;
          opacity: 0.8;
          pointer-events: none;
          z-index: -1;
        }

        /* Fondo oscuro para toda la página */
        body {
          background: linear-gradient(135deg, #1e1e3f 0%, #151517 100%) !important;
          margin: 0;
          padding: 0;
        }

        .login-title {
          position: absolute;
          top: 6%;
          left: 50%;
          transform: translateX(-50%);
          z-index: 30;
          background: rgba(0, 0, 0, 0.6);
          padding: 1.5rem 3rem; /* Reducido ligeramente */
          border-radius: 1.5rem; /* Más compacto */
          backdrop-filter: blur(12px);
          border: 2px solid rgba(255, 215, 0, 0.3);
          box-shadow: 
            0 15px 35px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .login-title:hover {
          transform: translateX(-50%) translateY(-3px);
          box-shadow: 
            0 20px 45px rgba(0, 0, 0, 0.5),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .login-title h1 {
          font-size: clamp(2.5rem, 6vw, 4.5rem); /* Reducido el tamaño máximo */
          font-weight: 900;
          letter-spacing: -0.03em;
          background: linear-gradient(135deg, #ffd700 0%, #ffed4e 25%, #fff8dc 50%, #f0f8ff 75%, #e6f3ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-align: center;
          line-height: 0.85;
          margin: 0;
          position: relative;
        }

        .login-title h1::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          animation: shimmer 6s infinite;
          pointer-events: none;
        }

        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        .login-left {
          flex: 0 0 45%; /* Reducido de 50% a 45% */
          background: linear-gradient(135deg, #1e1e3f 0%, #2d1b69 25%, #3d2c7f 50%, #4c3c95 75%, #5b4bab 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .login-left::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
          background-size: 50px 50px, 30px 30px;
          opacity: 0.6;
          pointer-events: none;
        }

        .login-left::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(2px 2px at 20px 30px, rgba(255, 215, 0, 0.2), transparent),
            radial-gradient(1px 1px at 90px 40px, rgba(255, 255, 255, 0.3), transparent),
            radial-gradient(2px 2px at 160px 120px, rgba(168, 85, 247, 0.15), transparent);
          background-repeat: repeat;
          background-size: 150px 150px;
          animation: float 15s ease-in-out infinite;
          pointer-events: none;
          opacity: 0.8;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }

        .login-left img {
          width: 75%; /* Ligeramente más pequeño */
          height: auto;
          border-radius: 1.5rem;
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.5),
            0 10px 25px rgba(124, 58, 237, 0.3);
          border: 2px solid rgba(255, 215, 0, 0.3);
          transition: transform 0.4s ease, box-shadow 0.4s ease;
          position: relative;
          z-index: 10;
        }

        .login-left img:hover {
          transform: scale(1.05) translateY(-8px);
          box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.6),
            0 15px 30px rgba(124, 58, 237, 0.4);
        }

        .login-right {
          flex: 0 0 55%; /* Aumentado de 50% a 55% */
          background: linear-gradient(
            135deg,
            rgba(15, 15, 26, 0.95) 0%,
            rgba(26, 26, 46, 0.9) 50%,
            rgba(30, 27, 46, 0.9) 100%
          );
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 6rem 2rem 2rem 2rem; /* Ajustado el padding */
          overflow-y: auto;
          position: relative;
        }

        .login-right::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(30deg, transparent 49%, rgba(168, 85, 247, 0.05) 50%, transparent 51%),
            radial-gradient(circle at 20% 80%, rgba(255, 215, 0, 0.02) 0%, transparent 50%);
          background-size: 60px 60px, 200px 200px;
          opacity: 0.7;
          pointer-events: none;
        }

        .login-right .auth-container {
          background: rgba(15, 15, 26, 0.8) !important;
          border: 2px solid rgba(168, 85, 247, 0.3) !important;
          backdrop-filter: blur(15px) !important;
          box-shadow: 
            0 15px 35px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
          border-radius: 1.5rem !important;
          position: relative;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease !important;
          animation: formSlideIn 0.8s ease-out;
          max-width: 480px; /* Límite máximo de ancho para el formulario */
          width: 100%;
        }

        @keyframes formSlideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .login-right .auth-container:hover {
          transform: translateY(-4px) !important;
          box-shadow: 
            0 20px 45px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.15) !important;
        }

        .login-right .auth-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.1), transparent);
          transition: left 0.6s ease;
          z-index: 1;
        }

        .login-right .auth-container:hover::before {
          left: 100%;
        }

        .login-right .auth-container > * {
          position: relative;
          z-index: 2;
        }

        .login-right .glass-input {
          background: rgba(15, 15, 26, 0.7) !important;
          border: 2px solid rgba(168, 85, 247, 0.3) !important;
          backdrop-filter: blur(8px) !important;
          box-shadow: 
            0 4px 12px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
          transition: all 0.3s ease !important;
          font-size: 1.1rem !important;
          padding: 1rem 1.5rem !important;
          color: white !important;
          border-radius: 0.75rem !important;
          width: 100% !important;
        }

        .login-right .glass-input:focus {
          background: rgba(15, 15, 26, 0.9) !important;
          border-color: rgba(255, 215, 0, 0.5) !important;
          box-shadow: 
            0 0 0 3px rgba(168, 85, 247, 0.2),
            0 6px 20px rgba(124, 58, 237, 0.3) !important;
          transform: translateY(-2px) !important;
          outline: none !important;
        }

        .login-right .glass-input::placeholder {
          color: rgba(255, 255, 255, 0.5) !important;
        }

        .login-right .glass-button {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(37, 99, 235, 0.9) 50%, rgba(29, 78, 216, 0.9) 100%) !important;
          border: 2px solid rgba(255, 215, 0, 0.3) !important;
          box-shadow: 
            0 8px 20px rgba(124, 58, 237, 0.3), 
            inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3) !important;
          font-weight: 700 !important;
          font-size: 1.2rem !important;
          padding: 1.2rem 2rem !important;
          transition: all 0.3s ease !important;
          position: relative;
          overflow: hidden;
          border-radius: 0.75rem !important;
          cursor: pointer;
          color: white !important;
          width: 100% !important;
        }

        .login-right .glass-button::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
          transform: translateX(-100%);
          transition: transform 0.5s ease;
        }

        .login-right .glass-button:hover:not(:disabled) {
          background: linear-gradient(
            135deg, 
            rgba(124, 58, 237, 0.9) 0%,
            rgba(168, 85, 247, 0.9) 100%
          ) !important;
          box-shadow: 
            0 12px 25px rgba(124, 58, 237, 0.4), 
            inset 0 1px 0 rgba(255, 255, 255, 0.3) !important;
          transform: translateY(-2px) !important;
        }

        .login-right .glass-button:hover:not(:disabled)::before {
          transform: translateX(100%);
        }

        .login-right .glass-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .login-right img[alt="Logo de la Página"] {
          border: 2px solid rgba(255, 215, 0, 0.4);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .login-right img[alt="Logo de la Página"]:hover {
          transform: scale(1.08);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
        }

        .error-message {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #dc2626;
          padding: 1rem 1.5rem;
          border-radius: 0.75rem;
          backdrop-filter: blur(6px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
          animation: errorSlideIn 0.3s ease-out;
        }

        @keyframes errorSlideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .switch-link {
          color: rgba(255, 215, 0, 0.9) !important;
          font-weight: 600 !important;
          text-decoration: none;
          transition: color 0.3s ease;
          position: relative;
        }

        .switch-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: rgba(255, 215, 2, 0.8);
          transition: width 0.3s ease;
        }

        .switch-link:hover {
          color: rgba(255, 215, 0, 1) !important;
        }

        .switch-link:hover::after {
          width: 100%;
        }

        .text-secondary {
          color: rgba(255, 255, 255, 0.7);
        }

        .loader {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid rgba(255, 215, 0, 0.8);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .fade-in {
          animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .space-y-6 > * + * {
          margin-top: 1.5rem;
        }

        .w-full {
          width: 100%;
        }

        .w-24 {
          width: 6rem;
        }

        .h-24 {
          height: 6rem;
        }

        .rounded-full {
          border-radius: 9999px;
        }

        .mx-auto {
          margin-left: auto;
          margin-right: 2rem;
        }

        .mb-4 {
          margin-bottom: 1rem;
        }

        .mb-6 {
          margin-bottom: 1.5rem;
        }

        .mt-8 {
          margin-top: 2rem;
        }

        .mt-32 {
          margin-top: 8rem;
        }

        .p-8 {
          padding: 2rem;
        }

        .px-8 {
          padding-left: 2rem;
          padding-right: 2rem;
        }

        .py-4 {
          padding-top: 1rem;
          padding-bottom: 1rem;
        }

        .text-center {
          text-align: center;
        }

        .text-base {
          font-size: 1rem;
        }

        .text-xl {
          font-size: 1.25rem;
        }

        .text-lg {
          font-size: 1.125rem;
        }

        .text-sm {
          font-size: 0.875rem;
        }

        .font-medium {
          font-weight: 500;
        }

        .block {
          display: block;
        }

        .mb-2 {
          margin-bottom: 0.5rem;
        }

        .shadow-lg {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .login-container {
            flex-direction: column;
            max-width: 100%;
          }
          
          .login-container::before {
            background: linear-gradient(
              to bottom,
              /* Parte superior - colores morados */
              #1e1e3f 0%,
              #2d1b69 20%,
              #3d2c7f 40%,
              /* Transición gradual */
              #2a1f4c 50%,
              #1e1a2e 60%,
              /* Parte inferior - colores oscuros */
              #1a1a2f 80%,
              #151517 100%
            );
          }
          
          .login-left,
          .login-right {
            flex: 1;
            width: 100%;
          }
          
          .login-right {
            padding: 2rem 1rem;
          }
          
          .login-title {
            top: 8%;
            padding: 1.5rem 2.5rem;
          }
          
          .login-title h1 {
            font-size: clamp(2.5rem, 6vw, 3.5rem);
          }
        }

        @media (max-width: 768px) {
          .login-title {
            padding: 1rem 2rem;
            top: 6%;
          }
          
          .login-title h1 {
            font-size: clamp(2rem, 5vw, 3rem);
          }
          
          .login-left img {
            width: 80%;
          }
          
          .login-right .auth-container {
            margin: 1rem;
            padding: 1.5rem !important;
          }
          
          .login-right .glass-input {
            font-size: 1rem !important;
            padding: 0.875rem 1.25rem !important;
          }
          
          .login-right .glass-button {
            font-size: 1.1rem !important;
            padding: 1rem 1.5rem !important;
          }
        }

        @media (max-width: 480px) {
          .login-title {
            padding: 0.75rem 1.5rem;
          }
          
          .login-title h1 {
            font-size: clamp(1.75rem, 4vw, 2.5rem);
          }
          
          .login-right .auth-container {
            margin: 0.5rem;
            padding: 1.25rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;