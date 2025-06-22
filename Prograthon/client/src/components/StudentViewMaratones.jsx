// client/src/components/StudentViewMaratones.jsx
import React, { useEffect, useState } from "react";
import { maratones } from "../api";

export default function StudentViewMaratones({ onBack, onSelect }) {
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await maratones.list();
        setLista(res);
      } catch (error) {
        setErr(error.message || "Error al obtener maratones.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center premium-background">
        <div className="glass-card-premium glass-card-lg text-center ambient-glow">
          <div className="premium-loader mb-6"></div>
          <p className="text-xl text-indigo-200 font-medium">Cargando maratones…</p>
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="min-h-screen flex items-center justify-center premium-background">
        <div className="glass-card-premium glass-card-lg text-center max-w-md">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-red-300 text-lg mb-6">{err}</p>
          </div>
          <button onClick={onBack} className="glass-button-premium w-full">
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen premium-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 fade-in">
          <h1 className="premium-title">Maratones Disponibles</h1>
          <p className="premium-subtitle">
            Seleccione la maratón a la que desea inscribirse
          </p>
        </div>

        {/* Content */}
        {lista.length === 0 ? (
          <div className="glass-card-premium glass-card-lg text-center max-w-md mx-auto slide-in-left">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-indigo-200 text-lg">No hay maratones disponibles.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 slide-in-right">
            {lista.map((m, index) => (
              <div 
                key={m.id || index} 
                className="glass-card-premium glass-card-md group relative overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Contenido principal */}
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-yellow-200 transition-colors duration-300">
                      {m.nombre}
                    </h3>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-indigo-300">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="font-medium">
                          Total de problemas: <span className="text-yellow-300 font-bold">{m.cantidadProblemas}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-6">
                    <button 
                      onClick={() => onSelect(m)} 
                      className="glass-button-premium px-8 py-3 group-hover:scale-105 transition-transform duration-300"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Inscribirme
                    </button>
                  </div>
                </div>

                {/* Indicador de estado */}
                <div className="absolute top-4 right-4">
                  <div className="status-badge">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                    Disponible
                  </div>
                </div>

                {/* Efecto decorativo en hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </div>
            ))}
          </div>
        )}

        {/* Botón de navegación */}
        <div className="text-center mt-12">
          <button 
            onClick={onBack} 
            className="glass-button-secondary px-8 py-3 inline-flex items-center hover:scale-105 transition-transform duration-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}