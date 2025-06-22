import React, { useState } from "react";
import { register } from "../api";

const Register = ({ onRegister, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    edad: "",
    email: "",
    password: "",
    role: "estudiante", 
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones básicas
    if (
      !formData.nombre ||
      !formData.apellido ||
      !formData.edad ||
      !formData.email ||
      !formData.password
    ) {
      setError("Por favor completa todos los campos");
      return;
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (parseInt(formData.edad) < 1 || parseInt(formData.edad) > 120) {
      setError("Por favor ingresa una edad válida");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await register(formData);
      setSuccess("¡Registro exitoso! Ahora puedes iniciar sesión.");

      // Limpiar formulario (role queda en 'estudiante')
      setFormData({
        nombre: "",
        apellido: "",
        edad: "",
        email: "",
        password: "",
        role: "estudiante",
      });

      // Redirigir al login después de 1.5 segundos
      setTimeout(() => {
        onRegister();
      }, 1500);
    } catch (err) {
      setError(err.message || "Error al registrar usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="premium-background min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Efectos de fondo adicionales */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-indigo-900/10 to-pink-900/20"></div>
      
      {/* Elementos decorativos flotantes */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-full blur-xl animate-pulse delay-500"></div>

      <div className="auth-container glass-card-premium mx-auto max-w-lg fade-in p-8 relative z-10 ambient-glow">
        {/* Header con logo mejorado */}
        <div className="text-center mb-8 relative">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-lg opacity-50 animate-pulse"></div>
            <img
              src="https://i.imgur.com/MKpzI59.png"
              alt="Logo Prograthon"
              className="w-28 h-28 rounded-full mx-auto shadow-2xl relative z-10 transition-transform duration-300 hover:scale-110 hover:rotate-12"
            />
          </div>
          
          <h2 className="premium-title mb-2">Crear Cuenta</h2>
          <p className="premium-subtitle">Únete a la comunidad de programadores</p>
          
          {/* Indicador de progreso visual */}
          <div className="flex justify-center space-x-2 mt-4">
            <div className="w-8 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            <div className="w-8 h-1 bg-gray-600 rounded-full"></div>
            <div className="w-8 h-1 bg-gray-600 rounded-full"></div>
          </div>
        </div>

        {/* Alert mejoradas con iconos */}
        {error && (
          <div className="status-badge error mb-6 p-4 rounded-xl w-full text-center animate-shake">
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}
        
        {success && (
          <div className="status-badge mb-6 p-4 rounded-xl w-full text-center animate-bounce">
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{success}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombres en grid responsive */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="slide-in-left">
              <label htmlFor="nombre" className="block text-white font-medium mb-2 flex items-center space-x-2">
                <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span>Nombre</span>
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="glass-input-premium"
                placeholder="Tu nombre"
                required
                disabled={loading}
              />
            </div>

            <div className="slide-in-right">
              <label htmlFor="apellido" className="block text-white font-medium mb-2 flex items-center space-x-2">
                <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span>Apellido</span>
              </label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                className="glass-input-premium"
                placeholder="Tu apellido"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Edad y Role en grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="fade-in">
              <label htmlFor="edad" className="block text-white font-medium mb-2 flex items-center space-x-2">
                <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <span>Edad</span>
              </label>
              <input
                type="number"
                id="edad"
                name="edad"
                value={formData.edad}
                onChange={handleChange}
                className="glass-input-premium"
                placeholder="Tu edad"
                min="1"
                max="120"
                required
                disabled={loading}
              />
            </div>

            <div className="fade-in">
              <label htmlFor="role" className="block text-white font-medium mb-2 flex items-center space-x-2">
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
                <span>Rol</span>
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="glass-input-premium"
                required
                disabled={loading}
              >
                <option value="estudiante">🎓 Estudiante</option>
                <option value="profesor">👨‍🏫 Profesor</option>
              </select>
            </div>
          </div>

          {/* Email */}
          <div className="slide-in-left">
            <label htmlFor="email" className="block text-white font-medium mb-2 flex items-center space-x-2">
              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span>Correo Electrónico</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="glass-input-premium"
              placeholder="tu@ejemplo.com"
              required
              disabled={loading}
            />
          </div>

          {/* Password con indicador de fortaleza */}
          <div className="slide-in-right">
            <label htmlFor="password" className="block text-white font-medium mb-2 flex items-center space-x-2">
              <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>Contraseña</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="glass-input-premium"
              placeholder="Mínimo 6 caracteres"
              minLength="6"
              required
              disabled={loading}
            />
            
            {/* Indicador visual de fortaleza de contraseña */}
            <div className="mt-2 flex space-x-1">
              <div className={`h-1 w-full rounded-full transition-all duration-300 ${
                formData.password.length >= 6 ? 'bg-green-500' : 'bg-gray-600'
              }`} />
              <div className={`h-1 w-full rounded-full transition-all duration-300 ${
                formData.password.length >= 8 ? 'bg-yellow-500' : 'bg-gray-600'
              }`} />
              <div className={`h-1 w-full rounded-full transition-all duration-300 ${
                formData.password.length >= 10 ? 'bg-purple-500' : 'bg-gray-600'
              }`} />
            </div>
            
            <p className="text-xs text-gray-400 mt-1 flex items-center space-x-1">
              <span>💡</span>
              <span>La contraseña debe tener al menos 6 caracteres</span>
            </p>
          </div>

          {/* Botón de submit mejorado */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="glass-button-premium w-full py-4 text-xl relative overflow-hidden group transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              
              {loading ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="premium-loader"></div>
                  <span>Creando cuenta...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  <span>Crear Cuenta</span>
                </div>
              )}
            </button>
          </div>
        </form>

        {/* Switch to login mejorado */}
        <div className="text-center mt-8 pt-6 border-t border-white/10">
          <div className="flex items-center justify-center space-x-2 text-sm">
            <span className="text-gray-400">¿Ya tienes cuenta?</span>
            <button
              onClick={onSwitchToLogin}
              className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-semibold hover:from-purple-300 hover:to-pink-300 transition-all duration-300 transform hover:scale-105"
              disabled={loading}
            >
              Inicia sesión aquí →
            </button>
          </div>
        </div>

        {/* Decoración inferior */}
        <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl"></div>
        <div className="absolute -bottom-5 -right-5 w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-lg"></div>
      </div>
    </div>
  );
};

export default Register;