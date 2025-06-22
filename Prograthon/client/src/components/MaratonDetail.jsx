// client/src/components/MaratonDetail.jsx
import React from "react";

export default function MaratonDetail({
  maraton,
  currentUser,     // ← agregar prop para conocer el rol
  onBack,
  onAssignProblemas,
  onViewProblemas,
  onRanking,       // ← prop para invocar la vista de ranking
}) {
  if (!maraton) {
    return (
      <div className="min-h-screen premium-background flex items-center justify-center">
        <div className="glass-card-premium glass-card-md text-center">
          <div className="premium-loader mb-4"></div>
          <p className="text-xl text-gray-300">Cargando maratón...</p>
        </div>
      </div>
    );
  }

  const { nombre, cantidadProblemas } = maraton;
  const rol = currentUser?.role;

  return (
    <div className="min-h-screen premium-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="glass-card-premium glass-card-lg mb-8 fade-in">
            <div className="text-center">
              <h1 className="premium-title mb-2">
                {nombre}
              </h1>
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="status-badge info">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Maratón Activa
                </div>
                <div className="status-badge">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {cantidadProblemas} Problemas
                </div>
              </div>
              <p className="premium-subtitle">
                Gestiona los problemas y revisa el progreso de esta maratón
              </p>
            </div>
          </div>

          {/* Action Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Asignar Problemas Card */}
            <div className="glass-card-premium glass-card-md slide-in-left ambient-glow">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Asignar Problemas</h3>
                <p className="text-gray-300 mb-6 text-sm leading-relaxed">
                  Añade nuevos problemas a esta maratón para desafiar a los participantes
                </p>
                <button 
                  className="glass-button-premium w-full"
                  onClick={() => onAssignProblemas(maraton)}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Asignar Problemas
                </button>
              </div>
            </div>

            {/* Ver Problemas Card */}
            <div className="glass-card-premium glass-card-md fade-in" style={{animationDelay: '0.2s'}}>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Ver Problemas</h3>
                <p className="text-gray-300 mb-6 text-sm leading-relaxed">
                  Revisa todos los problemas actuales de la maratón
                </p>
                <button 
                  className="glass-button-premium w-full"
                  onClick={() => onViewProblemas(maraton)}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Ver Problemas
                </button>
              </div>
            </div>

            {/* Ranking Card - Solo para profesores y admins */}
            {(rol === "profesor" || rol === "admin") && (
              <div className="glass-card-premium glass-card-md slide-in-right halo-effect" style={{animationDelay: '0.4s'}}>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Ranking</h3>
                  <p className="text-gray-300 mb-6 text-sm leading-relaxed">
                    Consulta las estadísticas y posiciones de los participantes
                  </p>
                  <button 
                    className="glass-button-premium w-full"
                    onClick={() => onRanking(maraton)}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Ver Ranking
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Back Button */}
          <div className="text-center fade-in" style={{animationDelay: '0.6s'}}>
            <button 
              className="glass-button-secondary px-8 py-3 rounded-xl font-semibold transition-all duration-300 inline-flex items-center"
              onClick={() => onBack()}
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