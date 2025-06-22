import React, { useState } from "react";
import { problemas } from "../api";

export default function CreateProblema({ onCancel, onCreated }) {
  const [formData, setFormData] = useState({
    nombre: "",
    tiempoPromedio: "",
    dificultad: "1",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nombre, tiempoPromedio, dificultad } = formData;

    // Validaciones
    if (!nombre.trim() || !tiempoPromedio || !dificultad) {
      setError("Por favor completa todos los campos.");
      return;
    }
    const tiempo = parseInt(tiempoPromedio, 10);
    const diff = parseInt(dificultad, 10);
    if (isNaN(tiempo) || tiempo < 1) {
      setError("Tiempo promedio inválido.");
      return;
    }
    if (isNaN(diff) || diff < 1 || diff > 5) {
      setError("Dificultad inválida (1 a 5).");
      return;
    }

    try {
      setLoading(true);
      setError("");
      // Llamada AJAX para crear problema
      await problemas.create({
        nombre: nombre.trim(),
        tiempoPromedio: tiempo,
        dificultad: diff,
      });
      alert("Problema creado con éxito.");
      onCreated();
    } catch (err) {
      setError(err.message || "Error al crear problema.");
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (level) => {
    const colors = {
      1: "text-green-400",
      2: "text-yellow-400", 
      3: "text-orange-400",
      4: "text-red-400",
      5: "text-purple-400"
    };
    return colors[level] || "text-gray-400";
  };

  const getDifficultyText = (level) => {
    const texts = {
      1: "Muy Fácil",
      2: "Fácil",
      3: "Intermedio", 
      4: "Difícil",
      5: "Muy Difícil"
    };
    return texts[level] || "Seleccionar";
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card-premium glass-card-lg w-full max-w-2xl fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-yellow-300 via-yellow-100 to-blue-100 bg-clip-text text-transparent">
            Registrar Nuevo Problema
          </h1>
          <p className="text-slate-300 text-lg">
            Completa los datos del problema matemático
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-300 mb-6 w-full text-center py-3 text-base rounded-lg backdrop-blur-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="space-y-6">
          {/* Nombre del problema */}
          <div className="space-y-2">
            <label className="block text-slate-200 font-semibold text-lg">
              Nombre del problema
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              disabled={loading}
              placeholder="Ej: Ecuaciones cuadráticas básicas"
              className="glass-input-premium w-full"
            />
          </div>

          {/* Tiempo promedio */}
          <div className="space-y-2">
            <label className="block text-slate-200 font-semibold text-lg">
              Tiempo promedio de resolución
            </label>
            <div className="relative">
              <input
                type="number"
                name="tiempoPromedio"
                value={formData.tiempoPromedio}
                onChange={handleChange}
                disabled={loading}
                placeholder="15"
                min="1"
                className="glass-input-premium w-full pr-20"
              />
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 font-medium">
                minutos
              </span>
            </div>
          </div>

          {/* Dificultad */}
          <div className="space-y-2">
            <label className="block text-slate-200 font-semibold text-lg">
              Nivel de dificultad
            </label>
            <div className="relative">
              <select
                name="dificultad"
                value={formData.dificultad}
                onChange={handleChange}
                disabled={loading}
                className="glass-input-premium w-full appearance-none cursor-pointer"
              >
                <option value="1">1 - Muy Fácil</option>
                <option value="2">2 - Fácil</option>
                <option value="3">3 - Intermedio</option>
                <option value="4">4 - Difícil</option>
                <option value="5">5 - Muy Difícil</option>
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {/* Indicador visual de dificultad */}
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-slate-400 text-sm">Dificultad seleccionada:</span>
              <span className={`font-semibold ${getDifficultyColor(formData.dificultad)}`}>
                {getDifficultyText(formData.dificultad)}
              </span>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`w-2 h-2 rounded-full ${
                      level <= parseInt(formData.dificultad) 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                        : 'bg-slate-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="glass-button-premium flex-1 h-14 text-lg font-bold relative overflow-hidden group"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Creando problema...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Crear Problema</span>
                </div>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => onCancel()}
              disabled={loading}
              className="flex-1 h-14 text-lg font-semibold rounded-xl transition-all duration-300 border border-slate-500/30 hover:border-slate-400/50 hover:bg-slate-600/30 text-slate-200 bg-slate-600/30 backdrop-blur-sm"
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Cancelar</span>
              </div>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 pt-6 border-t border-slate-700/50">
          <p className="text-slate-400 text-sm text-center">
            💡 Los problemas creados estarán disponibles inmediatamente para su uso
          </p>
        </div>
      </div>
    </div>
  );
}