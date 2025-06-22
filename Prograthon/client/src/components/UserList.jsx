import React, { useEffect, useState } from "react";
import { users, logout as apiLogout } from "../api";

export default function UserList({ onEditUser }) {
  const [me, setMe] = useState(null);
  const [list, setList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  useEffect(() => {
    (async () => {
      try {
        const perfil = await users.me();
        setMe(perfil);

        if (perfil.role === "estudiante") {
          return;
        }

        const all = await users.list();
        if (perfil.role === "admin") {
          setList(all);
        } else {
          setList(all.filter((u) => u.role === "estudiante"));
        }
      } catch {
        setMe(null);
        setList([]);
      }
    })();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este usuario?")) return;
    try {
      await users.delete(id);
      setList((l) => l.filter((u) => u._id !== id));
    } catch (e) {
      alert("Error al eliminar: " + e.message);
    }
  };

  const handleLogout = async () => {
    await apiLogout();
    window.location.reload();
  };

  // Filtrar usuarios
  const filteredUsers = list.filter(user => {
    const matchesSearch = 
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === "all" || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  // Estados de error y acceso denegado
  if (!me) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card-premium p-12 text-center ambient-glow max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">Sesión Expirada</h3>
          <p className="text-white/70 mb-6">No autenticado. Vuelve a iniciar sesión.</p>
          <button 
            onClick={() => window.location.reload()}
            className="glass-button-premium px-6 py-3"
          >
            Recargar Página
          </button>
        </div>
      </div>
    );
  }

  if (me.role === "estudiante") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card-premium p-12 text-center ambient-glow max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">Acceso Restringido</h3>
          <p className="text-white/70 mb-6">Solo administradores y profesores pueden ver la lista de usuarios.</p>
          <div className="flex gap-3 justify-center">
            <button 
              onClick={() => window.history.back()}
              className="glass-button px-4 py-2"
            >
              Volver
            </button>
            <button 
              onClick={handleLogout}
              className="glass-button-premium px-4 py-2"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen premium-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
        {/* Header con información del usuario */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 fade-in">
          <div>
            <h1 className="premium-title text-4xl mb-2">Panel de Usuarios</h1>
            <p className="premium-subtitle text-lg">
              Gestiona los usuarios del sistema • 
              <span className="ml-2 status-badge">
                {me.role === "admin" ? "👑 Administrador" : "👨‍🏫 Profesor"}
              </span>
            </p>
          </div>
          
          <div className="flex gap-4 mt-4 lg:mt-0">
            <div className="glass-card p-3 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-sm font-bold text-white">
                  {me.nombre.charAt(0)}{me.apellido.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{me.nombre}</div>
                  <div className="text-xs text-white/60">{me.email}</div>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="glass-button-premium px-6 py-3 flex items-center gap-2 group"
            >
              <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Filtros y búsqueda */}
        <div className="glass-card-premium p-6 mb-8 fade-in">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Buscador */}
            <div className="w-full lg:w-1/2 relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Buscar por nombre, apellido o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="glass-input-premium pl-12 w-full"
              />
            </div>

            {/* Filtro por rol */}
            <div className="flex items-center gap-4">
              <span className="text-white/80 font-medium">Filtrar por rol:</span>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="glass-input-premium px-4 py-2 rounded-lg"
              >
                <option value="all">Todos</option>
                <option value="estudiante">Estudiantes</option>
                {me.role === "admin" && <option value="profesor">Profesores</option>}
                {me.role === "admin" && <option value="admin">Administradores</option>}
              </select>
            </div>

            {/* Contador de usuarios */}
            <div className="status-badge flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {filteredUsers.length} usuario{filteredUsers.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Lista de usuarios - Cards en lugar de tabla */}
        {filteredUsers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 fade-in">
            {filteredUsers.map((u, index) => (
              <div 
                key={u._id} 
                className="glass-card-premium p-6 hover:scale-105 transition-all duration-300 group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Header de la tarjeta */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-lg font-bold text-white">
                      {u.nombre.charAt(0)}{u.apellido.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">
                        {u.nombre} {u.apellido}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className={`status-badge text-xs ${
                          u.role === 'admin' ? 'bg-red-500/20 border-red-500/30 text-red-300' :
                          u.role === 'profesor' ? 'bg-blue-500/20 border-blue-500/30 text-blue-300' :
                          'bg-green-500/20 border-green-500/30 text-green-300'
                        }`}>
                          {u.role === 'admin' && '👑'}
                          {u.role === 'profesor' && '👨‍🏫'}
                          {u.role === 'estudiante' && '🎓'}
                          {u.role}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Información del usuario */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-white/80">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                    <span className="text-sm">{u.email}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-white/80">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm">{u.edad} años</span>
                  </div>
                </div>

                {/* Acciones (solo para admin) */}
                {me.role === "admin" && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => onEditUser(u)}
                      className="flex-1 glass-button py-2 px-4 text-sm font-semibold flex items-center justify-center gap-2 group/btn"
                    >
                      <svg className="w-4 h-4 group-hover/btn:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Editar
                    </button>
                    
                    <button
                      onClick={() => handleDelete(u._id)}
                      className="px-4 py-2 bg-gradient-to-r from-red-500/80 to-pink-600/80 hover:from-red-500 hover:to-pink-600 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center group/btn border border-red-500/30 hover:border-red-400/50"
                    >
                      <svg className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Estado vacío mejorado */
          <div className="glass-card-premium p-12 text-center ambient-glow fade-in">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-500/50 to-gray-600/50 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              {searchTerm || filterRole !== "all" ? "No se encontraron usuarios" : "No hay usuarios para mostrar"}
            </h3>
            <p className="text-white/70 mb-6">
              {searchTerm || filterRole !== "all" 
                ? "Intenta cambiar los filtros de búsqueda" 
                : "Aún no se han registrado usuarios en el sistema"
              }
            </p>
            {(searchTerm || filterRole !== "all") && (
              <div className="flex gap-3 justify-center">
                <button 
                  onClick={() => setSearchTerm("")}
                  className="glass-button px-4 py-2"
                >
                  Limpiar búsqueda
                </button>
                <button 
                  onClick={() => setFilterRole("all")}
                  className="glass-button-premium px-4 py-2"
                >
                  Mostrar todos
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}