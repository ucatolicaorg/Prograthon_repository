import React from "react";

export default function ProblemasMenu({ onCreate, onBack }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="glass-card-premium glass-card-lg fade-in max-w-2xl w-full text-center">
        {/* Título principal */}
        <div className="mb-12">
          <h1 className="premium-title">
            Problemas para Maratones
          </h1>
          <p className="premium-subtitle">
            Crea y gestiona desafíos de programación para competencias
          </p>
        </div>

        {/* Contenedor de botones */}
        <div className="space-y-6">
          {/* Botón Crear Problema - Principal */}
          <div className="group">
            <button 
              onClick={() => onCreate()}
              className="glass-button-premium w-full h-20 text-xl font-bold flex items-center justify-center gap-4 hover:scale-105 transition-transform duration-300"
            >
              <div className="text-3xl">💡</div>
              <span>Crear Problema</span>
            </button>
            <p className="text-slate-300 mt-3 text-sm opacity-70 group-hover:opacity-100 transition-opacity">
              Diseña un nuevo desafío de programación
            </p>
          </div>

          {/* Separador visual */}
          <div className="flex items-center my-8">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
            <div className="px-4">
              <div className="w-3 h-3 bg-purple-500/50 rounded-full"></div>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
          </div>

          {/* Botón Volver - Secundario */}
          <div className="group">
            <button 
              onClick={() => onBack()}
              className="glass-button-secondary w-full h-16 text-lg font-semibold flex items-center justify-center gap-3 hover:scale-105 transition-transform duration-300"
            >
              <div className="text-2xl">🔙</div>
              <span>Volver al Perfil</span>
            </button>
            <p className="text-slate-400 mt-2 text-xs opacity-60 group-hover:opacity-90 transition-opacity">
              Regresar a la vista principal
            </p>
          </div>
        </div>

        {/* Decoración inferior */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
            <span>Editor de Problemas</span>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}