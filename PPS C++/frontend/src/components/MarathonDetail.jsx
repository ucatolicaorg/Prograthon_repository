import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { marathons, problems } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function MarathonDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [marathon, setMarathon] = useState(null);
  const [assigned, setAssigned] = useState([]);
  const [allProblems, setAllProblems] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    async function fetch() {
      try {
        const rM = await marathons.getById(id);
        setMarathon(rM.data.marathon);
        setAssigned(rM.data.problems);

        const rP = await problems.getAll();
        setAllProblems(rP.data.problems);

        // Obtener estudiantes registrados
        const rS = await marathons.getStudents(id);
        setStudents(rS.data.students);
      } catch {
        setErr('Error cargando datos');
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [id]);

  const handleAdd = async pid => {
    try {
      await marathons.addProblem(id, pid);
      const r = await marathons.getById(id);
      setAssigned(r.data.problems);
      setMarathon(r.data.marathon);
    } catch (e) {
      alert(e.response?.data?.message);
    }
  };

  const handleRemoveProblem = async (pid) => {
    if (window.confirm('¿Estás seguro de eliminar este problema de la maratón?')) {
      try {
        await marathons.removeProblem(id, pid);
        const r = await marathons.getById(id);
        setAssigned(r.data.problems);
        setMarathon(r.data.marathon);
        alert('Problema eliminado de la maratón exitosamente');
      } catch (e) {
        alert(e.response?.data?.message || 'Error al eliminar problema');
      }
    }
  };

  const handleDeleteMarathon = async () => {
    if (window.confirm('¿Estás seguro de eliminar esta maratón?')) {
      try {
        await marathons.delete(id);
        alert('Maratón eliminada exitosamente');
        navigate('/marathons');
      } catch (e) {
        alert(e.response?.data?.message || 'Error al eliminar maratón');
      }
    }
  };

  const handleRemoveStudent = async (studentId) => {
    if (window.confirm('¿Estás seguro de eliminar este estudiante de la maratón?')) {
      try {
        await marathons.removeStudent(id, studentId);
        // Actualizar lista de estudiantes
        const rS = await marathons.getStudents(id);
        setStudents(rS.data.students);
        alert('Estudiante eliminado exitosamente');
      } catch (e) {
        alert(e.response?.data?.message || 'Error al eliminar estudiante');
      }
    }
  };

  if (loading) return (
    <div className="premium-background" style={styles.loadingContainer}>
      <div className="premium-loader"></div>
      <p style={styles.loadingText}>Cargando maratón...</p>
    </div>
  );
  
  if (err) return (
    <div className="premium-background" style={styles.errorContainer}>
      <div className="glass-card-premium glass-card-lg fade-in" style={styles.errorCard}>
        <div style={styles.errorIcon}>⚠️</div>
        <p style={styles.errorText}>{err}</p>
        <Link to="/marathons" className="glass-button-premium" style={styles.errorButton}>
          Volver a Maratones
        </Link>
      </div>
    </div>
  );
  
  if (!marathon) return (
    <div className="premium-background" style={styles.errorContainer}>
      <div className="glass-card-premium glass-card-lg fade-in" style={styles.errorCard}>
        <div style={styles.errorIcon}>🔍</div>
        <p style={styles.errorText}>Maratón no encontrada</p>
        <Link to="/marathons" className="glass-button-premium" style={styles.errorButton}>
          Volver a Maratones
        </Link>
      </div>
    </div>
  );

  const free = allProblems.filter(p => !assigned.some(a => a.id === p.id));
  const isAdminOrProfessor = user.role === 'admin' || user.role === 'professor';

  return (
    <div className="premium-background" style={styles.container}>
      <div style={styles.content}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <h1 style={styles.title}>{marathon.name}</h1>
            <div style={styles.metaContainer}>
              <div style={styles.metaItem}>
                <span style={styles.metaIcon}>👤</span>
                <span>Creado por {marathon.created_by}</span>
              </div>
              <div style={styles.metaItem}>
                <span style={styles.metaIcon}>📊</span>
                <span>{assigned.length} de {marathon.max_problems} problemas</span>
              </div>
            </div>
          </div>
          {isAdminOrProfessor && (
            <button onClick={handleDeleteMarathon} style={styles.deleteButton}>
              <span style={styles.deleteIcon}>🗑️</span>
              Eliminar
            </button>
          )}
        </div>

        {/* Description */}
        <div style={styles.descriptionCard}>
          <div style={styles.descriptionHeader}>
            <span style={styles.descriptionIcon}>📝</span>
            <span style={styles.descriptionTitle}>Descripción</span>
          </div>
          <p style={styles.description}>{marathon.description}</p>
        </div>

        {/* Problems Section */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionTitleContainer}>
              <span style={styles.sectionIcon}>🎯</span>
              <h2 style={styles.sectionTitle}>Problemas Asignados</h2>
            </div>
            <div style={styles.badge}>{assigned.length}</div>
          </div>
          
          <div style={styles.problemsGrid}>
            {assigned.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>📋</div>
                <p style={styles.emptyText}>No hay problemas asignados a esta maratón</p>
              </div>
            ) : (
              assigned.map(p => (
                <div key={p.id} style={styles.problemCard}>
                  <div style={styles.problemContent}>
                    <div style={styles.problemInfo}>
                      <Link to={`/problems/${p.id}`} style={styles.problemLink}>
                        <span style={styles.problemIcon}>🎯</span>
                        <span style={styles.problemTitle}>{p.title}</span>
                      </Link>
                      <div style={{
                        ...styles.difficultyBadge,
                        ...(p.difficulty === 'Easy' ? styles.difficultyEasy : 
                            p.difficulty === 'Medium' ? styles.difficultyMedium : 
                            styles.difficultyHard)
                      }}>
                        {p.difficulty}
                      </div>
                    </div>
                    {isAdminOrProfessor && (
                      <button 
                        onClick={() => handleRemoveProblem(p.id)}
                        style={styles.removeButton}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add Problems Section */}
        {isAdminOrProfessor && assigned.length < marathon.max_problems && (
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <div style={styles.sectionTitleContainer}>
                <span style={styles.sectionIcon}>➕</span>
                <h2 style={styles.sectionTitle}>Añadir Problemas</h2>
              </div>
              <div style={styles.badge}>{free.length}</div>
            </div>
            
            <div style={styles.problemsGrid}>
              {free.length === 0 ? (
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}>✅</div>
                  <p style={styles.emptyText}>No hay problemas disponibles para añadir</p>
                </div>
              ) : (
                free.map(p => (
                  <div key={p.id} style={styles.problemCard}>
                    <div style={styles.problemContent}>
                      <div style={styles.problemInfo}>
                        <div style={styles.problemTitleContainer}>
                          <span style={styles.problemIcon}>🎯</span>
                          <span style={styles.problemTitle}>{p.title}</span>
                        </div>
                        <div style={{
                          ...styles.difficultyBadge,
                          ...(p.difficulty === 'Easy' ? styles.difficultyEasy : 
                              p.difficulty === 'Medium' ? styles.difficultyMedium : 
                              styles.difficultyHard)
                        }}>
                          {p.difficulty}
                        </div>
                      </div>
                      <button 
                        onClick={() => handleAdd(p.id)}
                        style={styles.addButton}
                      >
                        ➕
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Students Section */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionTitleContainer}>
              <span style={styles.sectionIcon}>👥</span>
              <h2 style={styles.sectionTitle}>Estudiantes Registrados</h2>
            </div>
            <div style={styles.badge}>{students.length}</div>
          </div>
          
          <div style={styles.studentsGrid}>
            {students.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>👤</div>
                <p style={styles.emptyText}>No hay estudiantes registrados en esta maratón</p>
              </div>
            ) : (
              students.map(student => (
                <div key={student.id} style={styles.studentCard}>
                  <div style={styles.studentInfo}>
                    <div style={styles.studentAvatar}>
                      <span style={styles.avatarIcon}>👤</span>
                    </div>
                    <div style={styles.studentDetails}>
                      <div style={styles.studentName}>{student.username}</div>
                      <div style={styles.studentDate}>
                        <span style={styles.dateIcon}>📅</span>
                        {new Date(student.registered_at).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                  {isAdminOrProfessor && (
                    <button 
                      onClick={() => handleRemoveStudent(student.id)}
                      style={styles.removeButton}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Back Button */}
        <div style={styles.backContainer}>
          <Link to="/marathons" style={styles.backButton}>
            <span style={styles.backIcon}>←</span>
            Volver a Maratones
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  // Container y layout principal
  container: {
    minHeight: '100vh',
    padding: '20px',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 2,
  },

  // Estados de carga y error
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    gap: '20px',
  },
  loadingText: {
    color: '#e0e7ff',
    fontSize: '18px',
    fontWeight: '500',
  },
  errorContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '20px',
  },
  errorCard: {
    textAlign: 'center',
    maxWidth: '400px',
    width: '100%',
    padding: '40px',
    background: 'rgba(15, 15, 26, 0.8)',
    border: '1px solid rgba(168, 85, 247, 0.3)',
    borderRadius: '16px',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.3)',
  },
  errorIcon: {
    fontSize: '64px',
    marginBottom: '20px',
    display: 'block',
  },
  errorText: {
    color: '#f87171',
    fontSize: '18px',
    fontWeight: '500',
    marginBottom: '30px',
  },
  errorButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 24px',
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(37, 99, 235, 0.9) 100%)',
    border: '1px solid rgba(255, 215, 0, 0.3)',
    borderRadius: '12px',
    color: 'white',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },

  // Header principal
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '30px',
    padding: '30px',
    background: 'rgba(15, 15, 26, 0.8)',
    border: '1px solid rgba(168, 85, 247, 0.3)',
    borderRadius: '20px',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.3)',
    gap: '20px',
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 'clamp(2rem, 4vw, 3rem)',
    fontWeight: '900',
    background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 25%, #fff8dc 50%, #f0f8ff 75%, #e6f3ff 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    WebkitTextFillColor: 'transparent',
    marginBottom: '20px',
    lineHeight: '1.2',
  },
  metaContainer: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    background: 'rgba(59, 130, 246, 0.1)',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    borderRadius: '12px',
    color: '#93c5fd',
    fontSize: '14px',
    fontWeight: '600',
  },
  metaIcon: {
    fontSize: '16px',
  },
  deleteButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.8), rgba(248, 113, 113, 0.8))',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '12px',
    color: 'white',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 6px 20px rgba(239, 68, 68, 0.2)',
  },
  deleteIcon: {
    fontSize: '16px',
  },

  // Tarjeta de descripción
  descriptionCard: {
    marginBottom: '30px',
    padding: '25px',
    background: 'rgba(15, 15, 26, 0.8)',
    border: '1px solid rgba(168, 85, 247, 0.3)',
    borderRadius: '16px',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.3s ease',
  },
  descriptionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '15px',
  },
  descriptionIcon: {
    fontSize: '20px',
  },
  descriptionTitle: {
    color: '#e0e7ff',
    fontSize: '18px',
    fontWeight: '600',
  },
  description: {
    color: '#d1d5db',
    fontSize: '16px',
    lineHeight: '1.6',
    margin: 0,
  },

  // Secciones
  section: {
    marginBottom: '40px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
    padding: '20px',
    background: 'rgba(15, 15, 26, 0.6)',
    border: '1px solid rgba(168, 85, 247, 0.2)',
    borderRadius: '12px',
    backdropFilter: 'blur(12px)',
  },
  sectionTitleContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#e0e7ff',
    margin: 0,
  },
  sectionIcon: {
    fontSize: '24px',
  },
  badge: {
    padding: '8px 16px',
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(37, 99, 235, 0.9) 100%)',
    border: '1px solid rgba(255, 215, 0, 0.3)',
    borderRadius: '20px',
    color: 'white',
    fontSize: '14px',
    fontWeight: '600',
    boxShadow: '0 6px 20px rgba(59, 130, 246, 0.3)',
  },

  // Grid de problemas
  problemsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '20px',
  },
  problemCard: {
    padding: '20px',
    background: 'rgba(15, 15, 26, 0.8)',
    border: '1px solid rgba(168, 85, 247, 0.3)',
    borderRadius: '16px',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  problemContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '15px',
  },
  problemInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    flex: 1,
  },
  problemLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: '#e0e7ff',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'color 0.3s ease',
    flex: 1,
  },
  problemTitleContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: '#e0e7ff',
    fontWeight: '600',
    flex: 1,
  },
  problemIcon: {
    fontSize: '18px',
    opacity: 0.8,
  },
  problemTitle: {
    fontSize: '16px',
  },
  difficultyBadge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    border: '1px solid',
    minWidth: '65px',
    textAlign: 'center',
  },
  difficultyEasy: {
    background: 'rgba(34, 197, 94, 0.1)',
    color: '#86efac',
    borderColor: 'rgba(34, 197, 94, 0.2)',
  },
  difficultyMedium: {
    background: 'rgba(245, 158, 11, 0.1)',
    color: '#fbbf24',
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  difficultyHard: {
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#f87171',
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },

  // Botones
  addButton: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.8), rgba(74, 222, 128, 0.8))',
    border: '1px solid rgba(34, 197, 94, 0.3)',
    color: 'white',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 6px 20px rgba(34, 197, 94, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButton: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.8), rgba(248, 113, 113, 0.8))',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: 'white',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 6px 20px rgba(239, 68, 68, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Grid de estudiantes
  studentsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '20px',
  },
  studentCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '15px',
    padding: '20px',
    background: 'rgba(15, 15, 26, 0.8)',
    border: '1px solid rgba(168, 85, 247, 0.3)',
    borderRadius: '16px',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.3s ease',
  },
  studentInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    flex: 1,
  },
  studentAvatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(37, 99, 235, 0.9) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxShadow: '0 6px 20px rgba(59, 130, 246, 0.3)',
  },
  avatarIcon: {
    fontSize: '20px',
    color: 'white',
  },
  studentDetails: {
    flex: 1,
  },
  studentName: {
    color: '#e0e7ff',
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '5px',
  },
  studentDate: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: '#9ca3af',
    fontSize: '13px',
    fontWeight: '500',
  },
  dateIcon: {
    fontSize: '14px',
  },

  // Estados vacíos
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    textAlign: 'center',
    gridColumn: '1 / -1',
    background: 'rgba(15, 15, 26, 0.4)',
    border: '2px dashed rgba(168, 85, 247, 0.3)',
    borderRadius: '16px',
    backdropFilter: 'blur(8px)',
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '15px',
    opacity: 0.7,
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: '16px',
    fontWeight: '500',
    margin: 0,
  },

  // Botón de regreso
  backContainer: {
    marginTop: '40px',
    textAlign: 'center',
  },
  backButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    padding: '15px 30px',
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(37, 99, 235, 0.9) 100%)',
    border: '1px solid rgba(255, 215, 0, 0.3)',
    borderRadius: '12px',
    color: 'white',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
    cursor: 'pointer',
  },
  backIcon: {
    fontSize: '18px',
  },

  // Responsive
  '@media (max-width: 768px)': {
    container: {
      padding: '15px',
    },
    header: {
      flexDirection: 'column',
      alignItems: 'stretch',
    },
    problemsGrid: {
      gridTemplateColumns: '1fr',
    },
    studentsGrid: {
      gridTemplateColumns: '1fr',
    },
  },
};