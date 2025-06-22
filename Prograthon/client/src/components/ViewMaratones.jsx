// client/src/components/ViewMaratones.jsx

import React, { useEffect, useState } from "react";
import { maratones } from "../api";

export default function ViewMaratones({ onBack, onSelect }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await maratones.list();
        setList(res);
      } catch (error) {
        setErr(error.message || "Error al obtener maratones.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen premium-background flex items-center justify-center p-4">
        <div className="glass-card-premium glass-card-lg text-center ambient-glow">
          <div className="premium-loader mb-6"></div>
          <p className="text-xl text-indigo-200 font-medium">Cargando maratones...</p>
          <p className="text-sm text-purple-300/70 mt-2">
            Preparando tu experiencia de programación
          </p>
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="min-h-screen premium-background flex items-center justify-center p-4">
        <div className="glass-card-premium glass-card-lg text-center max-w-md">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-red-300 mb-2">Error de Conexión</h3>
            <p className="text-red-200/80">{err}</p>
          </div>
          <button
            onClick={onBack}
            className="glass-button-secondary w-full"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen premium-background">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-12 fade-in">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={onBack}
              className="glass-button-secondary px-6 py-3 hover:scale-105 transition-transform duration-300"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver
            </button>
            
            <div className="status-badge info">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              {list.length} Maratón{list.length !== 1 ? 'es' : ''}
            </div>
          </div>

          <div className="text-center">
            <h1 className="premium-title">Panel de Maratones</h1>
            <p className="premium-subtitle">
              Administra y gestiona todas las maratones de programación
            </p>
          </div>
        </div>

        {/* Content Section */}
        {list.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="glass-card-premium glass-card-lg text-center max-w-lg slide-in-left">
              <div className="mb-8">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-400/20 flex items-center justify-center">
                  <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">No hay maratones disponibles</h3>
                <p className="text-purple-200/70 text-lg">
                  Aún no se han creado maratones en el sistema.
                </p>
              </div>
              <div className="text-sm text-purple-300/60 italic">
                Las maratones aparecerán aquí una vez sean creadas por los administradores
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Maratones Grid */}
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1 slide-in-right">
              {list.map((m, index) => (
                <div
                  key={m._id}
                  className="glass-card-premium glass-card-md group relative overflow-hidden"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Main Content */}
                  <div className="flex items-center justify-between relative z-10">
                    {/* Left Section - Info */}
                    <div className="flex items-center space-x-6">
                      {/* Marathon Icon */}
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                        </div>
                      </div>

                      {/* Marathon Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-yellow-200 transition-colors duration-300">
                          {m.nombre}
                        </h3>
                        <div className="flex items-center space-x-6 text-indigo-300">
                          <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                            </svg>
                            <span className="font-semibold">
                              {m.cantidadProblemas} problema{m.cantidadProblemas !== 1 ? 's' : ''}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4l4 6v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8l4-6z" />
                            </svg>
                            <span className="text-sm">
                              {new Date(m.createdAt).toLocaleDateString('es-ES', { 
                                day: 'numeric', 
                                month: 'short', 
                                year: 'numeric' 
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Section - Action */}
                    <div className="flex-shrink-0 ml-6">
                      <button
                        onClick={() => onSelect(m)}
                        className="glass-button-premium px-8 py-3 group-hover:scale-105 transition-all duration-300"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">Administrar</span>
                          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="status-badge">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                      Activa
                    </div>
                  </div>

                  {/* Decorative Progress Bar */}
                  <div className="mt-6 h-2 bg-purple-900/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: `${Math.min(100, Math.max(20, (m.cantidadProblemas / 15) * 100))}%`,
                        animationDelay: `${index * 0.2}s`
                      }}
                    ></div>
                  </div>

                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </div>
              ))}
            </div>

            {/* Statistics Footer */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 fade-in">
              <div className="glass-card glass-card-sm text-center">
                <div className="text-3xl font-bold text-purple-300 mb-2">
                  {list.reduce((acc, m) => acc + m.cantidadProblemas, 0)}
                </div>
                <div className="text-sm text-purple-200/70 font-medium">Problemas Totales</div>
              </div>
              <div className="glass-card glass-card-sm text-center">
                <div className="text-3xl font-bold text-indigo-300 mb-2">
                  {Math.round(list.reduce((acc, m) => acc + m.cantidadProblemas, 0) / list.length)}
                </div>
                <div className="text-sm text-purple-200/70 font-medium">Promedio por Maratón</div>
              </div>
              <div className="glass-card glass-card-sm text-center">
                <div className="text-3xl font-bold text-cyan-300 mb-2">
                  {list.length}
                </div>
                <div className="text-sm text-purple-200/70 font-medium">Maratones Activas</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}