// client/src/components/EditProfile.jsx

import React, { useEffect, useState } from "react";
import { users } from "../api";

export default function EditProfile({ user, currentUser, onUpdate, onCancel }) {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    edad: "",
    role: "estudiante"
  });
  const [err, setErr] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Inicializo el formulario con los datos de `user` (el que vamos a editar)
  useEffect(() => {
    if (user) {
      setForm({
        nombre: user.nombre,
        apellido: user.apellido,
        edad: user.edad,
        role: user.role, // Siempre seteamos el role actual
      });
    }
  }, [user]);

  // Determino si el currentUser es admin
  const isAdmin = currentUser?.role === "admin";
  // Y si está editando a otro usuario distinto de sí mismo
  const isEditingOther = isAdmin && currentUser._id !== user._id;

  // Si soy admin y edito otro, título "Perfil de usuario"; si no, "Editar mi perfil"
  const title = isEditingOther ? "Perfil de usuario" : "Editar mi perfil";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (err) setErr("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validaciones básicas
    if (!form.nombre.trim() || !form.apellido.trim()) {
      setErr("Nombre y apellido no pueden estar vacíos");
      setIsLoading(false);
      return;
    }
    const edadNum = parseInt(form.edad, 10);
    if (isNaN(edadNum) || edadNum < 1 || edadNum > 120) {
      setErr("Por favor ingresa una edad válida");
      setIsLoading(false);
      return;
    }

    try {
      // Construyo el objeto de actualizaciones
      const updates = {
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        edad: edadNum,
      };

      // Si soy admin editando otro usuario, agrego el campo role
      if (isEditingOther) {
        if (["estudiante", "profesor"].includes(form.role)) {
          updates.role = form.role;
        }
      }

      await users.update(user._id, updates);
      alert("Perfil actualizado correctamente");
      onUpdate();
    } catch (e) {
      setErr(e.message || "Error al guardar cambios");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="premium-background min-h-screen flex items-center justify-center py-12 px-4">
      <div className="glass-card-premium glass-card-lg mx-auto max-w-2xl fade-in ambient-glow">
        
        {/* Header con avatar y título */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg halo-effect">
              {user?.nombre?.charAt(0)?.toUpperCase() || "U"}
            </div>
            {isEditingOther && (
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-xs px-2 py-1 rounded-full text-black font-semibold shadow-lg">
                Admin
              </div>
            )}
          </div>
          
          <h2 className="premium-title text-4xl mb-2">
            {title}
          </h2>
          
          <p className="premium-subtitle">
            {isEditingOther 
              ? `Editando perfil de ${user?.nombre} ${user?.apellido}`
              : "Actualiza tu información personal"
            }
          </p>
        </div>

        {/* Error message mejorado */}
        {err && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/30 backdrop-filter backdrop-blur-sm slide-in-left">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm">!</span>
              </div>
              <p className="text-red-300 font-medium">{err}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          
          {/* Grid de campos principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Campo Nombre */}
            <div className="slide-in-left" style={{ animationDelay: '0.1s' }}>
              <label className="block text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></span>
                Nombre
              </label>
              <input
                name="nombre"
                className="glass-input-premium w-full"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Ingresa tu nombre"
                required
              />
            </div>

            {/* Campo Apellido */}
            <div className="slide-in-right" style={{ animationDelay: '0.2s' }}>
              <label className="block text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"></span>
                Apellido
              </label>
              <input
                name="apellido"
                className="glass-input-premium w-full"
                value={form.apellido}
                onChange={handleChange}
                placeholder="Ingresa tu apellido"
                required
              />
            </div>
          </div>

          {/* Campo Edad */}
          <div className="slide-in-left" style={{ animationDelay: '0.3s' }}>
            <label className="block text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"></span>
              Edad
            </label>
            <div className="relative">
              <input
                name="edad"
                type="number"
                className="glass-input-premium w-full"
                value={form.edad}
                onChange={handleChange}
                placeholder="Edad en años"
                min="1"
                max="120"
                required
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                años
              </div>
            </div>
          </div>

          {/* Campo Rol - Solo para admin editando otro usuario */}
          {isEditingOther && (
            <div className="slide-in-right" style={{ animationDelay: '0.4s' }}>
              <label className="block text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"></span>
                Rol del Usuario
              </label>
              <div className="relative">
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="glass-input-premium w-full appearance-none cursor-pointer"
                  required
                >
                  <option value="estudiante">🎓 Estudiante</option>
                  <option value="profesor">👨‍🏫 Profesor</option>
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              {/* Status badge del rol actual */}
              <div className="mt-3 flex justify-center">
                <span className={`status-badge ${form.role === 'profesor' ? 'info' : ''}`}>
                  {form.role === 'profesor' ? '👨‍🏫 Profesor' : '🎓 Estudiante'}
                </span>
              </div>
            </div>
          )}

          {/* Botones de acción mejorados */}
          <div className="flex flex-col sm:flex-row gap-4 mt-12 fade-in" style={{ animationDelay: '0.5s' }}>
            <button
              type="submit"
              disabled={isLoading}
              className="glass-button-premium flex-1 py-4 text-xl font-bold relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="premium-loader w-5 h-5"></div>
                  <span>Guardando...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Guardar cambios</span>
                </div>
              )}
            </button>
            
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="glass-button-secondary glass-button-premium flex-1 py-4 text-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Volver</span>
              </div>
            </button>
          </div>
        </form>

        {/* Información adicional para admin */}
        {isEditingOther && (
          <div className="mt-8 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 backdrop-filter backdrop-blur-sm fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-blue-300 font-semibold mb-1">Privilegios de Administrador</h4>
                <p className="text-blue-200 text-sm">
                  Como administrador, puedes modificar el rol de este usuario. Los cambios se aplicarán inmediatamente.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}