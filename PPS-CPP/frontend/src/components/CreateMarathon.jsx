import React, { useState } from 'react';
import { marathons } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function CreateMarathon() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: '',
    description: '',
    max_problems: 1, // número
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!user || (user.role !== 'admin' && user.role !== 'professor')) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: 'rgba(15, 15, 26, 0.8)',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          borderRadius: '20px',
          padding: '40px',
          textAlign: 'center',
          backdropFilter: 'blur(15px)',
          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          color: '#e0e7ff',
          fontSize: '1.25rem',
          fontWeight: '600'
        }}>
          🚫 Acceso Denegado
          <div style={{ 
            marginTop: '15px', 
            fontSize: '1rem', 
            color: 'rgba(160, 174, 208, 0.9)',
            fontWeight: '400'
          }}>
            No tienes permisos para acceder a esta página
          </div>
        </div>
      </div>
    );
  }

  const onChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'max_problems'
        ? parseInt(value, 10) || 0
        : value,
    }));
  };

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await marathons.create(form);
      nav('/marathons');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      padding: '20px',
      background: 'linear-gradient(135deg, #1e1e3f 0%, #2d1b69 25%, #3d2c7f 50%, #1a1a2f 75%, #151517 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradientFlow 20s ease infinite'
    }}>
      <style>{`
        @keyframes gradientFlow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes fadeInUp {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .glass-input:focus {
          outline: none;
          background: rgba(15, 15, 26, 0.9);
          border-color: rgba(255, 215, 0, 0.5);
          box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.2), 0 6px 20px rgba(59, 130, 246, 0.3);
          transform: translateY(-1px);
        }
        
        .glass-button:hover {
          background: linear-gradient(135deg, rgba(124, 58, 237, 0.9) 0%, rgba(168, 85, 247, 0.9) 100%);
          box-shadow: 0 8px 25px rgba(124, 58, 237, 0.4);
          transform: translateY(-2px);
          border-color: rgba(255, 215, 0, 0.3);
        }
        
        .glass-button:active {
          transform: translateY(-1px) scale(0.98);
        }
        
        .glass-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }
        
        .glass-button:disabled:hover {
          transform: none;
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);
        }
        
        .back-link:hover {
          background: rgba(59, 130, 246, 0.3);
          border-color: rgba(168, 85, 247, 0.4);
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.2);
        }
        
        .form-group {
          margin-bottom: 24px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 8px;
          color: rgba(160, 174, 208, 0.9);
          font-weight: 600;
          font-size: 0.95rem;
        }
        
        .premium-loader {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(168, 85, 247, 0.3);
          border-top: 2px solid #a855f7;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-right: 8px;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .error-message {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #f87171;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 0.95rem;
          backdrop-filter: blur(8px);
        }
        
        .title-shimmer::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transform: translateX(-100%);
          animation: shimmer 6s infinite;
        }
        
        @media (max-width: 768px) {
          .container {
            margin: 10px !important;
            padding: 30px !important;
          }
          
          .title {
            font-size: 2rem !important;
          }
          
          .form-group {
            margin-bottom: 20px !important;
          }
        }
      `}</style>
      
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        paddingTop: '40px'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
          animation: 'fadeInUp 0.6s ease-out'
        }}>
          <h1 className="title" style={{
            fontSize: 'clamp(2.5rem, 5vw, 3rem)',
            fontWeight: '900',
            letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 25%, #fff8dc 50%, #f0f8ff 75%, #e6f3ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: '0.9',
            position: 'relative',
            marginBottom: '1rem'
          }}>
            ✨ Crear Maratón
          </h1>
          
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.1rem)',
            color: 'rgba(160, 174, 208, 0.9)',
            fontWeight: '400',
            lineHeight: '1.6',
            marginBottom: '30px'
          }}>
            Configura una nueva maratón de programación para tus estudiantes
          </p>
        </div>

        {/* Back Link */}
        <div style={{ marginBottom: '30px' }}>
          <Link 
            to="/dashboard" 
            className="back-link"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '10px 20px',
              borderRadius: '12px',
              fontSize: '0.95rem',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              background: 'rgba(15, 15, 26, 0.6)',
              border: '1px solid rgba(168, 85, 247, 0.2)',
              backdropFilter: 'blur(8px)',
              color: '#e0e7ff',
              textDecoration: 'none'
            }}
          >
            ← Volver al Dashboard
          </Link>
        </div>

        {/* Form Container */}
        <div className="container" style={{
          background: 'rgba(15, 15, 26, 0.8)',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          borderRadius: '24px',
          padding: '40px',
          backdropFilter: 'blur(15px)',
          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          animation: 'fadeInUp 0.6s ease-out 0.2s both'
        }}>
          
          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={onSubmit}>
            {/* Name Field */}
            <div className="form-group">
              <label htmlFor="name">
                📝 Nombre del Maratón
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={onChange}
                required
                placeholder="Ej: Maratón de Algoritmos 2024"
                className="glass-input"
                style={{
                  width: '100%',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  background: 'rgba(15, 15, 26, 0.7)',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  color: 'white',
                  backdropFilter: 'blur(8px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                }}
              />
            </div>

            {/* Description Field */}
            <div className="form-group">
              <label htmlFor="description">
                📄 Descripción
              </label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={onChange}
                required
                placeholder="Describe el objetivo y las reglas del maratón..."
                rows={4}
                className="glass-input"
                style={{
                  width: '100%',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  background: 'rgba(15, 15, 26, 0.7)',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  color: 'white',
                  backdropFilter: 'blur(8px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                  resize: 'vertical',
                  minHeight: '120px'
                }}
              />
            </div>

            {/* Max Problems Field */}
            <div className="form-group">
              <label htmlFor="max_problems">
                🔢 Límite de Problemas
              </label>
              <input
                id="max_problems"
                name="max_problems"
                type="number"
                value={form.max_problems}
                onChange={onChange}
                min="1"
                required
                placeholder="Número máximo de problemas"
                className="glass-input"
                style={{
                  width: '100%',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  background: 'rgba(15, 15, 26, 0.7)',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  color: 'white',
                  backdropFilter: 'blur(8px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="glass-button"
              style={{
                width: '100%',
                borderRadius: '12px',
                fontWeight: '700',
                fontSize: '1.1rem',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(37, 99, 235, 0.9) 50%, rgba(29, 78, 216, 0.9) 100%)',
                border: '1px solid rgba(255, 215, 0, 0.2)',
                boxShadow: '0 6px 20px rgba(59, 130, 246, 0.3)',
                color: 'white',
                cursor: loading ? 'not-allowed' : 'pointer',
                minHeight: '56px',
                padding: '0 24px',
                textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading && <div className="premium-loader"></div>}
              {loading ? 'Creando Maratón...' : '🚀 Crear Maratón'}
            </button>
          </form>
        </div>

        {/* Footer Info */}
        <div style={{
          textAlign: 'center',
          marginTop: '30px',
          padding: '20px',
          color: 'rgba(160, 174, 208, 0.7)',
          fontSize: '0.9rem'
        }}>
          💡 Tip: Puedes editar la configuración después de crear el maratón
        </div>
      </div>
    </div>
  );
}