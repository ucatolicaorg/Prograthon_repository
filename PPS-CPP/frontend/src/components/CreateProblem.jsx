import React, { useState } from 'react';
import { problems } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const CreateProblem = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'easy',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  // Verificar permisos
  if (user?.role !== 'admin' && user?.role !== 'professor') {
    return (
      <div style={styles.container}>
        <div style={styles.accessDeniedCard}>
          <div style={styles.accessDeniedIcon}>🚫</div>
          <h2 style={styles.accessDeniedTitle}>Acceso Denegado</h2>
          <p style={styles.accessDeniedText}>Solo administradores y profesores pueden crear problemas.</p>
          <Link to="/dashboard" style={styles.backLink}>
            <span style={styles.backArrow}>←</span> Volver al Dashboard
          </Link>
        </div>
      </div>
    );
  }

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
    try {
      const response = await problems.create(formData);
      if (response.data.success) {
        alert('Problema creado exitosamente!');
        navigate('/problems');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error al crear problema');
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '#86efac';
      case 'medium': return '#fbbf24';
      case 'hard': return '#f87171';
      default: return '#93c5fd';
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Crear Nuevo Problema</h2>
        <Link to="/dashboard" style={styles.backLink}>
          <span style={styles.backArrow}>←</span> Volver al Dashboard
        </Link>
      </div>

      <div style={styles.formCard}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Título del Problema:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Ingresa el título del problema..."
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Descripción:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="6"
              style={{ ...styles.input, ...styles.textarea }}
              placeholder="Describe el problema detalladamente..."
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Dificultad:</label>
            <div style={styles.selectWrapper}>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                required
                style={{
                  ...styles.select,
                  color: getDifficultyColor(formData.difficulty)
                }}
              >
                <option value="easy">🟢 Fácil</option>
                <option value="medium">🟡 Medio</option>
                <option value="hard">🔴 Difícil</option>
              </select>
            </div>
          </div>

          {error && (
            <div style={styles.errorMessage}>
              <span style={styles.errorIcon}>⚠️</span>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            style={{
              ...styles.submitButton,
              ...(loading ? styles.submitButtonLoading : {})
            }}
          >
            {loading ? (
              <>
                <span style={styles.spinner}></span>
                Creando...
              </>
            ) : (
              <>
                <span style={styles.buttonIcon}>✨</span>
                Crear Problema
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    padding: '2rem',
    background: 'linear-gradient(135deg, #1e1e3f 0%, #2d1b69 25%, #3d2c7f 50%, #1a1a2f 75%, #151517 100%)',
    backgroundAttachment: 'fixed',
    position: 'relative',
  },

  header: {
    textAlign: 'center',
    marginBottom: '2rem',
    animation: 'fadeInUp 0.6s ease-out',
  },

  title: {
    fontSize: 'clamp(2rem, 4vw, 2.5rem)',
    fontWeight: '900',
    letterSpacing: '-0.02em',
    background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 25%, #fff8dc 50%, #f0f8ff 75%, #e6f3ff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '1rem',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
  },

  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#a0aecf',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: '500',
    padding: '0.5rem 1rem',
    borderRadius: '0.75rem',
    background: 'rgba(15, 15, 26, 0.6)',
    border: '1px solid rgba(168, 85, 247, 0.3)',
    backdropFilter: 'blur(8px)',
    transition: 'all 0.3s ease',
  },

  backArrow: {
    transition: 'transform 0.3s ease',
  },

  formCard: {
    maxWidth: '600px',
    margin: '0 auto',
    background: 'rgba(15, 15, 26, 0.8)',
    border: '1px solid rgba(168, 85, 247, 0.3)',
    borderRadius: '1.5rem',
    padding: '2rem',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    animation: 'fadeInUp 0.6s ease-out 0.2s both',
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },

  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },

  label: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#e0e7ff',
    letterSpacing: '0.025em',
  },

  input: {
    width: '100%',
    padding: '1rem 1.25rem',
    fontSize: '1rem',
    borderRadius: '0.75rem',
    background: 'rgba(15, 15, 26, 0.7)',
    border: '1px solid rgba(168, 85, 247, 0.3)',
    color: '#e0e7ff',
    backdropFilter: 'blur(8px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease',
    outline: 'none',
    fontFamily: 'inherit',
  },

  textarea: {
    resize: 'vertical',
    minHeight: '120px',
    lineHeight: '1.6',
  },

  selectWrapper: {
    position: 'relative',
  },

  select: {
    width: '100%',
    padding: '1rem 1.25rem',
    fontSize: '1rem',
    borderRadius: '0.75rem',
    background: 'rgba(15, 15, 26, 0.7)',
    border: '1px solid rgba(168, 85, 247, 0.3)',
    color: '#e0e7ff',
    backdropFilter: 'blur(8px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease',
    outline: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    appearance: 'none',
    backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23a855f7\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6,9 12,15 18,9\'%3e%3c/polyline%3e%3c/svg%3e")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 1rem center',
    backgroundSize: '1rem',
    paddingRight: '3rem',
  },

  errorMessage: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1rem',
    borderRadius: '0.75rem',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    color: '#f87171',
    fontSize: '0.95rem',
    fontWeight: '500',
    animation: 'slideInRight 0.3s ease-out',
  },

  errorIcon: {
    fontSize: '1.1rem',
  },

  submitButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '1rem 2rem',
    fontSize: '1.1rem',
    fontWeight: '700',
    borderRadius: '0.75rem',
    border: '1px solid rgba(255, 215, 0, 0.3)',
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(37, 99, 235, 0.9) 50%, rgba(29, 78, 216, 0.9) 100%)',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
    outline: 'none',
    fontFamily: 'inherit',
    marginTop: '1rem',
  },

  submitButtonLoading: {
    opacity: '0.8',
    cursor: 'not-allowed',
    transform: 'scale(0.98)',
  },

  buttonIcon: {
    fontSize: '1.2rem',
  },

  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },

  // Acceso denegado
  accessDeniedCard: {
    maxWidth: '500px',
    margin: '0 auto',
    textAlign: 'center',
    background: 'rgba(15, 15, 26, 0.8)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '1.5rem',
    padding: '3rem 2rem',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    animation: 'fadeInUp 0.6s ease-out',
  },

  accessDeniedIcon: {
    fontSize: '4rem',
    marginBottom: '1.5rem',
  },

  accessDeniedTitle: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#f87171',
    marginBottom: '1rem',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
  },

  accessDeniedText: {
    fontSize: '1.1rem',
    color: '#a0aecf',
    marginBottom: '2rem',
    lineHeight: '1.6',
  },
};

// Agregar estilos CSS dinámicos
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(30px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Hover effects */
  input:focus, textarea:focus, select:focus {
    background: rgba(15, 15, 26, 0.9) !important;
    border-color: rgba(255, 215, 0, 0.5) !important;
    box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.2), 0 6px 20px rgba(59, 130, 246, 0.3) !important;
    transform: translateY(-1px) !important;
  }

  input::placeholder, textarea::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  button:hover:not(:disabled) {
    background: linear-gradient(135deg, rgba(124, 58, 237, 0.9) 0%, rgba(168, 85, 247, 0.9) 100%) !important;
    box-shadow: 0 12px 30px rgba(124, 58, 237, 0.4) !important;
    transform: translateY(-2px) !important;
    border-color: rgba(255, 215, 0, 0.4) !important;
  }

  button:active:not(:disabled) {
    transform: translateY(-1px) scale(0.98) !important;
  }

  a:hover {
    background: rgba(59, 130, 246, 0.3) !important;
    border-color: rgba(168, 85, 247, 0.4) !important;
    transform: translateY(-1px) !important;
    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.2) !important;
  }

  a:hover span {
    transform: translateX(-2px) !important;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .container {
      padding: 1rem !important;
    }
    
    .formCard {
      padding: 1.5rem !important;
    }
    
    .title {
      font-size: 1.75rem !important;
    }
  }
`;

if (!document.getElementById('create-problem-styles')) {
  styleSheet.id = 'create-problem-styles';
  document.head.appendChild(styleSheet);
}

export default CreateProblem;