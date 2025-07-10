import React, { useEffect, useState } from 'react';
import { marathons } from '../services/api';
import { Link } from 'react-router-dom';

export default function MyMarathons() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    marathons.getMyMarathons()
      .then(r => setList(r.data.marathons))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen premium-background flex items-center justify-center">
        <div className="glass-card-premium p-8 text-center">
          <div className="premium-loader mb-4"></div>
          <p className="text-lg text-gray-300">Cargando tus maratones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen premium-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-12 fade-in">
          <h1 className="premium-title mb-4">Mis Maratones</h1>
          <p className="premium-subtitle mb-8">
            Explora y gestiona todos los maratones en los que estás inscrito
          </p>
          
          {/* Navigation */}
          <div className="flex justify-center mb-8">
            <Link to="/dashboard" className="nav-link-premium inline-flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver al Dashboard
            </Link>
          </div>
        </div>

        {/* Marathons Grid */}
        {list.length === 0 ? (
          <div className="text-center py-16 fade-in">
            <div className="glass-card-premium p-12 max-w-md mx-auto">
              <div className="mb-6">
                <svg className="w-16 h-16 mx-auto text-purple-400 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-200">No tienes maratones registrados</h3>
              <p className="text-gray-400 mb-6">
                Parece que aún no te has inscrito en ningún maratón. ¡Comienza tu aventura ahora!
              </p>
              <Link to="/marathons" className="glass-button-premium">
                Explorar Maratones
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map((m, index) => (
              <div 
                key={m.id} 
                className="glass-card-premium p-6 fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Marathon Header */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-white truncate flex-1 mr-2">
                      {m.name}
                    </h3>
                    <div className="status-badge">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Inscrito
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-2">
                    {m.description}
                  </p>
                </div>

                {/* Registration Info */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Inscrito el {new Date(m.registered_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-400 mt-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{new Date(m.registered_at).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-4 border-t border-gray-600">
                  <Link 
                    to={`/marathons/${m.id}`} 
                    className="glass-button w-full group"
                  >
                    <span className="flex items-center justify-center gap-2">
                      Ver Detalles
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Section */}
        {list.length > 0 && (
          <div className="mt-12 fade-in">
            <div className="glass-card-premium p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4 text-gray-200">Estadísticas de Participación</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-2">{list.length}</div>
                    <div className="text-sm text-gray-400">Maratones Inscritos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">
                      {list.filter(m => new Date(m.registered_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
                    </div>
                    <div className="text-sm text-gray-400">Últimos 30 días</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      {new Date().getFullYear()}
                    </div>
                    <div className="text-sm text-gray-400">Año Actual</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* Estilos adicionales específicos para este componente */
const additionalStyles = `
  /* Utilities que reemplazan Tailwind */
  .min-h-screen { min-height: 100vh; }
  .container { width: 100%; }
  .mx-auto { margin-left: auto; margin-right: auto; }
  .px-4 { padding-left: 1rem; padding-right: 1rem; }
  .py-8 { padding-top: 2rem; padding-bottom: 2rem; }
  .max-w-6xl { max-width: 72rem; }
  .max-w-md { max-width: 28rem; }
  .text-center { text-align: center; }
  .mb-4 { margin-bottom: 1rem; }
  .mb-6 { margin-bottom: 1.5rem; }
  .mb-8 { margin-bottom: 2rem; }
  .mb-12 { margin-bottom: 3rem; }
  .mt-2 { margin-top: 0.5rem; }
  .mt-12 { margin-top: 3rem; }
  .mr-1 { margin-right: 0.25rem; }
  .mr-2 { margin-right: 0.5rem; }
  .p-6 { padding: 1.5rem; }
  .p-8 { padding: 2rem; }
  .p-12 { padding: 3rem; }
  .pt-4 { padding-top: 1rem; }
  .py-16 { padding-top: 4rem; padding-bottom: 4rem; }
  .flex { display: flex; }
  .inline-flex { display: inline-flex; }
  .grid { display: grid; }
  .items-center { align-items: center; }
  .justify-center { justify-content: center; }
  .justify-between { justify-content: space-between; }
  .gap-2 { gap: 0.5rem; }
  .gap-6 { gap: 1.5rem; }
  .w-full { width: 100%; }
  .w-3 { width: 0.75rem; }
  .w-4 { width: 1rem; }
  .w-5 { width: 1.25rem; }
  .w-16 { width: 4rem; }
  .h-3 { height: 0.75rem; }
  .h-4 { height: 1rem; }
  .h-5 { height: 1.25rem; }
  .h-16 { height: 4rem; }
  .text-sm { font-size: 0.875rem; }
  .text-lg { font-size: 1.125rem; }
  .text-xl { font-size: 1.25rem; }
  .text-3xl { font-size: 1.875rem; }
  .font-bold { font-weight: 700; }
  .font-semibold { font-weight: 600; }
  .text-white { color: white; }
  .text-gray-200 { color: #e5e7eb; }
  .text-gray-300 { color: #d1d5db; }
  .text-gray-400 { color: #9ca3af; }
  .text-gray-600 { color: #4b5563; }
  .text-purple-400 { color: #a78bfa; }
  .text-blue-400 { color: #60a5fa; }
  .text-green-400 { color: #4ade80; }
  .leading-relaxed { line-height: 1.625; }
  .truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .flex-1 { flex: 1 1 0%; }
  .border-t { border-top-width: 1px; }
  .border-gray-600 { border-color: #4b5563; }
  .opacity-50 { opacity: 0.5; }
  .group:hover .group-hover\\:translate-x-1 { transform: translateX(0.25rem); }
  .transition-transform { transition-property: transform; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
  
  /* Grid responsive */
  .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
  
  @media (min-width: 768px) {
    .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .md\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  }
  
  @media (min-width: 1024px) {
    .lg\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  }
  
  /* Line clamp utility */
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

// Inyectar estilos en el head
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = additionalStyles;
  document.head.appendChild(styleElement);
}