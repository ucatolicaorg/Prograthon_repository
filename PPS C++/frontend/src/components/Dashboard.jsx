import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  // Función para obtener el color del rol
  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 50%, #ff4757 100%)';
      case 'professor':
        return 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 50%, #2ed573 100%)';
      case 'student':
        return 'linear-gradient(135deg, #ffa726 0%, #ff9800 50%, #f57c00 100%)';
      default:
        return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
  };

  // Función para obtener el icono del rol
  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return '👑';
      case 'professor':
        return '🎓';
      case 'student':
        return '📚';
      default:
        return '👤';
    }
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
          --shadow-glass: 0 20px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);
          --shadow-hover: 0 25px 50px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15);
          --timing-fast: 0.2s;
          --timing-normal: 0.3s;
          --timing-slow: 0.5s;
        }

        /* Reset básico */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        /* Contenedor principal */
        .dashboard-container {
          min-height: 100vh;
          background: var(--gradient-primary);
          background-attachment: fixed;
          background-size: 400% 400%;
          animation: gradientFlow 20s ease infinite;
          padding: 2rem;
          position: relative;
          overflow-x: hidden;
        }

        @keyframes gradientFlow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        /* Patrón de fondo sutil */
        .dashboard-container::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
          background-size: 80px 80px, 120px 120px;
          animation: patternMove 40s linear infinite;
          pointer-events: none;
          z-index: 1;
        }

        @keyframes patternMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(80px, 80px); }
        }

        /* Contenido principal */
        .dashboard-content {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        /* Header */
        .dashboard-header {
          text-align: center;
          margin-bottom: 3rem;
          position: relative;
        }

        .dashboard-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 900;
          letter-spacing: -0.02em;
          background: var(--gradient-text);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1rem;
          position: relative;
          display: inline-block;
          text-shadow: 0 0 30px rgba(255, 215, 0, 0.3);
        }

        .dashboard-title::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transform: translateX(-100%);
          animation: shimmer 8s infinite;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .dashboard-subtitle {
          font-size: 1.2rem;
          color: rgba(160, 174, 208, 0.8);
          font-weight: 400;
          margin-top: 0.5rem;
        }

        /* Sección de bienvenida */
        .welcome-section {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          backdrop-filter: blur(20px);
          border-radius: 2rem;
          padding: 2.5rem;
          margin-bottom: 2.5rem;
          box-shadow: var(--shadow-glass);
          transition: all var(--timing-normal) ease;
          position: relative;
          overflow: hidden;
        }

        .welcome-section:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-hover);
          border-color: rgba(255, 215, 0, 0.4);
        }

        .welcome-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(45deg, transparent, rgba(168, 85, 247, 0.05), transparent);
          transform: translateX(-100%);
          transition: transform var(--timing-slow);
          z-index: 1;
        }

        .welcome-section:hover::before {
          transform: translateX(100%);
        }

        .welcome-content {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 2rem;
        }

        .user-info {
          flex: 1;
          min-width: 250px;
        }

        .welcome-title {
          font-size: 2rem;
          font-weight: 700;
          color: #ffd700;
          margin-bottom: 1rem;
          text-shadow: 0 2px 10px rgba(255, 215, 0, 0.3);
        }

        .user-role {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: 1.5rem;
          font-size: 1rem;
          font-weight: 600;
          background: ${getRoleColor(user?.role)};
          color: white;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
          text-transform: capitalize;
          position: relative;
          overflow: hidden;
        }

        .user-role::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transform: translateX(-100%);
          transition: transform var(--timing-slow);
        }

        .user-role:hover::before {
          transform: translateX(100%);
        }

        .user-role-icon {
          font-size: 1.2rem;
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
        }

        .logout-btn {
          background: var(--gradient-button);
          border: 1px solid rgba(255, 215, 0, 0.3);
          color: white;
          padding: 1rem 2rem;
          border-radius: 1rem;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all var(--timing-normal) ease;
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
          position: relative;
          overflow: hidden;
          min-width: 160px;
        }

        .logout-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transform: translateX(-100%);
          transition: transform var(--timing-slow);
        }

        .logout-btn:hover {
          background: linear-gradient(135deg, rgba(124, 58, 237, 0.9) 0%, rgba(168, 85, 247, 0.9) 100%);
          box-shadow: 0 12px 35px rgba(124, 58, 237, 0.4);
          transform: translateY(-3px);
          border-color: rgba(255, 215, 0, 0.5);
        }

        .logout-btn:hover::before {
          transform: translateX(100%);
        }

        .logout-btn:active {
          transform: translateY(-1px) scale(0.98);
        }

        /* Sección de navegación */
        .navigation-section {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          backdrop-filter: blur(20px);
          border-radius: 2rem;
          padding: 2.5rem;
          box-shadow: var(--shadow-glass);
          transition: all var(--timing-normal) ease;
          position: relative;
          overflow: hidden;
        }

        .navigation-section:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-hover);
          border-color: rgba(255, 215, 0, 0.4);
        }

        .navigation-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(45deg, transparent, rgba(168, 85, 247, 0.05), transparent);
          transform: translateX(-100%);
          transition: transform var(--timing-slow);
          z-index: 1;
        }

        .navigation-section:hover::before {
          transform: translateX(100%);
        }

        .nav-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #ffd700;
          margin-bottom: 2rem;
          text-align: center;
          position: relative;
          z-index: 2;
          text-shadow: 0 2px 10px rgba(255, 215, 0, 0.3);
        }

        .nav-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          list-style: none;
          margin: 0;
          padding: 0;
          position: relative;
          z-index: 2;
        }

        .nav-item {
          position: relative;
        }

        .nav-link {
          display: block;
          padding: 1.5rem 2rem;
          background: rgba(15, 15, 26, 0.8);
          border: 1px solid rgba(168, 85, 247, 0.3);
          border-radius: 1.25rem;
          color: #e0e7ff;
          text-decoration: none;
          font-weight: 600;
          font-size: 1.1rem;
          transition: all var(--timing-normal) ease;
          backdrop-filter: blur(15px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
          position: relative;
          overflow: hidden;
          text-align: center;
          min-height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
        }

        .nav-link::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(45deg, transparent, rgba(168, 85, 247, 0.1), transparent);
          transform: translateX(-100%);
          transition: transform var(--timing-slow);
        }

        .nav-link:hover {
          background: rgba(59, 130, 246, 0.4);
          border-color: rgba(168, 85, 247, 0.6);
          transform: translateY(-4px);
          box-shadow: 0 15px 35px rgba(59, 130, 246, 0.3);
          color: white;
        }

        .nav-link:hover::before {
          transform: translateX(100%);
        }

        .nav-link:active {
          transform: translateY(-2px) scale(0.98);
        }

        .nav-link-icon {
          font-size: 1.3rem;
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
        }

        /* Estilos específicos para diferentes tipos de enlaces */
        .nav-link[href*="marathons"] {
          border-color: rgba(245, 158, 11, 0.4);
          background: rgba(245, 158, 11, 0.1);
        }

        .nav-link[href*="marathons"]:hover {
          background: rgba(245, 158, 11, 0.3);
          border-color: rgba(245, 158, 11, 0.6);
          box-shadow: 0 15px 35px rgba(245, 158, 11, 0.3);
        }

        .nav-link[href*="problems"] {
          border-color: rgba(34, 197, 94, 0.4);
          background: rgba(34, 197, 94, 0.1);
        }

        .nav-link[href*="problems"]:hover {
          background: rgba(34, 197, 94, 0.3);
          border-color: rgba(34, 197, 94, 0.6);
          box-shadow: 0 15px 35px rgba(34, 197, 94, 0.3);
        }

        .nav-link[href*="users"] {
          border-color: rgba(168, 85, 247, 0.4);
          background: rgba(168, 85, 247, 0.1);
        }

        .nav-link[href*="users"]:hover {
          background: rgba(168, 85, 247, 0.3);
          border-color: rgba(168, 85, 247, 0.6);
          box-shadow: 0 15px 35px rgba(168, 85, 247, 0.3);
        }

        .nav-link[href*="profile"] {
          border-color: rgba(239, 68, 68, 0.4);
          background: rgba(239, 68, 68, 0.1);
        }

        .nav-link[href*="profile"]:hover {
          background: rgba(239, 68, 68, 0.3);
          border-color: rgba(239, 68, 68, 0.6);
          box-shadow: 0 15px 35px rgba(239, 68, 68, 0.3);
        }

        .nav-link[href*="create"] {
          border-color: rgba(255, 215, 0, 0.4);
          background: rgba(255, 215, 0, 0.1);
        }

        .nav-link[href*="create"]:hover {
          background: rgba(255, 215, 0, 0.2);
          border-color: rgba(255, 215, 0, 0.6);
          box-shadow: 0 15px 35px rgba(255, 215, 0, 0.3);
        }

        .nav-link[href*="my-marathons"] {
          border-color: rgba(139, 69, 19, 0.4);
          background: rgba(139, 69, 19, 0.1);
        }

        .nav-link[href*="my-marathons"]:hover {
          background: rgba(139, 69, 19, 0.3);
          border-color: rgba(139, 69, 19, 0.6);
          box-shadow: 0 15px 35px rgba(139, 69, 19, 0.3);
        }

        /* Animaciones de entrada */
        .fade-in {
          animation: fadeInUp 0.8s ease-out;
        }

        .fade-in-delay-1 {
          animation: fadeInUp 0.8s ease-out 0.2s both;
        }

        .fade-in-delay-2 {
          animation: fadeInUp 0.8s ease-out 0.4s both;
        }

        @keyframes fadeInUp {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .nav-grid {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .dashboard-container {
            padding: 1.5rem;
          }

          .welcome-content {
            flex-direction: column;
            text-align: center;
            gap: 1.5rem;
          }

          .nav-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .dashboard-title {
            font-size: 2.5rem;
          }

          .welcome-section,
          .navigation-section {
            padding: 2rem;
          }

          .nav-link {
            padding: 1.25rem 1.5rem;
            font-size: 1rem;
          }
        }

        @media (max-width: 480px) {
          .dashboard-container {
            padding: 1rem;
          }

          .welcome-section,
          .navigation-section {
            padding: 1.5rem;
          }

          .nav-link {
            padding: 1rem 1.25rem;
            min-height: 70px;
          }

          .logout-btn {
            padding: 0.875rem 1.5rem;
            min-width: 140px;
          }

          .user-role {
            padding: 0.625rem 1.25rem;
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

        .nav-link:focus-visible,
        .logout-btn:focus-visible {
          outline: 3px solid rgba(168, 85, 247, 0.8);
          outline-offset: 3px;
        }

        /* Mejoras de hover para touch devices */
        @media (hover: none) {
          .nav-link:hover,
          .logout-btn:hover,
          .welcome-section:hover,
          .navigation-section:hover {
            transform: none;
          }
        }
      `}</style>

      <div className="dashboard-container">
        <div className="dashboard-content">
          <header className="dashboard-header fade-in">
            <h1 className="dashboard-title">Dashboard</h1>
            <p className="dashboard-subtitle">Panel de control - Sistema de Maratones</p>
          </header>

          <div className="welcome-section fade-in-delay-1">
            <div className="welcome-content">
              <div className="user-info">
                <h2 className="welcome-title">¡Bienvenido, {user?.username}!</h2>
                <div className="user-role">
                  <span className="user-role-icon">{getRoleIcon(user?.role)}</span>
                  <span>
                    {user?.role === 'admin' && 'Administrador'}
                    {user?.role === 'professor' && 'Profesor'}
                    {user?.role === 'student' && 'Estudiante'}
                  </span>
                </div>
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                🚪 Cerrar Sesión
              </button>
            </div>
          </div>

          <nav className="navigation-section fade-in-delay-2">
            <h3 className="nav-title">🧭 Navegación</h3>
            <ul className="nav-grid">
              <li className="nav-item">
                <Link to="/marathons" className="nav-link">
                  <span className="nav-link-icon">🏆</span>
                  <span>Ver Maratones</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/problems" className="nav-link">
                  <span className="nav-link-icon">🧩</span>
                  <span>Ver Problemas</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/users" className="nav-link">
                  <span className="nav-link-icon">👥</span>
                  <span>Ver Usuarios</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/profile" className="nav-link">
                  <span className="nav-link-icon">⚙️</span>
                  <span>Editar Perfil</span>
                </Link>
              </li>
              {user?.role === 'student' && (
                <li className="nav-item">
                  <Link to="/my-marathons" className="nav-link">
                    <span className="nav-link-icon">📋</span>
                    <span>Mis Maratones</span>
                  </Link>
                </li>
              )}
              {(user?.role === 'admin' || user?.role === 'professor') && (
                <>
                  <li className="nav-item">
                    <Link to="/create-marathon" className="nav-link">
                      <span className="nav-link-icon">➕</span>
                      <span>Crear Maratón</span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/create-problem" className="nav-link">
                      <span className="nav-link-icon">🔧</span>
                      <span>Crear Problema</span>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Dashboard;