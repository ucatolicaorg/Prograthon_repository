import React, { useState, useEffect } from 'react';
import { marathons } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const MarathonList = () => {
  const [marathonList, setMarathonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchMarathons = async () => {
      try {
        const response = await marathons.getAll();
        setMarathonList(response.data.marathons);
      } catch (error) {
        setError('Error al cargar maratones');
      } finally {
        setLoading(false);
      }
    };

    fetchMarathons();
  }, []);

  const handleRegister = async (marathonId) => {
    try {
      const response = await marathons.register(marathonId);
      if (response.data.success) {
        alert('Inscripción exitosa!');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Error en la inscripción');
    }
  };

  if (loading) return (
    <div className="marathon-container">
      <div className="loading-container">
        <div className="premium-loader"></div>
        <p className="loading-text">Cargando maratones...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="marathon-container">
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <p className="error-text">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="marathon-container">
      <div className="marathon-header">
        <h2 className="marathon-title">Maratones Disponibles</h2>
        <Link to="/dashboard" className="back-link">
          <span className="back-arrow">←</span>
          Volver al Dashboard
        </Link>
      </div>
      
      {marathonList.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🏃‍♂️</div>
          <p className="empty-text">No hay maratones disponibles.</p>
          <p className="empty-subtitle">Vuelve pronto para ver nuevos eventos.</p>
        </div>
      ) : (
        <div className="marathons-grid">
          {marathonList.map((marathon) => (
            <div key={marathon.id} className="marathon-card">
              <div className="marathon-card-header">
                <h3 className="marathon-name">{marathon.name}</h3>
                <div className="marathon-date">
                  {new Date(marathon.created_at).toLocaleDateString()}
                </div>
              </div>
              
              <div className="marathon-card-body">
                <p className="marathon-description">{marathon.description}</p>
                <div className="marathon-meta">
                  <span className="marathon-creator">
                    <span className="creator-icon">👤</span>
                    {marathon.created_by}
                  </span>
                </div>
              </div>
              
              <div className="marathon-card-footer">
                {user?.role === 'student' && (
                  <button 
                    onClick={() => handleRegister(marathon.id)}
                    className="register-button"
                  >
                    <span className="button-icon">✓</span>
                    Inscribirse
                  </button>
                )}
                
                <Link to={`/marathons/${marathon.id}`} className="details-link">
                  <button className="details-button">
                    <span className="button-icon">👁️</span>
                    Ver Detalles
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <style jsx>{`
        /* Estilos base de Tailwind integrados */
        .marathon-container {
          min-height: 100vh;
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
        }

        .marathon-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .marathon-title {
          font-size: 2.5rem;
          font-weight: 900;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #ffd700 0%, #ffed4e 25%, #fff8dc 50%, #f0f8ff 75%, #e6f3ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
          line-height: 1.1;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: 0.75rem;
          background: rgba(15, 15, 26, 0.7);
          border: 1px solid rgba(168, 85, 247, 0.3);
          color: #e0e7ff;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
          backdrop-filter: blur(12px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .back-link:hover {
          background: rgba(59, 130, 246, 0.4);
          border-color: rgba(168, 85, 247, 0.5);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
        }

        .back-arrow {
          font-size: 1.2rem;
          transition: transform 0.3s ease;
        }

        .back-link:hover .back-arrow {
          transform: translateX(-2px);
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          gap: 1rem;
        }

        .premium-loader {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(168, 85, 247, 0.3);
          border-top: 3px solid #a855f7;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading-text {
          color: #a0aecb;
          font-size: 1.1rem;
          margin: 0;
        }

        .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          gap: 1rem;
          padding: 2rem;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 1rem;
          backdrop-filter: blur(8px);
        }

        .error-icon {
          font-size: 3rem;
        }

        .error-text {
          color: #f87171;
          font-size: 1.2rem;
          font-weight: 600;
          margin: 0;
          text-align: center;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          gap: 1rem;
          padding: 3rem;
          background: rgba(15, 15, 26, 0.6);
          border: 1px solid rgba(168, 85, 247, 0.2);
          border-radius: 1.5rem;
          backdrop-filter: blur(12px);
          text-align: center;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .empty-text {
          color: #e0e7ff;
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0;
        }

        .empty-subtitle {
          color: #a0aecb;
          font-size: 1rem;
          margin: 0;
        }

        .marathons-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }

        .marathon-card {
          background: rgba(15, 15, 26, 0.8);
          border: 1px solid rgba(168, 85, 247, 0.3);
          border-radius: 1.5rem;
          padding: 1.5rem;
          transition: all 0.3s ease;
          backdrop-filter: blur(15px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);
          position: relative;
          overflow: hidden;
        }

        .marathon-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.5), transparent);
        }

        .marathon-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 215, 0, 0.3);
        }

        .marathon-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
          gap: 1rem;
        }

        .marathon-name {
          font-size: 1.4rem;
          font-weight: 700;
          color: #ffd700;
          margin: 0;
          line-height: 1.3;
          flex: 1;
        }

        .marathon-date {
          background: rgba(59, 130, 246, 0.2);
          color: #93c5fd;
          padding: 0.25rem 0.75rem;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          white-space: nowrap;
          border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .marathon-card-body {
          margin-bottom: 1.5rem;
        }

        .marathon-description {
          color: #e0e7ff;
          line-height: 1.6;
          margin: 0 0 1rem 0;
          font-size: 1rem;
        }

        .marathon-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .marathon-creator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #a0aecb;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .creator-icon {
          font-size: 1rem;
        }

        .marathon-card-footer {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .register-button {
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.8), rgba(74, 222, 128, 0.8));
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 0.5rem;
          padding: 0.75rem 1.25rem;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          box-shadow: 0 6px 20px rgba(34, 197, 94, 0.2);
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }

        .register-button:hover {
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.9), rgba(74, 222, 128, 0.9));
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(34, 197, 94, 0.3);
        }

        .register-button:active {
          transform: translateY(-1px) scale(0.98);
        }

        .details-link {
          text-decoration: none;
          flex: 1;
        }

        .details-button {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(37, 99, 235, 0.8));
          border: 1px solid rgba(255, 215, 0, 0.2);
          border-radius: 0.5rem;
          padding: 0.75rem 1.25rem;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          width: 100%;
          justify-content: center;
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }

        .details-button:hover {
          background: linear-gradient(135deg, rgba(124, 58, 237, 0.9), rgba(168, 85, 247, 0.9));
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(124, 58, 237, 0.4);
          border-color: rgba(255, 215, 0, 0.3);
        }

        .details-button:active {
          transform: translateY(-1px) scale(0.98);
        }

        .button-icon {
          font-size: 1rem;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .marathon-container {
            padding: 1rem;
          }

          .marathon-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .marathon-title {
            font-size: 2rem;
          }

          .marathons-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .marathon-card {
            padding: 1.25rem;
          }

          .marathon-card-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .marathon-date {
            align-self: flex-start;
          }

          .marathon-card-footer {
            flex-direction: column;
          }

          .details-link {
            flex: none;
          }
        }

        @media (max-width: 480px) {
          .marathon-container {
            padding: 0.75rem;
          }

          .marathon-title {
            font-size: 1.75rem;
          }

          .marathon-card {
            padding: 1rem;
          }

          .register-button,
          .details-button {
            padding: 0.625rem 1rem;
            font-size: 0.875rem;
          }
        }

        /* Mejoras de accesibilidad */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        .register-button:focus,
        .details-button:focus,
        .back-link:focus {
          outline: 2px solid rgba(168, 85, 247, 0.8);
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
};

export default MarathonList;