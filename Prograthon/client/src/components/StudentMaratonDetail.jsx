// client/src/components/StudentMaratonDetail.jsx

import React, { useEffect, useState } from "react";
import { maratones } from "../api";

export default function StudentMaratonDetail({ maraton, onBack, onRanking }) {
  const [problemasList, setProblemasList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [inscrito, setInscrito] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        // 1) Recuperar lista de problemas asignados a la maratón
        const res = await maratones.getProblemasDeMaraton(maraton._id);
        // Aunque el endpoint devuelva { nombre, tiempoPromedio, dificultad }, 
        // al estudiante solo le mostraremos el nombre.
        setProblemasList(res);
      } catch (error) {
        setErr(error.message || "Error al cargar problemas.");
      } finally {
        setLoading(false);
      }
    })();

    setInscrito(true);
  }, [maraton]);

  const handleRankingClick = () => {
    onRanking();
  };

  if (loading) {
    return (
      <div className="min-h-screen premium-background flex items-center justify-center">
        <div className="glass-card-premium glass-card-md text-center">
          <div className="premium-loader mb-4"></div>
          <p className="text-xl text-gray-300">Cargando información de la maratón…</p>
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="min-h-screen premium-background flex items-center justify-center">
        <div className="glass-card-premium glass-card-md text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Error</h3>
          <p className="text-red-300 mb-6">{err}</p>
          <button 
            className="glass-button-secondary"
            onClick={onBack}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="glass-card-premium glass-card-lg mb-8 fade-in">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center mr-4">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h1 className="text-3xl font-bold text-white mb-2">{maraton.nombre}</h1>
                  <div className="flex items-center gap-2">
                    <div className="status-badge">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Inscrito
                    </div>
                    <div className="status-badge info">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                      Estudiante
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Problems Section */}
          <div className="glass-card-premium glass-card-lg mb-8 slide-in-left">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Problemas Disponibles</h3>
                <p className="text-gray-300">Lista de desafíos para resolver en esta maratón</p>
              </div>
            </div>

            {problemasList.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-300 mb-2">Sin problemas asignados</h4>
                <p className="text-gray-400">No hay problemas asignados a esta maratón todavía.</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {problemasList.map((p, index) => (
                  <div 
                    key={p._id} 
                    className="flex items-center p-4 rounded-xl bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-slate-600/30 transition-all duration-200 hover:border-purple-500/40 hover:bg-gradient-to-r hover:from-slate-700/60 hover:to-slate-600/60"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-white">{p.nombre}</h4>
                      <p className="text-gray-400 text-sm">Problema de programación</p>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center fade-in" style={{animationDelay: '0.4s'}}>
            <button 
              className="glass-button-premium px-8 py-3 w-full sm:w-auto"
              onClick={handleRankingClick} 
              disabled={!inscrito}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Ver Ranking
            </button>

            <button 
              className="glass-button-secondary px-8 py-3 w-full sm:w-auto"
              onClick={onBack}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}