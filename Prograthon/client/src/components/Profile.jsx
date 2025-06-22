import React from "react";

export default function Profile({ user, onEdit }) {
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card-premium p-8 text-center ambient-glow">
          <div className="premium-loader mb-6"></div>
          <div className="text-xl font-semibold text-white/90">Cargando perfil...</div>
          <div className="text-sm text-white/60 mt-2">Por favor espera un momento</div>
        </div>
      </div>
    );
  }

  // Función para obtener el color del badge según el rol
  const getRoleBadgeColor = (role) => {
    switch(role) {
      case 'admin':
        return 'bg-gradient-to-r from-orange-500/20 to-amber-600/20 border-orange-400/40 text-orange-200';
      case 'profesor':
        return 'bg-gradient-to-r from-cyan-500/20 to-teal-600/20 border-cyan-400/40 text-cyan-200';
      case 'estudiante':
        return 'bg-gradient-to-r from-emerald-500/20 to-teal-600/20 border-emerald-400/40 text-emerald-200';
      default:
        return 'bg-gradient-to-r from-emerald-500/20 to-teal-600/20 border-emerald-400/40 text-emerald-200';
    }
  };

  // Función para obtener el color del avatar según el rol
  const getAvatarColor = (role) => {
    switch(role) {
      case 'admin':
        return 'from-orange-500 via-amber-500 to-yellow-500';
      case 'profesor':
        return 'from-cyan-500 via-teal-500 to-blue-500';
      case 'estudiante':
        return 'from-emerald-500 via-teal-500 to-cyan-400';
      default:
        return 'from-emerald-500 via-teal-500 to-cyan-400';
    }
  };

  // Función para obtener el ícono según el rol
  const getRoleIcon = (role) => {
    switch(role) {
      case 'admin':
        return (
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.661 2.237a.531.531 0 01.678 0 11.947 11.947 0 007.078 2.749.5.5 0 01.479.425c.069.52.104 1.05.104 1.589 0 5.162-3.26 9.563-7.834 11.256a.48.48 0 01-.332 0C5.26 16.564 2 12.162 2 7c0-.538.035-1.069.104-1.589a.5.5 0 01.48-.425 11.947 11.947 0 007.077-2.749z" clipRule="evenodd" />
          </svg>
        );
      case 'profesor':
        return (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          </svg>
        );
      case 'estudiante':
        return (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      default:
        return (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
    }
  };

  // Función para obtener el nivel de acceso
  const getAccessLevel = (role) => {
    switch(role) {
      case 'admin':
        return { level: 'Alto', percentage: 100, label: 'ADM' };
      case 'profesor':
        return { level: 'Medio', percentage: 75, label: 'PRF' };
      case 'estudiante':
        return { level: 'Básico', percentage: 50, label: 'EST' };
      default:
        return { level: 'Básico', percentage: 50, label: 'EST' };
    }
  };

  // Función para obtener colores de botones según rol
  const getRoleButtonColors = (role) => {
    switch(role) {
      case 'admin':
        return 'from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700';
      case 'profesor':
        return 'from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700';
      case 'estudiante':
        return 'from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700';
      default:
        return 'from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700';
    }
  };

  // Función para obtener colores específicos del rol
  const getRoleColors = (role) => {
    switch(role) {
      case 'admin':
        return {
          primary: 'from-orange-500 to-amber-600',
          secondary: 'from-orange-400 to-amber-500',
          text: 'text-orange-400',
          bg: 'from-orange-500/20 to-amber-600/20',
          border: 'border-orange-500/30',
          glow: 'shadow-orange-500/30'
        };
      case 'profesor':
        return {
          primary: 'from-cyan-500 to-blue-600',
          secondary: 'from-cyan-400 to-blue-500',
          text: 'text-cyan-400',
          bg: 'from-cyan-500/20 to-blue-600/20',
          border: 'border-cyan-500/30',
          glow: 'shadow-cyan-500/30'
        };
      case 'estudiante':
        return {
          primary: 'from-emerald-500 to-teal-600',
          secondary: 'from-emerald-400 to-teal-500',
          text: 'text-emerald-400',
          bg: 'from-emerald-500/20 to-teal-600/20',
          border: 'border-emerald-500/30',
          glow: 'shadow-emerald-500/30'
        };
      default:
        return {
          primary: 'from-emerald-500 to-teal-600',
          secondary: 'from-emerald-400 to-teal-500',
          text: 'text-emerald-400',
          bg: 'from-emerald-500/20 to-teal-600/20',
          border: 'border-emerald-500/30',
          glow: 'shadow-emerald-500/30'
        };
    }
  };

  const accessInfo = getAccessLevel(user.role);
  const roleColors = getRoleColors(user.role);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 premium-background">
      <div className="w-full max-w-4xl">
        {/* Header minimalista y elegante */}
        <div className="text-center mb-12 fade-in">
          <div className="relative inline-block">
            <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent drop-shadow-2xl">
              Mi Perfil
            </h1>
            {/* Efecto de brillo contenido */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-pulse opacity-0 hover:opacity-100 transition-opacity duration-1000"></div>
          </div>
          <p className="text-lg text-white/70 font-medium max-w-md mx-auto">
            Información personal y configuración académica
          </p>
          
          {/* Línea decorativa animada */}
          <div className="flex justify-center mt-6">
            <div className={`h-1 w-24 rounded-full bg-gradient-to-r ${roleColors.primary} shadow-lg transition-all duration-500 hover:w-32`}></div>
          </div>
        </div>

        {/* Contenedor principal con layout mejorado */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 fade-in">
          
          {/* Columna izquierda - Avatar y info básica */}
          <div className="lg:col-span-1">
            <div className="glass-card-premium p-8 text-center ambient-glow h-fit sticky top-8">
              {/* Avatar mejorado con efectos 3D */}
              <div className="relative mb-8">
                <div className="relative inline-block group">
                  <div className={`w-40 h-40 mx-auto rounded-full bg-gradient-to-br ${getAvatarColor(user.role)} flex items-center justify-center text-4xl font-bold text-white shadow-2xl relative overflow-hidden group-hover:scale-110 transition-all duration-700 hover:rotate-3`}>
                    {/* Efecto de brillo elegante */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    {/* Iniciales con sombra */}
                    <span className="relative z-10 drop-shadow-xl text-5xl">
                      {user.nombre.charAt(0).toUpperCase()}
                      {user.apellido.charAt(0).toUpperCase()}
                    </span>
                    {/* Anillos decorativos */}
                    <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-pulse"></div>
                    <div className={`absolute -inset-1 rounded-full border-2 bg-gradient-to-r ${roleColors.primary} opacity-20 animate-spin`} style={{animationDuration: '8s'}}></div>
                  </div>
                  
                  {/* Indicador de estado con micro-interacciones */}
                  <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full border-4 border-white shadow-xl flex items-center justify-center bg-emerald-500 hover:scale-125 transition-all duration-300 cursor-pointer group/status">
                    <div className="absolute inset-0 rounded-full animate-ping opacity-75 bg-emerald-400 group-hover/status:animate-bounce"></div>
                    <div className="relative w-5 h-5 bg-white rounded-full shadow-inner"></div>
                  </div>
                </div>
              </div>

              {/* Nombre con tipografía mejorada */}
              <div className="mb-6">
                <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent drop-shadow-lg">
                  {user.nombre} {user.apellido}
                </h2>
                
                {/* Email con mejor diseño */}
                <div className="flex items-center justify-center gap-3 text-white/80 hover:text-white transition-colors duration-300 group cursor-pointer mb-4">
                  <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-all duration-300">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                    </svg>
                  </div>
                  <span className="font-medium">{user.email}</span>
                </div>

                {/* Información de rol y nivel de acceso */}
                <div className="space-y-3">
                  {/* Badge de rol premium */}
                  <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-xl border backdrop-filter backdrop-blur-12 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl ${getRoleBadgeColor(user.role)} hover:${roleColors.glow}`}>
                    <div className={`p-2 rounded-lg bg-gradient-to-r shadow-md transition-all duration-300 ${roleColors.primary}`}>
                      {getRoleIcon(user.role)}
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-sm capitalize">
                        {user.role === 'admin' && 'Administrador'}
                        {user.role === 'profesor' && 'Profesor'}
                        {user.role === 'estudiante' && 'Estudiante'}
                      </div>
                      <div className="text-xs opacity-80 font-medium">
                        {user.role === 'admin' && 'Control total'}
                        {user.role === 'profesor' && 'Gestión académica'}
                        {user.role === 'estudiante' && 'Competitividad'}
                      </div>
                    </div>
                  </div>

                  {/* Nivel de acceso mejorado */}
                  <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-xl border backdrop-filter backdrop-blur-12 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl ${roleColors.bg} ${roleColors.border} hover:${roleColors.glow}`}>
                    <div className={`p-2 rounded-lg bg-gradient-to-r shadow-md transition-all duration-300 ${roleColors.primary}`}>
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className={`font-bold text-sm ${roleColors.text}`}>
                        Acceso {accessInfo.level}
                      </div>
                      <div className="text-xs opacity-80 font-medium">
                        {accessInfo.percentage}% de privilegios
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Estado de sesión mejorado */}
              <div className="flex items-center justify-center gap-2 text-emerald-400 font-semibold">
                <div className="relative">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-lg"></div>
                  <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-75"></div>
                </div>
                <span>En Línea</span>
              </div>
            </div>
          </div>

          {/* Columna derecha - Información detallada */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Información básica en grid elegante */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tarjeta de Edad */}
              <div className={`glass-card-premium p-6 hover:scale-105 transition-all duration-300 group border ${roleColors.border} hover:border-white/30 hover:${roleColors.glow} hover:shadow-xl`}>
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-all duration-500 bg-gradient-to-br ${roleColors.primary} shadow-lg hover:shadow-xl hover:${roleColors.glow}`}>
                    <svg className="w-8 h-8 text-white drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-white/60 font-medium mb-1">Edad</div>
                    <div className="text-3xl font-bold text-white">{user.edad}</div>
                    <div className="text-sm text-white/50">años</div>
                  </div>
                </div>
              </div>

              {/* Tarjeta de Rol */}
              <div className={`glass-card-premium p-6 hover:scale-105 transition-all duration-300 group border ${roleColors.border} hover:border-white/30 hover:${roleColors.glow} hover:shadow-xl`}>
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white group-hover:rotate-12 transition-all duration-500 bg-gradient-to-br ${roleColors.primary} shadow-lg hover:shadow-xl hover:${roleColors.glow}`}>
                    {getRoleIcon(user.role)}
                  </div>
                  <div>
                    <div className="text-sm text-white/60 font-medium mb-1">Rol</div>
                    <div className="text-2xl font-bold text-white capitalize">
                      {user.role}
                    </div>
                    <div className={`text-sm ${roleColors.text} font-medium opacity-80`}>Sistema</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Panel de estadísticas académicas rediseñado */}
            <div className={`glass-card-premium p-8 bg-gradient-to-r border shadow-xl hover:shadow-2xl transition-all duration-300 ${roleColors.bg} ${roleColors.border} relative overflow-hidden`}>
              {/* Decoración de fondo sutil */}
              <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl bg-gradient-to-br ${roleColors.primary} opacity-10`}></div>
              
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${roleColors.primary} shadow-lg`}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  Panel Académico
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {/* Nivel de Acceso */}
                  <div className="text-center group">
                    <div className="relative inline-block mb-4">
                      <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-500 bg-gradient-to-r ${roleColors.primary} shadow-xl hover:shadow-2xl hover:${roleColors.glow}`}>
                        <svg className="w-12 h-12 text-white drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                      </div>
                    </div>
                    <div className={`text-2xl font-bold mb-2 ${roleColors.text}`}>
                      {accessInfo.level}
                    </div>
                    <div className="text-sm text-white/70 font-medium">Nivel de Acceso</div>
                  </div>

                  {/* Estado del Perfil */}
                  <div className="text-center group">
                    <div className="relative inline-block mb-4">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/30">
                        <svg className="w-12 h-12 text-white drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-emerald-400 mb-2">100%</div>
                    <div className="text-sm text-white/70 font-medium">Perfil Completo</div>
                  </div>

                  {/* Actividad */}
                  <div className="text-center group">
                    <div className="relative inline-block mb-4">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-blue-500/30">
                        <svg className="w-12 h-12 text-white drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-blue-400 mb-2">Activo</div>
                    <div className="text-sm text-white/70 font-medium">Estado Online</div>
                  </div>
                </div>

                {/* Barra de progreso mejorada */}
                <div className="bg-white/10 rounded-full h-6 overflow-hidden shadow-inner mb-4">
                  <div className={`h-full rounded-full bg-gradient-to-r ${getAvatarColor(user.role)} shadow-lg relative overflow-hidden transition-all duration-1000 hover:shadow-xl`}
                       style={{width: `${accessInfo.percentage}%`}}>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                  </div>
                </div>
                <div className="text-center text-sm text-white/70 font-medium">
                  Privilegios de acceso: <span className={`${roleColors.text} font-bold text-lg`}>{accessInfo.percentage}%</span>
                </div>
              </div>
            </div>

            {/* Botón de editar rediseñado */}
            <button
              className={`w-full py-6 text-xl font-bold group relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-2xl bg-gradient-to-r text-white shadow-xl hover:${roleColors.glow} ${getRoleButtonColors(user.role)} hover:-translate-y-1`}
              onClick={() => onEdit(user)}
            >
              <span className="flex items-center justify-center gap-4 relative z-10">
                <div className="p-3 rounded-xl bg-white/20 group-hover:bg-white/30 transition-all duration-300 group-hover:rotate-12">
                  <svg className="w-6 h-6 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                Editar Perfil Académico
              </span>
              
              {/* Efecto de ondas mejorado */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              
              {/* Partículas decorativas reducidas */}
              <div className="absolute top-4 right-8 w-1 h-1 bg-white/30 rounded-full animate-pulse"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}