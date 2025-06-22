// client/src/components/AssignProblemas.jsx

import React, { useEffect, useState } from "react";
import { problemas, maratones } from "../api";

export default function AssignProblemas({ maraton, onBack }) {
  

  const [listaProblemas, setListaProblemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); 
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await problemas.list();
        setListaProblemas(res);
      } catch (error) {
        setErr(error.message || "Error fetching problemas.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Filtrar + ordenar
  const filtered = listaProblemas
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

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((x) => x !== id));
    } else {
      // Si excede cantidadProblemas, no agregar
      if (selectedIds.length < maraton.cantidadProblemas) {
        setSelectedIds([...selectedIds, id]);
      } else {
        alert(
          `Solo puedes seleccionar hasta ${maraton.cantidadProblemas} problemas.`
        );
      }
    }
  };

  const handleAssign = async () => {
    if (selectedIds.length < 1) {
      alert("Debes seleccionar al menos 1 problema.");
      return;
    }
    try {
      await maratones.assignProblemas(maraton._id, selectedIds);
      alert("Problemas asignados correctamente.");
      onBack();
    } catch (error) {
      alert(error.message || "Error asignando problemas.");
    }
  };

  // Función para obtener el color según la dificultad
  const getDifficultyColor = (dificultad) => {
    if (dificultad <= 3) return "text-green-400";
    if (dificultad <= 6) return "text-yellow-400";
    if (dificultad <= 8) return "text-orange-400";
    return "text-red-400";
  };

  // Función para obtener el badge de dificultad
  const getDifficultyBadge = (dificultad) => {
    if (dificultad <= 3) return "Fácil";
    if (dificultad <= 6) return "Medio";
    if (dificultad <= 8) return "Difícil";
    return "Experto";
  };

  if (loading) {
    return (
      <div className="container-premium min-h-screen flex items-center justify-center">
        <div className="glass-card-premium glass-card-lg text-center">
          <div className="premium-loader mb-4"></div>
          <p className="text-lg text-purple-200">Cargando lista de problemas…</p>
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="container-premium min-h-screen flex items-center justify-center">
        <div className="glass-card-premium glass-card-lg text-center">
          <div className="text-red-400 text-lg mb-4">⚠️ Error</div>
          <p className="text-red-300">{err}</p>
          <button 
            onClick={onBack}
            className="glass-button-premium mt-4"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-premium min-h-screen py-8">
      {/* Header Section */}
      <div className="glass-card-premium glass-card-lg mb-8 fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Asignar Problemas
            </h1>
            <p className="text-purple-200 mt-2">
              Maratón: <span className="font-semibold text-white">{maraton.nombre}</span>
            </p>
          </div>
          <button 
            onClick={onBack}
            className="glass-button-secondary px-4 py-2 text-sm"
          >
            ← Volver
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-purple-200">Progreso de selección</span>
            <span className="text-sm font-semibold text-white">
              {selectedIds.length} de {maraton.cantidadProblemas}
            </span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ 
                width: `${(selectedIds.length / maraton.cantidadProblemas) * 100}%` 
              }}
            ></div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label">
              🔍 Buscar por nombre
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-input-premium"
              placeholder="Escribe el nombre del problema..."
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">
              📊 Ordenar por dificultad
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="glass-input-premium"
            >
              <option value="asc">🔼 Ascendente (Fácil → Difícil)</option>
              <option value="desc">🔽 Descendente (Difícil → Fácil)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Problems List */}
      <div className="glass-card-premium glass-card-lg mb-8 slide-in-left">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
          📝 Lista de Problemas
          <span className="ml-2 status-badge info text-xs">
            {filtered.length} disponibles
          </span>
        </h2>

        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-400 text-lg">
              No se encontraron problemas que coincidan con tu búsqueda
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filtered.map((p) => (
              <div 
                key={p._id}
                className={`
                  glass-card p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02]
                  ${selectedIds.includes(p._id) 
                    ? 'border-purple-400 bg-purple-900/20 shadow-lg' 
                    : 'hover:border-purple-600/50'
                  }
                `}
                onClick={() => toggleSelect(p._id)}
              >
                <div className="flex items-center space-x-4">
                  {/* Custom Checkbox */}
                  <div className="checkbox-premium">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(p._id)}
                      onChange={() => toggleSelect(p._id)}
                      className="sr-only"
                    />
                    <div className="checkmark"></div>
                  </div>

                  {/* Problem Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-white text-lg">
                          {p.nombre}
                        </h3>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-400">Dificultad:</span>
                            <span className={`font-bold ${getDifficultyColor(p.dificultad)}`}>
                              {p.dificultad}/10
                            </span>
                            <span className={`status-badge text-xs ${
                              p.dificultad <= 3 ? '' : 
                              p.dificultad <= 6 ? 'warning' : 
                              p.dificultad <= 8 ? 'error' : 'error'
                            }`}>
                              {getDifficultyBadge(p.dificultad)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-400">⏱️</span>
                            <span className="text-sm text-purple-200">
                              {p.tiempoPromedio} min
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {selectedIds.includes(p._id) && (
                        <div className="text-green-400 text-xl">
                          ✓
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="glass-card-premium glass-card-md slide-in-right">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="text-center sm:text-left">
            <p className="text-lg font-semibold text-white">
              Problemas seleccionados: {selectedIds.length} de {maraton.cantidadProblemas}
            </p>
            {selectedIds.length > 0 && (
              <p className="text-sm text-purple-200 mt-1">
                ¡Listo para asignar estos problemas al maratón!
              </p>
            )}
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={handleAssign}
              disabled={selectedIds.length < 1}
              className={`
                glass-button-premium px-6 py-3 font-bold
                ${selectedIds.length < 1 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:scale-105'
                }
              `}
            >
              ✅ Asignar Problemas
            </button>
          </div>
        </div>
        
        {selectedIds.length < 1 && (
          <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
            <p className="text-yellow-300 text-sm flex items-center">
              ⚠️ Debes seleccionar al menos 1 problema para continuar
            </p>
          </div>
        )}
      </div>
    </div>
  );
}