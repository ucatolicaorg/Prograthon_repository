import React from "react";

export default function MaratonesMenu({ onCreate, onView }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="glass-card-premium glass-card-lg fade-in max-w-2xl w-full text-center">
        {/* Título principal */}
        <div className="mb-12">
          <h1 className="premium-title">
            Maratones de Programación
          </h1>
          <p className="premium-subtitle">
            Gestiona y participa en competencias de programación
          </p>
        </div>

        {/* Contenedor de botones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Botón Crear Maratón */}
          <div className="group">
            <button 
              onClick={onCreate}
              className="glass-button-premium w-full h-24 text-xl font-bold flex flex-col items-center justify-center gap-3 hover:scale-105 transition-transform duration-300"
            >
              <div className="text-3xl">🏆</div>
              <span>Crear Maratón</span>
            </button>
            <p className="text-slate-300 mt-3 text-sm opacity-70 group-hover:opacity-100 transition-opacity">
              Organiza una nueva competencia
            </p>
          </div>

          {/* Botón Ver Maratones */}
          <div className="group">
            <button 
              onClick={onView}
              className="glass-button-premium w-full h-24 text-xl font-bold flex flex-col items-center justify-center gap-3 hover:scale-105 transition-transform duration-300"
            >
              <div className="text-3xl">📊</div>
              <span>Ver Maratones</span>
            </button>
            <p className="text-slate-300 mt-3 text-sm opacity-70 group-hover:opacity-100 transition-opacity">
              Explora competencias disponibles
            </p>
          </div>
        </div>

        {/* Decoración inferior */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <span>Sistema de Competencias</span>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}