// client/src/components/Ranking.jsx

import React, { useEffect, useState } from "react";
import { maratones } from "../api";

export default function Ranking({ currentUser, maraton, onBack }) {
  const [listaParticipantes, setListaParticipantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all"); // 'all', 'estudiante', 'profesor', 'admin'

  useEffect(() => {
    (async () => {
      try {
        const res = await maratones.getParticipantesDeMaraton(maraton._id);
        setListaParticipantes(res);
      } catch (error) {
        setErr(error.message || "Error al cargar participantes.");
      } finally {
        setLoading(false);
      }
    })();
  }, [maraton]);

  const handleRemove = async (userId) => {
    if (
      !window.confirm(
        "¿Está seguro que desea eliminar a este participante de la maratón?"
      )
    )
      return;
    try {
      await maratones.removeParticipanteDeMaraton(maraton._id, userId);
      // Remover localmente
      setListaParticipantes((prev) =>
        prev.filter((u) => u._id !== userId)
      );
    } catch (error) {
      alert(error.message || "Error al eliminar participante.");
    }
  };

  // Filtrado por búsqueda
  const filtered = listaParticipantes
    .filter((u) => {
      const matchesSearch =
        u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole =
        filterRole === "all" || u.role === filterRole;
      return matchesSearch && matchesRole;
    });

  if (loading) {
    return (
      <div className="min-h-screen premium-background flex items-center justify-center">
        <div className="glass-card-premium glass-card-lg text-center">
          <div className="premium-loader mb-4"></div>
          <p className="text-xl text-slate-300">Cargando ranking…</p>
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="min-h-screen premium-background flex items-center justify-center">
        <div className="glass-card-premium glass-card-lg text-center max-w-md">
          <div className="status-badge error mb-4">
            <span>Error</span>
          </div>
          <p className="text-lg text-slate-300 mb-6">{err}</p>
          <button onClick={onBack} className="glass-button-premium">
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
            Ranking de Participantes
          </h1>
          <p className="premium-subtitle">
            Maratón: <span className="text-yellow-300 font-semibold">{maraton.nombre}</span>
          </p>
        </div>

        {/* Main Content Card */}
        <div className="glass-card-premium glass-card-lg max-w-6xl mx-auto">
          
          {/* Search and Filter Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Buscar participante
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nombre, apellido o email"
                className="glass-input-premium w-full"
              />
            </div>
            <div className="md:w-48">
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Filtrar por rol
              </label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="glass-input-premium w-full"
              >
                <option value="all">Todos los roles</option>
                <option value="estudiante">Estudiante</option>
                <option value="profesor">Profesor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <div className="status-badge info">
              <span>{filtered.length} participante{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}</span>
            </div>
          </div>

          {/* Participants List */}
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 opacity-20">👥</div>
              <p className="text-xl text-slate-400 mb-2">No hay participantes</p>
              <p className="text-slate-500">
                {searchTerm || filterRole !== "all" 
                  ? "No se encontraron participantes con los filtros aplicados"
                  : "Aún no hay participantes inscritos en esta maratón"
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="glass-card bg-black/20 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300 uppercase tracking-wider">
                        Participante
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300 uppercase tracking-wider">
                        Rol
                      </th>
                      {currentUser.role === "admin" && (
                        <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300 uppercase tracking-wider">
                          Acciones
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filtered.map((u, index) => (
                      <tr key={u._id} className="hover:bg-white/5 transition-colors duration-200">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold mr-3">
                              {u.nombre.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-lg font-semibold text-white">
                                {u.nombre} {u.apellido}
                              </div>
                              <div className="text-sm text-slate-400">
                                Participante #{index + 1}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-slate-300">{u.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`status-badge ${
                            u.role === 'admin' ? 'error' : 
                            u.role === 'profesor' ? 'warning' : 'info'
                          }`}>
                            {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                          </span>
                        </td>
                        {currentUser.role === "admin" && (
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleRemove(u._id)}
                              className="glass-button-danger px-4 py-2 text-sm rounded-lg transition-all duration-200 hover:scale-105"
                              style={{
                                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.8), rgba(248, 113, 113, 0.8))',
                                boxShadow: '0 4px 15px rgba(239, 68, 68, 0.2)',
                                color: 'white',
                                border: 'none',
                                cursor: 'pointer'
                              }}
                            >
                              Eliminar
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Back Button */}
          <div className="mt-8 text-center">
            <button onClick={onBack} className="glass-button-premium">
              ← Volver al Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}