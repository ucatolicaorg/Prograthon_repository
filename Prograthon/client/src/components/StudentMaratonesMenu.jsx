// client/src/components/StudentMaratonesMenu.jsx

import React from "react";

export default function StudentMaratonesMenu({ onInscribirse, onBack }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card-premium glass-card-lg max-w-md w-full text-center fade-in">
        {/* Header con icono */}
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-4 glass-card-premium rounded-full flex items-center justify-center ambient-glow">
            <svg 
              className="w-10 h-10 text-yellow-300" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold mb-2">
            <span className="bg-gradient-to-r from-yellow-300 via-yellow-200 to-white bg-clip-text text-transparent">
              Maratones de
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
              Programación
            </span>
          </h1>
          
          <p className="text-slate-300 text-sm leading-relaxed">
            Demuestra tus habilidades y compite con los mejores programadores
          </p>
        </div>

        {/* Botones de acción */}
        <div className="space-y-4">
          <button 
            onClick={() => onInscribirse()}
            className="glass-button-premium w-full text-lg py-4 group"
          >
            <svg 
              className="w-5 h-5 mr-3 transition-transform group-hover:scale-110" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Inscribirme a una maratón
          </button>
          
          <button 
            onClick={() => onBack()}
            className="glass-button w-full text-base py-3 group"
            style={{
              background: 'rgba(71, 85, 105, 0.6)',
              borderColor: 'rgba(148, 163, 184, 0.3)'
            }}
          >
            <svg 
              className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al Perfil
          </button>
        </div>

        {/* Decoración sutil */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-purple-400/60"></div>
            <div className="w-2 h-2 rounded-full bg-indigo-400/40"></div>
            <div className="w-2 h-2 rounded-full bg-purple-400/60"></div>
          </div>
        </div>
      </div>
    </div>
  );
}