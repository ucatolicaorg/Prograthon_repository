import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { users } from '../services/api';

const EditProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    
    if (!formData.password.trim()) {
      alert('La contraseña es obligatoria');
      return;
    }

    setLoading(true);
    try {
      await users.updateProfile({
        username: formData.username,
        password: formData.password
      });
      alert('Perfil actualizado exitosamente. Debes iniciar sesión nuevamente.');
      logout();
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerContainer}>
        <div style={styles.backLinkContainer}>
          <Link to="/dashboard" style={styles.backLink} className="edit-profile-back-link">
            <span style={styles.backArrow} className="back-arrow">←</span>
            Volver al Dashboard
          </Link>
        </div>
        <h1 style={styles.title}>Editar Perfil</h1>
        <p style={styles.subtitle}>Actualiza tu información personal</p>
      </div>

      <div style={styles.formContainer} className="edit-profile-form-container">
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Usuario</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              style={styles.input}
              className="edit-profile-input"
              placeholder="Ingresa tu nombre de usuario"
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nueva Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
              className="edit-profile-input"
              placeholder="Ingresa tu nueva contraseña"
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirmar Contraseña</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              style={styles.input}
              className="edit-profile-input"
              placeholder="Confirma tu nueva contraseña"
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Rol</label>
            <input
              type="text"
              value={user?.role || ''}
              disabled
              style={styles.disabledInput}
              className="edit-profile-disabled-input"
            />
            <small style={styles.helpText}>Este campo no se puede modificar</small>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            style={loading ? {...styles.button, ...styles.buttonDisabled} : styles.button}
            className="edit-profile-button"
          >
            {loading ? (
              <span style={styles.loadingContainer}>
                <span style={styles.spinner}></span>
                Actualizando...
              </span>
            ) : (
              'Actualizar Perfil'
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
    background: 'linear-gradient(135deg, #1e1e3f 0%, #2d1b69 25%, #3d2c7f 50%, #1a1a2f 75%, #151517 100%)',
    color: '#e0e7ff',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative'
  },
  headerContainer: {
    width: '100%',
    maxWidth: '600px',
    marginBottom: '2rem',
    textAlign: 'center'
  },
  backLinkContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginBottom: '1.5rem'
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#a855f7',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    background: 'rgba(15, 15, 26, 0.6)',
    border: '1px solid rgba(168, 85, 247, 0.3)',
    backdropFilter: 'blur(8px)',
    transition: 'all 0.3s ease',
    fontSize: '0.95rem',
    fontWeight: '500'
  },
  backArrow: {
    fontSize: '1.2rem',
    transition: 'transform 0.3s ease'
  },
  title: {
    fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
    fontWeight: '900',
    letterSpacing: '-0.02em',
    background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 25%, #fff8dc 50%, #f0f8ff 75%, #e6f3ff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    lineHeight: '0.9',
    margin: '0 0 1rem 0'
  },
  subtitle: {
    fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
    color: 'rgba(160, 174, 208, 0.9)',
    fontWeight: '400',
    lineHeight: '1.6',
    margin: '0'
  },
  formContainer: {
    width: '100%',
    maxWidth: '500px',
    background: 'rgba(15, 15, 26, 0.8)',
    border: '1px solid rgba(168, 85, 247, 0.3)',
    backdropFilter: 'blur(15px)',
    borderRadius: '1.5rem',
    padding: '2.5rem',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    position: 'relative',
    overflow: 'hidden'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  label: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#e0e7ff',
    marginBottom: '0.25rem'
  },
  input: {
    width: '100%',
    padding: '0.875rem 1rem',
    fontSize: '1rem',
    background: 'rgba(15, 15, 26, 0.7)',
    border: '1px solid rgba(168, 85, 247, 0.3)',
    borderRadius: '0.75rem',
    color: '#e0e7ff',
    backdropFilter: 'blur(8px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease',
    outline: 'none',
    boxSizing: 'border-box'
  },
  disabledInput: {
    width: '100%',
    padding: '0.875rem 1rem',
    fontSize: '1rem',
    background: 'rgba(71, 85, 105, 0.3)',
    border: '1px solid rgba(148, 163, 184, 0.2)',
    borderRadius: '0.75rem',
    color: 'rgba(160, 174, 208, 0.7)',
    backdropFilter: 'blur(8px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    cursor: 'not-allowed',
    outline: 'none',
    boxSizing: 'border-box'
  },
  helpText: {
    fontSize: '0.8rem',
    color: 'rgba(160, 174, 208, 0.7)',
    fontStyle: 'italic',
    marginTop: '0.25rem'
  },
  button: {
    width: '100%',
    padding: '0.875rem 1.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    color: 'white',
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(37, 99, 235, 0.9) 50%, rgba(29, 78, 216, 0.9) 100%)',
    border: '1px solid rgba(255, 215, 0, 0.2)',
    borderRadius: '0.75rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 6px 20px rgba(59, 130, 246, 0.3)',
    textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
    marginTop: '1rem',
    minHeight: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    outline: 'none',
    boxSizing: 'border-box'
  },
  buttonDisabled: {
    opacity: '0.7',
    cursor: 'not-allowed',
    transform: 'none'
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    display: 'inline-block'
  }
};

// Agregar estilos CSS para animaciones y hover effects
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  /* Hover effects que no se pueden hacer con JavaScript inline */
  .edit-profile-back-link:hover {
    background: rgba(59, 130, 246, 0.3) !important;
    border-color: rgba(168, 85, 247, 0.4) !important;
    transform: translateY(-1px) !important;
    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.2) !important;
  }
  
  .edit-profile-back-link:hover .back-arrow {
    transform: translateX(-2px) !important;
  }
  
  .edit-profile-input:focus {
    background: rgba(15, 15, 26, 0.9) !important;
    border-color: rgba(255, 215, 0, 0.5) !important;
    box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.2), 0 6px 20px rgba(59, 130, 246, 0.3) !important;
    transform: translateY(-1px) !important;
  }
  
  .edit-profile-input::placeholder {
    color: rgba(255, 255, 255, 0.5) !important;
  }
  
  .edit-profile-button:hover:not(:disabled) {
    background: linear-gradient(135deg, rgba(124, 58, 237, 0.9) 0%, rgba(168, 85, 247, 0.9) 100%) !important;
    box-shadow: 0 8px 25px rgba(124, 58, 237, 0.4) !important;
    transform: translateY(-2px) !important;
    border-color: rgba(255, 215, 0, 0.3) !important;
  }
  
  .edit-profile-button:active:not(:disabled) {
    transform: translateY(-1px) scale(0.98) !important;
  }
  
  .edit-profile-form-container {
    position: relative;
  }
  
  .edit-profile-form-container::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.05), transparent);
    border-radius: 1.5rem;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }
  
  .edit-profile-form-container:hover::before {
    opacity: 1;
  }
  
  /* Responsive adjustments */
  @media (max-width: 768px) {
    .edit-profile-form-container {
      padding: 1.5rem !important;
      margin: 0 1rem !important;
    }
    
    .edit-profile-input,
    .edit-profile-disabled-input,
    .edit-profile-button {
      padding: 0.75rem 1rem !important;
      font-size: 0.95rem !important;
    }
  }
  
  @media (max-width: 480px) {
    .edit-profile-form-container {
      padding: 1rem !important;
    }
  }
`;

// Agregar el stylesheet solo si no existe
if (!document.getElementById('edit-profile-styles')) {
  styleSheet.id = 'edit-profile-styles';
  document.head.appendChild(styleSheet);
}

export default EditProfile;