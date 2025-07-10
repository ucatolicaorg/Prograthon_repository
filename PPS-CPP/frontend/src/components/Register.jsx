import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'student',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const result = await register(formData);
    
    if (result.success) {
      setSuccess(result.message);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <>
      <style jsx>{`
        /* Variables CSS locales */
        :root {
          --primary-dark: #1e1e3f;
          --primary-darker: #151517;
          --primary-accent: #2d1b69;
          --glass-bg: rgba(15, 15, 26, 0.85);
          --glass-border: rgba(168, 85, 247, 0.3);
          --gradient-primary: linear-gradient(135deg, #1e1e3f 0%, #2d1b69 25%, #3d2c7f 50%, #1a1a2f 75%, #151517 100%);
          --gradient-button: linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(37, 99, 235, 0.9) 50%, rgba(29, 78, 216, 0.9) 100%);
          --gradient-text: linear-gradient(135deg, #ffd700 0%, #ffed4e 25%, #fff8dc 50%, #f0f8ff 75%, #e6f3ff 100%);
          --shadow-glass: 0 25px 50px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1);
          --shadow-hover: 0 35px 70px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15);
          --timing-fast: 0.2s;
          --timing-normal: 0.3s;
          --timing-slow: 0.5s;
        }

        /* Container principal */
        .container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: var(--gradient-primary);
          background-size: 400% 400%;
          animation: gradientFlow 15s ease infinite;
          position: relative;
          overflow: hidden;
        }

        @keyframes gradientFlow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        /* Patrón de fondo sutil */
        .container::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: 
            radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.02) 1px, transparent 1px);
          background-size: 50px 50px, 70px 70px;
          animation: patternMove 20s linear infinite;
          pointer-events: none;
          z-index: 1;
        }

        @keyframes patternMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }

        /* Tarjeta del formulario */
        .form-card {
          width: 100%;
          max-width: 26rem;
          padding: 2.5rem;
          position: relative;
          border-radius: 1.5rem;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          backdrop-filter: blur(20px);
          box-shadow: var(--shadow-glass);
          transition: all var(--timing-normal) ease;
          animation: cardAppear 0.8s ease-out;
          z-index: 2;
        }

        @keyframes cardAppear {
          from { 
            opacity: 0; 
            transform: translateY(40px) scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }

        .form-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-hover);
          border-color: rgba(255, 215, 0, 0.3);
        }

        /* Efecto de brillo en hover */
        .form-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.08), transparent);
          transform: translateX(-100%);
          transition: transform var(--timing-slow);
          border-radius: inherit;
          opacity: 0;
        }

        .form-card:hover::before {
          transform: translateX(100%);
          opacity: 1;
        }

        /* Título principal */
        .title {
          font-size: 2.75rem;
          font-weight: 900;
          letter-spacing: -0.02em;
          background: var(--gradient-text);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-align: center;
          line-height: 1;
          margin-bottom: 2.5rem;
          position: relative;
          animation: titleGlow 0.8s ease-out;
        }

        @keyframes titleGlow {
          from { 
            opacity: 0; 
            transform: translateY(-20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }

        /* Subtítulo */
        .subtitle {
          font-size: 1rem;
          color: rgba(160, 174, 208, 0.8);
          text-align: center;
          margin-bottom: 2rem;
          font-weight: 400;
          animation: subtitleFade 1s ease-out;
          animation-delay: 0.2s;
          animation-fill-mode: both;
        }

        @keyframes subtitleFade {
          from { 
            opacity: 0; 
            transform: translateY(10px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }

        /* Formulario */
        .form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          animation: formGroupSlide 0.6s ease-out;
          animation-fill-mode: both;
        }

        .form-group:nth-child(1) { animation-delay: 0.3s; }
        .form-group:nth-child(2) { animation-delay: 0.4s; }
        .form-group:nth-child(3) { animation-delay: 0.5s; }

        @keyframes formGroupSlide {
          from { 
            opacity: 0; 
            transform: translateX(-30px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }

        /* Labels */
        .label {
          font-size: 0.95rem;
          font-weight: 600;
          color: rgba(224, 231, 255, 0.9);
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .label::before {
          content: '';
          width: 4px;
          height: 4px;
          background: var(--gradient-button);
          border-radius: 50%;
          display: inline-block;
        }

        /* Inputs */
        .input {
          width: 100%;
          border-radius: 0.875rem;
          padding: 1rem 1.25rem;
          font-size: 1rem;
          background: rgba(15, 15, 26, 0.6);
          border: 1.5px solid rgba(168, 85, 247, 0.25);
          backdrop-filter: blur(12px);
          color: #e0e7ff;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
          transition: all var(--timing-normal) ease;
          outline: none;
          position: relative;
        }

        .input::placeholder {
          color: rgba(160, 174, 208, 0.6);
          transition: color var(--timing-normal) ease;
        }

        .input:focus {
          background: rgba(15, 15, 26, 0.8);
          border-color: rgba(255, 215, 0, 0.6);
          box-shadow: 
            0 0 0 3px rgba(168, 85, 247, 0.15),
            0 8px 25px rgba(124, 58, 237, 0.25);
          transform: translateY(-2px);
        }

        .input:focus::placeholder {
          color: rgba(160, 174, 208, 0.8);
        }

        /* Select */
        .select {
          width: 100%;
          border-radius: 0.875rem;
          padding: 1rem 1.25rem;
          font-size: 1rem;
          background: rgba(15, 15, 26, 0.6);
          border: 1.5px solid rgba(168, 85, 247, 0.25);
          backdrop-filter: blur(12px);
          color: #e0e7ff;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
          transition: all var(--timing-normal) ease;
          outline: none;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23a855f7' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          background-size: 1rem;
          padding-right: 3rem;
        }

        .select:focus {
          background: rgba(15, 15, 26, 0.8);
          border-color: rgba(255, 215, 0, 0.6);
          box-shadow: 
            0 0 0 3px rgba(168, 85, 247, 0.15),
            0 8px 25px rgba(124, 58, 237, 0.25);
          transform: translateY(-2px);
        }

        .option {
          background: rgba(15, 15, 26, 0.95);
          color: #e0e7ff;
          padding: 0.75rem;
        }

        /* Alertas */
        .alert {
          padding: 1rem 1.25rem;
          border-radius: 0.75rem;
          font-size: 0.9rem;
          font-weight: 500;
          backdrop-filter: blur(8px);
          margin-bottom: 1rem;
          animation: alertSlide 0.5s ease-out;
          border: 1px solid;
          position: relative;
          overflow: hidden;
        }

        .alert::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: currentColor;
        }

        @keyframes alertSlide {
          from { 
            opacity: 0; 
            transform: translateY(-10px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }

        .alert-error {
          background: rgba(239, 68, 68, 0.15);
          border-color: rgba(239, 68, 68, 0.3);
          color: #fca5a5;
        }

        .alert-success {
          background: rgba(34, 197, 94, 0.15);
          border-color: rgba(34, 197, 94, 0.3);
          color: #86efac;
        }

        /* Botón principal */
        .btn {
          width: 100%;
          border-radius: 0.875rem;
          font-weight: 700;
          font-size: 1rem;
          transition: all var(--timing-normal) ease;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          background: var(--gradient-button);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
          color: white;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 215, 0, 0.25);
          min-height: 3.25rem;
          padding: 0 1.5rem;
          cursor: pointer;
          border: none;
          animation: buttonAppear 0.6s ease-out;
          animation-delay: 0.6s;
          animation-fill-mode: both;
        }

        @keyframes buttonAppear {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }

        .btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
          transform: translateX(-100%);
          transition: transform var(--timing-slow);
        }

        .btn:hover {
          background: linear-gradient(135deg, rgba(124, 58, 237, 1) 0%, rgba(168, 85, 247, 1) 50%, rgba(196, 125, 252, 1) 100%);
          box-shadow: 0 15px 35px rgba(124, 58, 237, 0.4);
          transform: translateY(-3px);
          border-color: rgba(255, 215, 0, 0.4);
        }

        .btn:hover::before {
          transform: translateX(100%);
        }

        .btn:active {
          transform: translateY(-1px) scale(0.98);
        }

        .btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .btn:disabled:hover {
          transform: none;
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
        }

        /* Loader */
        .loader {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid #ffffff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-right: 0.5rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Footer */
        .footer {
          text-align: center;
          margin-top: 2rem;
          animation: footerFade 0.8s ease-out;
          animation-delay: 0.8s;
          animation-fill-mode: both;
        }

        @keyframes footerFade {
          from { 
            opacity: 0; 
            transform: translateY(10px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }

        .footer-link {
          color: rgba(160, 174, 208, 0.8);
          text-decoration: none;
          font-size: 0.9rem;
          transition: all var(--timing-normal) ease;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          display: inline-block;
          position: relative;
          overflow: hidden;
          background: rgba(15, 15, 26, 0.3);
          border: 1px solid rgba(168, 85, 247, 0.1);
          backdrop-filter: blur(8px);
        }

        .footer-link::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.1), transparent);
          transform: translateX(-100%);
          transition: transform var(--timing-normal);
        }

        .footer-link:hover {
          color: #a855f7;
          background: rgba(168, 85, 247, 0.1);
          border-color: rgba(168, 85, 247, 0.3);
          transform: translateY(-2px);
        }

        .footer-link:hover::before {
          transform: translateX(100%);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .container {
            padding: 1.5rem;
          }
          
          .form-card {
            padding: 2rem;
            max-width: 24rem;
          }
          
          .title {
            font-size: 2.25rem;
          }
          
          .input, .select, .btn {
            padding: 0.875rem 1rem;
            font-size: 0.95rem;
          }
          
          .select {
            padding-right: 2.5rem;
          }
        }

        @media (max-width: 480px) {
          .container {
            padding: 1rem;
          }
          
          .form-card {
            padding: 1.5rem;
            max-width: 20rem;
          }
          
          .title {
            font-size: 2rem;
          }
          
          .input, .select, .btn {
            padding: 0.75rem 1rem;
            font-size: 0.9rem;
          }
        }

        /* Accesibilidad */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        .btn:focus-visible,
        .input:focus-visible,
        .select:focus-visible,
        .footer-link:focus-visible {
          outline: 2px solid rgba(168, 85, 247, 0.8);
          outline-offset: 2px;
        }
      `}</style>

      <div className="container">
        <div className="form-card">
          <h1 className="title">Registro</h1>
          <p className="subtitle">Únete a nuestra plataforma educativa</p>
          
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label">Usuario</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="input"
                placeholder="Ingresa tu nombre de usuario"
                required
              />
            </div>

            <div className="form-group">
              <label className="label">Contraseña</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input"
                placeholder="Crea una contraseña segura"
                required
              />
            </div>

            <div className="form-group">
              <label className="label">Tipo de cuenta</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="select"
                required
              >
                <option value="student" className="option">Estudiante</option>
                <option value="professor" className="option">Profesor</option>
              </select>
            </div>

            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}

            {success && (
              <div className="alert alert-success">
                {success}
              </div>
            )}

            <button 
              type="submit" 
              className="btn"
              disabled={loading}
            >
              {loading && <div className="loader"></div>}
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>

          <div className="footer">
            <Link to="/login" className="footer-link">
              ¿Ya tienes cuenta? Inicia sesión
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;