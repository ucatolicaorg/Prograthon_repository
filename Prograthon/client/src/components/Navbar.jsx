import React, { useState } from "react";
import { logout } from "../api";

const Navbar = ({
  user,
  currentView,
  onViewChange,
  onLogout,
  onOpenMaratones,
  onOpenProblemas,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      onLogout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getInitials = (nombre, apellido) =>
    `${nombre?.charAt(0) || ""}${apellido?.charAt(0) || ""}`.toUpperCase();

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "from-red-500 to-red-600";
      case "profesor":
        return "from-yellow-500 to-yellow-600";
      case "estudiante":
        return "from-green-500 to-green-600";
      default:
        return "from-purple-500 to-purple-600";
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return { text: "ADMIN", color: "from-red-400 to-red-500" };
      case "profesor":
        return { text: "PROFESOR", color: "from-yellow-400 to-yellow-500" };
      case "estudiante":
        return { text: "ESTUDIANTE", color: "from-green-400 to-green-500" };
      default:
        return { text: "USER", color: "from-purple-400 to-purple-500" };
    }
  };

  const canViewUsers = user?.role === "admin" || user?.role === "profesor";
  const canViewMaratones = true; // todos ven el botón “Maratones”
  const canViewProblemas = user?.role === "admin" || user?.role === "profesor";

  const roleBadge = getRoleBadge(user?.role);

  return (
    <nav className="glass-card-premium relative z-50 mx-4 mt-4 rounded-2xl shadow-2xl">
      {/* Efectos de fondo animados */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-indigo-900/20 to-purple-900/20 rounded-2xl opacity-50"></div>
      <div className="absolute inset-0 backdrop-blur-xl rounded-2xl"></div>

      <div className="relative flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        {/* IZQUIERDA: Logo + Título */}
        <div className="flex items-center space-x-4">
          {/* Logo con efectos premium */}
          <div className="relative group">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
              <span className="text-white font-black text-2xl drop-shadow-lg">M</span>
              {/* Efecto de brillo */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
            {/* Resplandor */}
            <div className="absolute -inset-2 bg-gradient-to-r from-purple-400/20 to-indigo-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {/* Título con gradiente */}
          <div>
            <h1 className="text-xl md:text-2xl font-black bg-gradient-to-r from-white via-purple-100 to-indigo-100 bg-clip-text text-transparent leading-tight">
              Plataforma de
            </h1>
            <h1 className="text-xl md:text-2xl font-black bg-gradient-to-r from-purple-300 via-indigo-300 to-purple-200 bg-clip-text text-transparent leading-tight -mt-1">
              Competencias
            </h1>
          </div>
        </div>

        {/* CENTRO: Enlaces de navegación */}
        <div className="hidden lg:flex items-center space-x-2">
          {/* Mi Perfil */}
          <button
            onClick={() => onViewChange("profile")}
            className={`nav-link-premium group ${currentView === "profile" ? "active" : ""}`}
          >
            <svg
              className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Mi Perfil
          </button>

          {/* Usuarios (solo admin/profesor) */}
          {canViewUsers && (
            <button
              onClick={() => onViewChange("users")}
              className={`nav-link-premium group ${currentView === "users" ? "active" : ""}`}
            >
              <svg
                className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
            </svg>
            Usuarios
            </button>
          )}

          {/* Maratones (todos los roles) */}
          {canViewMaratones && (
            <button
              onClick={() => onOpenMaratones()}
              className={`nav-link-premium group ${currentView === "maratones-menu" || currentView === "student-maratones-menu" ? "active" : ""}`}
            >
              <svg
                className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Maratones
            </button>
          )}

          {/* Problemas (solo profesor/admin) */}
          {canViewProblemas && (
            <button
              onClick={() => onOpenProblemas()}
              className={`nav-link-premium group ${currentView === "problemas-menu" ? "active" : ""}`}
            >
              <svg
                className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Problemas
            </button>
          )}
        </div>

        {/* DERECHA: Usuario + Logout */}
        <div className="hidden lg:flex items-center space-x-4">
          {/* Info del usuario */}
          <div className="text-right">
            <div className="text-base font-bold text-white">
              {user.nombre} {user.apellido}
            </div>
            <div className="text-sm text-purple-200">{user.email}</div>
            {/* Badge rol */}
            <div
              className={`inline-block px-2 py-1 text-xs font-bold text-white rounded-full bg-gradient-to-r ${roleBadge.color} mt-1`}
            >
              {roleBadge.text}
            </div>
          </div>

          {/* Avatar */}
          <div className="relative group">
            <div
              className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${getRoleColor(
                user.role
              )} flex items-center justify-center text-white font-bold text-lg shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
            >
              {getInitials(user.nombre, user.apellido)}
              <div className="absolute inset-0 rounded-2xl border-2 border-white/20 group-hover:border-white/40 transition-colors duration-300"></div>
            </div>
            <div
              className={`absolute -inset-2 bg-gradient-to-r ${getRoleColor(
                user.role
              )} rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300`}
            ></div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="glass-button-premium group px-6 py-3 text-base font-bold transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingOut ? (
              <div className="flex items-center gap-2">
                <div className="premium-loader w-5 h-5"></div>
                <span>Saliendo...</span>
              </div>
            ) : (
              <span className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Salir
              </span>
            )}
          </button>
        </div>

        {/* Menú Móvil */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="glass-button-premium p-3 text-2xl transition-all duration-300 hover:scale-110"
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-6">
              <span
                className={`absolute top-0 left-0 w-6 h-0.5 bg-white transition-all duration-300 ${
                  isMenuOpen ? "rotate-45 top-2.5" : ""
                }`}
              ></span>
              <span
                className={`absolute top-2.5 left-0 w-6 h-0.5 bg-white transition-all duration-300 ${
                  isMenuOpen ? "opacity-0" : ""
                }`}
              ></span>
              <span
                className={`absolute top-5 left-0 w-6 h-0.5 bg-white transition-all duration-300 ${
                  isMenuOpen ? "-rotate-45 top-2.5" : ""
                }`}
              ></span>
            </div>
          </button>
        </div>
      </div>

      {/* MENÚ MÓVIL */}
      <div className={`lg:hidden overflow-hidden transition-all duration-500 ${isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="glass-card bg-gradient-to-br from-purple-900/40 to-indigo-900/40 mx-4 mb-4 rounded-xl p-4 space-y-3 backdrop-blur-xl">
          <button
            onClick={() => {
              onViewChange("profile");
              setIsMenuOpen(false);
            }}
            className={`nav-link-premium w-full text-left group ${currentView === "profile" ? "active" : ""}`}
          >
            <svg
              className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Mi Perfil
          </button>

          {canViewUsers && (
            <button
              onClick={() => {
                onViewChange("users");
                setIsMenuOpen(false);
              }}
              className={`nav-link-premium w-full text-left group ${currentView === "users" ? "active" : ""}`}
            >
              <svg
                className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
              Usuarios
            </button>
          )}

          {canViewMaratones && (
            <button
              onClick={() => {
                onOpenMaratones();
                setIsMenuOpen(false);
              }}
              className={`nav-link-premium w-full text-left group ${
                currentView === "maratones-menu" || currentView === "student-maratones-menu" ? "active" : ""
              }`}
            >
              <svg
                className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Maratones
            </button>
          )}

          {canViewProblemas && (
            <button
              onClick={() => {
                onOpenProblemas();
                setIsMenuOpen(false);
              }}
              className={`nav-link-premium w-full text-left group ${currentView === "problemas-menu" ? "active" : ""}`}
            >
              <svg
                className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Problemas
            </button>
          )}

          {/* Sección de usuario en móvil */}
          <div className="pt-4 border-t border-white/10">
            <div className="flex items-center space-x-4 mb-4">
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${getRoleColor(user.role)} flex items-center justify-center text-white font-bold text-lg shadow-xl`}
              >
                {getInitials(user.nombre, user.apellido)}
              </div>
              <div className="flex-1">
                <div className="text-base font-bold text-white">
                  {user.nombre} {user.apellido}
                </div>
                <div className="text-sm text-purple-200">{user.email}</div>
                <div
                  className={`inline-block px-2 py-1 text-xs font-bold text-white rounded-full bg-gradient-to-r ${roleBadge.color} mt-1`}
                >
                  {roleBadge.text}
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="glass-button-premium w-full py-3 text-base font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingOut ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="premium-loader w-5 h-5"></div>
                  <span>Cerrando sesión...</span>
                </div>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Cerrar sesión
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
