import React, { useState, useEffect } from 'react';
import { problems } from '../services/api';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProblemList = () => {
  const { user } = useAuth();
  const [problemList, setProblemList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await problems.getAll();
        setProblemList(response.data.problems);
      } catch (error) {
        setError('Error al cargar problemas');
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const handleDeleteProblem = async (problemId) => {
    if (window.confirm('¿Estás seguro de eliminar este problema?')) {
      try {
        await problems.delete(problemId);
        // Actualizar lista de problemas
        setProblemList(problemList.filter(p => p.id !== problemId));
        alert('Problema eliminado exitosamente');
      } catch (e) {
        alert(e.response?.data?.message || 'Error al eliminar problema');
      }
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '#22c55e';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getDifficultyBg = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'rgba(34, 197, 94, 0.1)';
      case 'medium': return 'rgba(245, 158, 11, 0.1)';
      case 'hard': return 'rgba(239, 68, 68, 0.1)';
      default: return 'rgba(107, 114, 128, 0.1)';
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 2
      }}>
        <div style={{
          background: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
          borderRadius: '16px',
          padding: '2rem',
          backdropFilter: 'blur(15px)',
          boxShadow: 'var(--shadow-glass)',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div className="premium-loader"></div>
          <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>Cargando problemas...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 2
      }}>
        <div style={{
          background: 'var(--error-bg)',
          border: '1px solid var(--error-border)',
          borderRadius: '16px',
          padding: '2rem',
          backdropFilter: 'blur(15px)',
          boxShadow: 'var(--shadow-glass)',
          textAlign: 'center',
          color: 'var(--error-text)'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️</div>
          <div style={{ fontSize: '1.1rem', fontWeight: '500' }}>{error}</div>
        </div>
      </div>
    );
  }

  const isAdminOrProfessor = user.role === 'admin' || user.role === 'professor';

  return (
    <div style={{
      minHeight: '100vh',
      padding: '2rem',
      position: 'relative',
      zIndex: 2
    }}>
      {/* Header */}
      <div style={{
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        <h2 className="premium-title" style={{
          fontSize: 'clamp(2rem, 4vw, 2.5rem)',
          marginBottom: '1rem'
        }}>
          Problemas Disponibles
        </h2>
        
        <Link to="/dashboard" style={{
          textDecoration: 'none',
          display: 'inline-block',
          marginBottom: '2rem'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            borderRadius: '12px',
            background: 'rgba(15, 15, 26, 0.7)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            backdropFilter: 'blur(12px)',
            color: '#e0e7ff',
            fontSize: '1rem',
            fontWeight: '500',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(59, 130, 246, 0.4)';
            e.target.style.borderColor = 'rgba(168, 85, 247, 0.5)';
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(15, 15, 26, 0.7)';
            e.target.style.borderColor = 'rgba(168, 85, 247, 0.3)';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}>
            <span style={{ fontSize: '1.2rem' }}>←</span>
            Volver al Dashboard
          </div>
        </Link>
      </div>

      {/* Contenido Principal */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {problemList.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem'
          }}>
            <div style={{
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: '20px',
              padding: '3rem',
              backdropFilter: 'blur(15px)',
              boxShadow: 'var(--shadow-glass)',
              display: 'inline-block'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📝</div>
              <h3 style={{
                fontSize: '1.5rem',
                marginBottom: '1rem',
                color: '#e0e7ff'
              }}>
                No hay problemas disponibles
              </h3>
              <p style={{
                color: 'rgba(160, 174, 208, 0.9)',
                fontSize: '1.1rem'
              }}>
                Parece que aún no se han creado problemas para resolver.
              </p>
            </div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '1.5rem',
            padding: '0 0.5rem'
          }}>
            {problemList.map((problem) => (
              <div key={problem.id} style={{
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                borderRadius: '20px',
                padding: '1.5rem',
                backdropFilter: 'blur(15px)',
                boxShadow: 'var(--shadow-glass)',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
                e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-glass)';
                e.currentTarget.style.borderColor = 'var(--glass-border)';
              }}>
                
                {/* Header del problema */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '1rem'
                }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '1.25rem',
                      fontWeight: '700',
                      color: '#fff',
                      marginBottom: '0.5rem',
                      lineHeight: '1.3'
                    }}>
                      {problem.title}
                    </h3>
                    
                    {/* Badge de dificultad */}
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      background: getDifficultyBg(problem.difficulty),
                      color: getDifficultyColor(problem.difficulty),
                      border: `1px solid ${getDifficultyColor(problem.difficulty)}33`
                    }}>
                      {problem.difficulty}
                    </div>
                  </div>
                  
                  {isAdminOrProfessor && (
                    <button 
                      onClick={() => handleDeleteProblem(problem.id)}
                      style={{
                        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.8), rgba(248, 113, 113, 0.8))',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '8px',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.05)';
                        e.target.style.boxShadow = '0 6px 20px rgba(239, 68, 68, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.2)';
                      }}
                    >
                      🗑️ Eliminar
                    </button>
                  )}
                </div>

                {/* Descripción */}
                <div style={{
                  marginBottom: '1.5rem'
                }}>
                  <p style={{
                    color: 'rgba(160, 174, 208, 0.9)',
                    fontSize: '1rem',
                    lineHeight: '1.6',
                    marginBottom: '1rem'
                  }}>
                    {problem.description}
                  </p>
                </div>

                {/* Metadatos */}
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  marginBottom: '1.5rem',
                  fontSize: '0.875rem',
                  color: 'rgba(160, 174, 208, 0.8)'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{ fontSize: '1rem' }}>👤</span>
                    <span>
                      <strong>Creado por:</strong> {problem.created_by}
                    </span>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{ fontSize: '1rem' }}>📅</span>
                    <span>
                      <strong>Fecha:</strong> {new Date(problem.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Botón de ver detalles */}
                <Link to={`/problems/${problem.id}`} style={{
                  textDecoration: 'none',
                  display: 'block'
                }}>
                  <button style={{
                    width: '100%',
                    background: 'var(--gradient-button)',
                    border: '1px solid rgba(255, 215, 0, 0.2)',
                    borderRadius: '12px',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
                    textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, rgba(124, 58, 237, 0.9) 0%, rgba(168, 85, 247, 0.9) 100%)';
                    e.target.style.boxShadow = '0 6px 20px rgba(124, 58, 237, 0.4)';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.borderColor = 'rgba(255, 215, 0, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'var(--gradient-button)';
                    e.target.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.3)';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.borderColor = 'rgba(255, 215, 0, 0.2)';
                  }}>
                    <span style={{ fontSize: '1.1rem' }}>👁️</span>
                    Ver Detalles
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemList;