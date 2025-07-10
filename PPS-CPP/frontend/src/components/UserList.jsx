import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { users } from '../services/api';

const UserList = () => {
  const { user } = useAuth();
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    role: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await users.getAll();
      setUserList(response.data.users);
    } catch (err) {
      setError('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (userToEdit) => {
    setEditingUser(userToEdit);
    setEditForm({
      username: userToEdit.username,
      password: '',
      confirmPassword: '',
      role: userToEdit.role
    });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (editForm.password !== editForm.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    if (!editForm.password.trim()) {
      alert('La contraseña es obligatoria');
      return;
    }

    try {
      await users.updateUser(editingUser.id, {
        username: editForm.username,
        password: editForm.password,
        role: editForm.role
      });
      alert('Usuario actualizado exitosamente');
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al actualizar usuario');
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (!window.confirm(`¿Estás seguro de eliminar al usuario ${username}?`)) {
      return;
    }

    try {
      await users.deleteUser(userId);
      alert('Usuario eliminado exitosamente');
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al eliminar usuario');
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.loader}></div>
          <p style={styles.loadingText}>Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <div style={styles.errorIcon}>⚠️</div>
          <p style={styles.errorText}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Gestión de Usuarios</h1>
        <Link to="/dashboard" style={styles.backButton}>
          <span style={styles.backArrow}>←</span>
          Volver al Dashboard
        </Link>
      </div>

      {/* Edit Form Modal */}
      {editingUser && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Editar Usuario</h3>
              <div style={styles.userBadge}>
                <span style={styles.userIcon}>👤</span>
                {editingUser.username}
              </div>
            </div>
            
            <form onSubmit={handleUpdateUser} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Usuario:</label>
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                  required
                  style={styles.input}
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Nueva Contraseña:</label>
                <input
                  type="password"
                  value={editForm.password}
                  onChange={(e) => setEditForm({...editForm, password: e.target.value})}
                  required
                  style={styles.input}
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Confirmar Contraseña:</label>
                <input
                  type="password"
                  value={editForm.confirmPassword}
                  onChange={(e) => setEditForm({...editForm, confirmPassword: e.target.value})}
                  required
                  style={styles.input}
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Rol:</label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                  required
                  style={styles.select}
                >
                  <option value="student">Student</option>
                  <option value="professor">Professor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div style={styles.buttonGroup}>
                <button type="submit" style={styles.updateButton}>
                  Actualizar Usuario
                </button>
                <button type="button" onClick={() => setEditingUser(null)} style={styles.cancelButton}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div style={styles.tableContainer}>
        <div style={styles.tableHeader}>
          <h2 style={styles.tableTitle}>Lista de Usuarios</h2>
          <div style={styles.userCount}>
            {userList.length} usuario{userList.length !== 1 ? 's' : ''}
          </div>
        </div>

        {userList.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>👥</div>
            <p style={styles.emptyText}>No hay usuarios disponibles</p>
          </div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeaderRow}>
                  {user?.role === 'admin' && <th style={styles.th}>ID</th>}
                  <th style={styles.th}>Usuario</th>
                  <th style={styles.th}>Rol</th>
                  {user?.role === 'admin' && <th style={styles.th}>Creado</th>}
                  {user?.role === 'admin' && <th style={styles.th}>Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {userList.map((u, index) => (
                  <tr key={u.id || index} style={styles.tableRow}>
                    {user?.role === 'admin' && (
                      <td style={styles.td}>
                        <span style={styles.idBadge}>{u.id}</span>
                      </td>
                    )}
                    <td style={styles.td}>
                      <div style={styles.userCell}>
                        <span style={styles.userIcon}>👤</span>
                        {u.username}
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.roleBadge,
                        ...(u.role === 'admin' ? styles.roleAdmin : 
                            u.role === 'professor' ? styles.roleProfessor : 
                            styles.roleStudent)
                      }}>
                        {u.role}
                      </span>
                    </td>
                    {user?.role === 'admin' && (
                      <td style={styles.td}>
                        <span style={styles.dateText}>
                          {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}
                        </span>
                      </td>
                    )}
                    {user?.role === 'admin' && (
                      <td style={styles.td}>
                        <div style={styles.actionButtons}>
                          <button onClick={() => handleEdit(u)} style={styles.editButton}>
                            ✏️ Editar
                          </button>
                          <button onClick={() => handleDeleteUser(u.id, u.username)} style={styles.deleteButton}>
                            🗑️ Eliminar
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    padding: '2rem',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: '#e0e7ff',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  
  title: {
    fontSize: 'clamp(2rem, 4vw, 2.5rem)',
    fontWeight: '900',
    background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 25%, #fff8dc 50%, #f0f8ff 75%, #e6f3ff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    margin: 0,
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
  },
  
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    background: 'rgba(15, 15, 26, 0.8)',
    border: '1px solid rgba(168, 85, 247, 0.3)',
    borderRadius: '12px',
    color: '#e0e7ff',
    textDecoration: 'none',
    fontWeight: '600',
    backdropFilter: 'blur(12px)',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
  },
  
  backArrow: {
    fontSize: '1.2rem',
    transition: 'transform 0.3s ease'
  },
  
  // Loading states
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    gap: '1rem'
  },
  
  loader: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(168, 85, 247, 0.3)',
    borderTop: '3px solid #a855f7',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  
  loadingText: {
    fontSize: '1.1rem',
    color: 'rgba(224, 231, 255, 0.8)',
    fontWeight: '500'
  },
  
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    gap: '1rem'
  },
  
  errorIcon: {
    fontSize: '3rem'
  },
  
  errorText: {
    fontSize: '1.2rem',
    color: '#f87171',
    textAlign: 'center',
    fontWeight: '600'
  },
  
  // Modal styles
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(4px)'
  },
  
  modal: {
    background: 'rgba(15, 15, 26, 0.95)',
    border: '1px solid rgba(168, 85, 247, 0.3)',
    borderRadius: '16px',
    padding: '2rem',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '80vh',
    overflow: 'auto',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
  },
  
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  
  modalTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#ffd700',
    margin: 0
  },
  
  userBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    background: 'rgba(59, 130, 246, 0.2)',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600'
  },
  
  userIcon: {
    fontSize: '1rem'
  },
  
  // Form styles
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  
  label: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#a855f7'
  },
  
  input: {
    padding: '0.75rem 1rem',
    background: 'rgba(15, 15, 26, 0.8)',
    border: '1px solid rgba(168, 85, 247, 0.3)',
    borderRadius: '8px',
    color: '#e0e7ff',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(8px)'
  },
  
  select: {
    padding: '0.75rem 1rem',
    background: 'rgba(15, 15, 26, 0.8)',
    border: '1px solid rgba(168, 85, 247, 0.3)',
    borderRadius: '8px',
    color: '#e0e7ff',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(8px)',
    cursor: 'pointer'
  },
  
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem'
  },
  
  updateButton: {
    flex: 1,
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.9), rgba(74, 222, 128, 0.9))',
    border: '1px solid rgba(34, 197, 94, 0.3)',
    borderRadius: '8px',
    color: 'white',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(34, 197, 94, 0.2)'
  },
  
  cancelButton: {
    flex: 1,
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, rgba(71, 85, 105, 0.8), rgba(100, 116, 139, 0.8))',
    border: '1px solid rgba(148, 163, 184, 0.3)',
    borderRadius: '8px',
    color: 'white',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(71, 85, 105, 0.2)'
  },
  
  // Table styles
  tableContainer: {
    background: 'rgba(15, 15, 26, 0.8)',
    border: '1px solid rgba(168, 85, 247, 0.3)',
    borderRadius: '16px',
    padding: '1.5rem',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.3)'
  },
  
  tableHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  
  tableTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#ffd700',
    margin: 0
  },
  
  userCount: {
    padding: '0.5rem 1rem',
    background: 'rgba(59, 130, 246, 0.2)',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#93c5fd'
  },
  
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 2rem',
    gap: '1rem'
  },
  
  emptyIcon: {
    fontSize: '4rem',
    opacity: 0.5
  },
  
  emptyText: {
    fontSize: '1.2rem',
    color: 'rgba(224, 231, 255, 0.6)',
    textAlign: 'center'
  },
  
  tableWrapper: {
    overflowX: 'auto',
    borderRadius: '12px',
    border: '1px solid rgba(168, 85, 247, 0.2)'
  },
  
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.95rem'
  },
  
  tableHeaderRow: {
    background: 'rgba(45, 27, 105, 0.8)',
    backdropFilter: 'blur(10px)'
  },
  
  th: {
    padding: '1rem',
    textAlign: 'left',
    fontWeight: '700',
    color: '#ffd700',
    borderBottom: '2px solid rgba(168, 85, 247, 0.3)',
    whiteSpace: 'nowrap'
  },
  
  tableRow: {
    background: 'rgba(15, 15, 26, 0.6)',
    transition: 'all 0.3s ease',
    borderBottom: '1px solid rgba(168, 85, 247, 0.1)'
  },
  
  td: {
    padding: '1rem',
    borderBottom: '1px solid rgba(168, 85, 247, 0.1)',
    verticalAlign: 'middle'
  },
  
  userCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontWeight: '600'
  },
  
  idBadge: {
    padding: '0.25rem 0.5rem',
    background: 'rgba(71, 85, 105, 0.3)',
    borderRadius: '6px',
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#94a3b8'
  },
  
  roleBadge: {
    padding: '0.4rem 0.8rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  
  roleAdmin: {
    background: 'rgba(239, 68, 68, 0.2)',
    color: '#fca5a5',
    border: '1px solid rgba(239, 68, 68, 0.3)'
  },
  
  roleProfessor: {
    background: 'rgba(245, 158, 11, 0.2)',
    color: '#fbbf24',
    border: '1px solid rgba(245, 158, 11, 0.3)'
  },
  
  roleStudent: {
    background: 'rgba(34, 197, 94, 0.2)',
    color: '#86efac',
    border: '1px solid rgba(34, 197, 94, 0.3)'
  },
  
  dateText: {
    color: 'rgba(224, 231, 255, 0.8)',
    fontSize: '0.9rem'
  },
  
  actionButtons: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap'
  },
  
  editButton: {
    padding: '0.5rem 1rem',
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(37, 99, 235, 0.8))',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    borderRadius: '6px',
    color: 'white',
    fontSize: '0.8rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
    whiteSpace: 'nowrap'
  },
  
  deleteButton: {
    padding: '0.5rem 1rem',
    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.8), rgba(248, 113, 113, 0.8))',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '6px',
    color: 'white',
    fontSize: '0.8rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
    whiteSpace: 'nowrap'
  }
};

// Add hover effects through CSS-in-JS
const addHoverEffects = () => {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .user-list-back-button:hover {
      background: rgba(59, 130, 246, 0.4) !important;
      border-color: rgba(168, 85, 247, 0.5) !important;
      transform: translateY(-2px) !important;
      box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3) !important;
    }
    
    .user-list-back-button:hover .back-arrow {
      transform: translateX(-3px) !important;
    }
    
    .user-list-input:focus {
      outline: none !important;
      background: rgba(15, 15, 26, 0.9) !important;
      border-color: rgba(255, 215, 0, 0.5) !important;
      box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.2), 0 6px 20px rgba(59, 130, 246, 0.3) !important;
      transform: translateY(-1px) !important;
    }
    
    .user-list-select:focus {
      outline: none !important;
      background: rgba(15, 15, 26, 0.9) !important;
      border-color: rgba(255, 215, 0, 0.5) !important;
      box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.2), 0 6px 20px rgba(59, 130, 246, 0.3) !important;
      transform: translateY(-1px) !important;
    }
    
    .user-list-update-button:hover {
      background: linear-gradient(135deg, rgba(34, 197, 94, 1), rgba(74, 222, 128, 1)) !important;
      transform: translateY(-2px) !important;
      box-shadow: 0 8px 20px rgba(34, 197, 94, 0.3) !important;
    }
    
    .user-list-cancel-button:hover {
      background: linear-gradient(135deg, rgba(71, 85, 105, 1), rgba(100, 116, 139, 1)) !important;
      transform: translateY(-2px) !important;
      box-shadow: 0 8px 20px rgba(71, 85, 105, 0.3) !important;
    }
    
    .user-list-table-row:hover {
      background: rgba(45, 27, 105, 0.4) !important;
      transform: translateY(-1px) !important;
    }
    
    .user-list-edit-button:hover {
      background: linear-gradient(135deg, rgba(59, 130, 246, 1), rgba(37, 99, 235, 1)) !important;
      transform: translateY(-2px) !important;
      box-shadow: 0 6px 15px rgba(59, 130, 246, 0.3) !important;
    }
    
    .user-list-delete-button:hover {
      background: linear-gradient(135deg, rgba(239, 68, 68, 1), rgba(248, 113, 113, 1)) !important;
      transform: translateY(-2px) !important;
      box-shadow: 0 6px 15px rgba(239, 68, 68, 0.3) !important;
    }
    
    @media (max-width: 768px) {
      .user-list-modal {
        width: 95% !important;
        margin: 1rem !important;
      }
      
      .user-list-button-group {
        flex-direction: column !important;
      }
      
      .user-list-action-buttons {
        flex-direction: column !important;
        align-items: stretch !important;
      }
      
      .user-list-header {
        flex-direction: column !important;
        align-items: stretch !important;
      }
      
      .user-list-table-header {
        flex-direction: column !important;
        align-items: stretch !important;
      }
    }
  `;
  
  if (!document.head.querySelector('#user-list-styles')) {
    styleSheet.id = 'user-list-styles';
    document.head.appendChild(styleSheet);
  }
};

// Apply hover effects when component mounts
setTimeout(addHoverEffects, 0);

export default UserList;