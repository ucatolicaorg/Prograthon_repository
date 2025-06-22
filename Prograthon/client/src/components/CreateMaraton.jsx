// client/src/components/CreateMaraton.jsx
import React, { useState } from "react";
import { maratones } from "../api";

export default function CreateMaraton({ onCancel, onCreated }) {
  const [formData, setFormData] = useState({
    nombre: "",
    cantidadProblemas: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nombre, cantidadProblemas } = formData;

    if (!nombre.trim() || !cantidadProblemas) {
      setError("Por favor completa todos los campos.");
      return;
    }
    const cantidad = parseInt(cantidadProblemas, 10);
    if (isNaN(cantidad) || cantidad < 1) {
      setError("Cantidad de problemas inválida.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await maratones.create({
        nombre: nombre.trim(),
        cantidadProblemas: cantidad,
      });

      alert("¡Maratón creada con éxito!");
      onCreated();
    } catch (err) {
      setError(err.message || "Error al crear la maratón.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md">
        {/* Contenedor principal con efectos premium */}
        <div className="glass-card-premium glass-card-lg fade-in ambient-glow">
          {/* Header con gradiente */}
          <div className="relative mb-8 text-center">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-indigo-600/20 to-purple-600/20 rounded-t-2xl -mx-8 -mt-8 mb-4"></div>
            <div className="relative pt-6">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent">
                Crear Maratón
              </h2>
              <p className="mt-2 text-sm text-purple-200/70">
                Configura una nueva maratón de programación
              </p>
            </div>
          </div>

          {/* Mensaje de error con animación */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 backdrop-blur-sm slide-in-left">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-red-300 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo Nombre */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-purple-200">
                <span className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span>Nombre de la maratón</span>
                </span>
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej. Maratón de Algoritmos 2024"
                className="glass-input-premium"
                disabled={loading}
              />
            </div>

            {/* Campo Cantidad */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-purple-200">
                <span className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                  <span>Cantidad de problemas</span>
                </span>
              </label>
              <input
                type="number"
                name="cantidadProblemas"
                value={formData.cantidadProblemas}
                onChange={handleChange}
                placeholder="Ej. 10"
                min="1"
                className="glass-input-premium"
                disabled={loading}
              />
            </div>

            {/* Botones de acción */}
            <div className="flex space-x-4 pt-6">
              {/* Botón Crear */}
              <button
                type="submit"
                disabled={loading}
                className={`glass-button-premium flex-1 relative overflow-hidden transition-all duration-300 ${
                  loading ? 'opacity-75 cursor-not-allowed' : 'hover:scale-105'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="premium-loader w-5 h-5 border-2"></div>
                    <span>Creando...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Crear Maratón</span>
                  </div>
                )}
              </button>

              {/* Botón Cancelar */}
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="glass-button-premium bg-slate-600/80 hover:bg-slate-500/80 border-slate-400/30 hover:border-slate-300/40 flex-shrink-0 px-6 transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Cancelar</span>
                </div>
              </button>
            </div>
          </form>

          {/* Decoración de fondo */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-purple-500/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-indigo-500/20 rounded-full blur-lg"></div>
          </div>
        </div>

        {/* Hint decorativo */}
        <div className="mt-4 text-center">
          <p className="text-xs text-purple-300/60">
            💡 Presiona <kbd className="px-2 py-1 text-xs bg-purple-900/50 rounded border border-purple-700/50">Enter</kbd> para crear rápidamente
          </p>
        </div>
      </div>
    </div>
  );
}