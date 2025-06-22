// client/src/components/VerProblemasMaraton.jsx
import React, { useEffect, useState } from "react";
import { maratones } from "../api";

export default function VerProblemasMaraton({ maraton, onBack }) {
  
  const [listaAsignados, setListaAsignados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); 

  // Fetch problemas asignados
  useEffect(() => {
    (async () => {
      try {
        const res = await maratones.getProblemasDeMaraton(maraton._id);
        setListaAsignados(res);
      } catch (error) {
        setErr(error.message || "Error al obtener problemas asignados.");
      } finally {
        setLoading(false);
      }
    })();
  }, [maraton]);

  const handleRemove = async (pid) => {
    if (!window.confirm("¿Eliminar este problema de la maratón?")) return;
    try {
      await maratones.removeProblemaDeMaraton(maraton._id, pid);
      setListaAsignados(listaAsignados.filter((p) => p._id !== pid));
    } catch (error) {
      alert(error.message || "Error al eliminar problema.");
    }
  };

  // Filtrar + ordenar
  const filtered = listaAsignados
    .filter((p) =>
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.dificultad - b.dificultad;
      } else {
        return b.dificultad - a.dificultad;
      }
    });

  // Función para obtener el color según dificultad
  const getDifficultyColor = (dificultad) => {
    if (dificultad <= 3) return "bg-green-500/20 border-green-400/30 text-green-300";
    if (dificultad <= 6) return "bg-yellow-500/20 border-yellow-400/30 text-yellow-300";
    if (dificultad <= 8) return "bg-orange-500/20 border-orange-400/30 text-orange-300";
    return "bg-red-500/20 border-red-400/30 text-red-300";
  };

  if (loading) {
    return (
      <div className="min-h-screen premium-background flex items-center justify-center">
        <div className="glass-card-premium glass-card-lg text-center">
          <div className="premium-loader mb-4"></div>
          <p className="text-xl text-gray-300">Cargando problemas asignados…</p>
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="min-h-screen premium-background flex items-center justify-center">
        <div className="glass-card-premium glass-card-lg text-center">
          <div className="status-badge error mb-4 text-lg">
            ⚠️ Error
          </div>
          <p className="text-red-300 text-lg">{err}</p>
          <button 
            onClick={onBack}
            className="glass-button-premium mt-6"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen premium-background">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="text-center mb-8 fade-in">
          <h1 className="premium-title">
            Problemas Asignados
          </h1>
          <div className="premium-subtitle">
            Maratón: <span className="text-yellow-300 font-semibold">{maraton.nombre}</span>
          </div>
        </div>

        {/* Controls Section */}
        <div className="glass-card-premium glass-card-md mb-8 slide-in-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Search Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                🔍 Buscar por nombre:
              </label>
              <input
                type="text"
                placeholder="Escribe el nombre del problema..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="glass-input-premium w-full"
              />
            </div>

            {/* Sort Select */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                ⚡ Ordenar por dificultad:
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="glass-input-premium w-full cursor-pointer"
              >
                <option value="asc">📈 Ascendente (Fácil → Difícil)</option>
                <option value="desc">📉 Descendente (Difícil → Fácil)</option>
              </select>
            </div>
          </div>

          {/* Results Counter */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="status-badge info">
                📊 {filtered.length} problema{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
              </span>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-sm text-purple-300 hover:text-white transition-colors duration-200"
                >
                  ✖️ Limpiar búsqueda
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Problems List */}
        <div className="space-y-4 slide-in-right">
          {filtered.length === 0 ? (
            <div className="glass-card-premium glass-card-lg text-center">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-2xl font-bold text-gray-300 mb-2">
                No hay problemas {searchTerm ? 'que coincidan' : 'asignados'}
              </h3>
              <p className="text-gray-400">
                {searchTerm 
                  ? `No se encontraron problemas con "${searchTerm}"`
                  : "Esta maratón aún no tiene problemas asignados."
                }
              </p>
            </div>
          ) : (
            filtered.map((p, index) => (
              <div 
                key={p._id} 
                className="glass-card-premium glass-card-md hover:scale-[1.01] transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  {/* Problem Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="text-2xl">🧩</div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">
                          {p.nombre}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className={`status-badge ${getDifficultyColor(p.dificultad)}`}>
                            ⭐ Dificultad: {p.dificultad}/10
                          </span>
                          <span className="status-badge">
                            ⏱️ {p.tiempoPromedio} min
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleRemove(p._id)}
                      className="glass-button-danger px-4 py-2 rounded-lg font-semibold transition-all duration-200 hover:scale-105 flex items-center gap-2"
                      style={{
                        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.8), rgba(248, 113, 113, 0.8))',
                        boxShadow: '0 4px 15px rgba(239, 68, 68, 0.2)',
                        border: '1px solid rgba(248, 113, 113, 0.3)'
                      }}
                    >
                      <span>🗑️</span>
                      <span>Eliminar</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Back Button */}
        <div className="text-center mt-12">
          <button 
            onClick={onBack}
            className="glass-button-premium px-8 py-3 text-lg hover:scale-105 transition-all duration-300"
          >
            <span className="mr-2">←</span>
            Volver a Maratones
          </button>
        </div>
      </div>
    </div>
  );
}