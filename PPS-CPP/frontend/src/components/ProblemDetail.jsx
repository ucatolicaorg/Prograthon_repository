import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { problems } from '../services/api';

export default function ProblemDetail() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    problems.getById(id)
      .then(r => setP(r.data.problem))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="problem-detail-container">
      <div className="problem-detail-card">
        <div className="premium-loader"></div>
        <p className="loading-text">Cargando problema...</p>
      </div>
    </div>
  );

  if (!p) return (
    <div className="problem-detail-container">
      <div className="problem-detail-card">
        <div className="not-found-content">
          <div className="not-found-icon">⚠️</div>
          <h2 className="not-found-title">Problema no encontrado</h2>
          <p className="not-found-description">
            El problema que buscas no existe o ha sido eliminado.
          </p>
          <Link to="/problems" className="glass-button-premium back-button">
            ← Volver a problemas
          </Link>
        </div>
      </div>
    </div>
  );

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'fácil':
      case 'facil':
      case 'easy':
        return 'difficulty-easy';
      case 'medio':
      case 'medium':
        return 'difficulty-medium';
      case 'difícil':
      case 'dificil':
      case 'hard':
        return 'difficulty-hard';
      default:
        return 'difficulty-medium';
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Fecha no disponible';
    }
  };

  return (
    <div className="problem-detail-container">
      <div className="problem-detail-card fade-in">
        {/* Header */}
        <div className="problem-header">
          <Link to="/problems" className="back-link">
            <span className="back-arrow">←</span>
            Volver a problemas
          </Link>
          <div className={`difficulty-badge ${getDifficultyColor(p.difficulty)}`}>
            {p.difficulty || 'No especificada'}
          </div>
        </div>

        {/* Título principal */}
        <div className="problem-title-section">
          <h1 className="problem-title">{p.title}</h1>
        </div>

        {/* Contenido principal */}
        <div className="problem-content">
          <div className="problem-description">
            <h3 className="section-title">Descripción</h3>
            <p className="description-text">{p.description}</p>
          </div>
        </div>

        {/* Metadatos */}
        <div className="problem-metadata">
          <div className="metadata-item">
            <span className="metadata-label">Creado por:</span>
            <span className="metadata-value">{p.created_by || 'Usuario anónimo'}</span>
          </div>
          <div className="metadata-item">
            <span className="metadata-label">Fecha de creación:</span>
            <span className="metadata-value">{formatDate(p.created_at)}</span>
          </div>
        </div>

        {/* Footer con acciones */}
        <div className="problem-footer">
          <Link to="/problems" className="glass-button-premium">
            ← Volver a la lista
          </Link>
        </div>
      </div>

      <style jsx>{`
        /* Estilos base sin dependencias de Tailwind */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .problem-detail-container {
          min-height: 100vh;
          padding: 2rem 1rem;
          background: linear-gradient(135deg, #1e1e3f 0%, #2d1b69 25%, #3d2c7f 50%, #1a1a2f 75%, #151517 100%);
          background-attachment: fixed;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .problem-detail-card {
          width: 100%;
          max-width: 800px;
          background: rgba(15, 15, 26, 0.8);
          border: 1px solid rgba(168, 85, 247, 0.3);
          backdrop-filter: blur(15px);
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);
          position: relative;
          overflow: hidden;
        }

        .problem-detail-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.5), transparent);
        }

        /* Estados de carga */
        .premium-loader {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(168, 85, 247, 0.3);
          border-top: 3px solid #a855f7;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading-text {
          text-align: center;
          color: rgba(224, 231, 255, 0.8);
          font-size: 1.1rem;
          font-weight: 500;
        }

        /* Estado de no encontrado */
        .not-found-content {
          text-align: center;
          padding: 2rem 0;
        }

        .not-found-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          opacity: 0.8;
        }

        .not-found-title {
          font-size: 1.5rem;
          color: #e0e7ff;
          margin-bottom: 1rem;
          font-weight: 600;
        }

        .not-found-description {
          color: rgba(224, 231, 255, 0.7);
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        /* Header */
        .problem-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(168, 85, 247, 0.2);
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: rgba(224, 231, 255, 0.8);
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.3s ease;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          border: 1px solid rgba(168, 85, 247, 0.2);
          background: rgba(15, 15, 26, 0.6);
        }

        .back-link:hover {
          color: #ffd700;
          background: rgba(59, 130, 246, 0.3);
          border-color: rgba(168, 85, 247, 0.4);
          transform: translateY(-1px);
        }

        .back-arrow {
          font-size: 1.1rem;
          transition: transform 0.3s ease;
        }

        .back-link:hover .back-arrow {
          transform: translateX(-2px);
        }

        /* Badges de dificultad */
        .difficulty-badge {
          padding: 0.5rem 1rem;
          border-radius: 1rem;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border: 1px solid;
          backdrop-filter: blur(8px);
        }

        .difficulty-easy {
          background: rgba(34, 197, 94, 0.1);
          border-color: rgba(34, 197, 94, 0.3);
          color: #86efac;
        }

        .difficulty-medium {
          background: rgba(245, 158, 11, 0.1);
          border-color: rgba(245, 158, 11, 0.3);
          color: #fbbf24;
        }

        .difficulty-hard {
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.3);
          color: #f87171;
        }

        /* Título */
        .problem-title-section {
          margin-bottom: 2rem;
        }

        .problem-title {
          font-size: clamp(1.8rem, 4vw, 2.5rem);
          font-weight: 700;
          color: #e0e7ff;
          line-height: 1.2;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #ffd700 0%, #ffed4e 25%, #fff8dc 50%, #f0f8ff 75%, #e6f3ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Contenido */
        .problem-content {
          margin-bottom: 2rem;
        }

        .problem-description {
          background: rgba(15, 15, 26, 0.4);
          border: 1px solid rgba(168, 85, 247, 0.2);
          border-radius: 0.75rem;
          padding: 1.5rem;
          backdrop-filter: blur(10px);
        }

        .section-title {
          color: #a855f7;
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .section-title::before {
          content: '📋';
          font-size: 1rem;
        }

        .description-text {
          color: rgba(224, 231, 255, 0.9);
          line-height: 1.7;
          font-size: 1rem;
          white-space: pre-wrap;
        }

        /* Metadatos */
        .problem-metadata {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: rgba(15, 15, 26, 0.3);
          border: 1px solid rgba(168, 85, 247, 0.15);
          border-radius: 0.75rem;
        }

        .metadata-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .metadata-label {
          font-size: 0.85rem;
          color: rgba(224, 231, 255, 0.6);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .metadata-value {
          color: #e0e7ff;
          font-weight: 600;
          font-size: 0.95rem;
        }

        /* Footer */
        .problem-footer {
          display: flex;
          justify-content: center;
          padding-top: 1rem;
          border-top: 1px solid rgba(168, 85, 247, 0.2);
        }

        /* Botón premium */
        .glass-button-premium {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.75rem 2rem;
          border-radius: 0.75rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(37, 99, 235, 0.9) 50%, rgba(29, 78, 216, 0.9) 100%);
          border: 1px solid rgba(255, 215, 0, 0.3);
          color: white;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
          box-shadow: 0 8px 24px rgba(59, 130, 246, 0.3);
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }

        .glass-button-premium::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transition: left 0.5s ease;
        }

        .glass-button-premium:hover {
          background: linear-gradient(135deg, rgba(124, 58, 237, 0.9) 0%, rgba(168, 85, 247, 0.9) 100%);
          box-shadow: 0 12px 30px rgba(124, 58, 237, 0.4);
          transform: translateY(-2px);
          border-color: rgba(255, 215, 0, 0.4);
        }

        .glass-button-premium:hover::before {
          left: 100%;
        }

        .back-button {
          margin-top: 1rem;
        }

        /* Animaciones */
        .fade-in {
          animation: fadeInUp 0.6s ease-out;
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

        /* Responsive */
        @media (max-width: 768px) {
          .problem-detail-container {
            padding: 1rem;
          }

          .problem-detail-card {
            padding: 1.5rem;
          }

          .problem-header {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .back-link {
            align-self: flex-start;
          }

          .difficulty-badge {
            align-self: flex-start;
          }

          .problem-metadata {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .metadata-item {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }

          .metadata-label {
            text-transform: none;
          }
        }

        @media (max-width: 480px) {
          .problem-detail-card {
            padding: 1rem;
          }

          .glass-button-premium {
            width: 100%;
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

        .glass-button-premium:focus-visible,
        .back-link:focus-visible {
          outline: 2px solid rgba(168, 85, 247, 0.8);
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}