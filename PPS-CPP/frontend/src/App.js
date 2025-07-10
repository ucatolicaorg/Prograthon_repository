import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import MarathonList from './components/MarathonList';
import MarathonDetail from './components/MarathonDetail';
import MyMarathons from './components/MyMarathons';
import CreateMarathon from './components/CreateMarathon';
import ProblemList from './components/ProblemList';
import ProblemDetail from './components/ProblemDetail';
import CreateProblem from './components/CreateProblem';
import UserList from './components/UserList';
import EditProfile from './components/EditProfile';

const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Cargando...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <div>Acceso Denegado</div>;
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Redirigir raíz al dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          {/* Maratones */}
          <Route
            path="/marathons"
            element={
              <PrivateRoute>
                <MarathonList />
              </PrivateRoute>
            }
          />
          <Route
            path="/marathons/:id"
            element={
              <PrivateRoute>
                <MarathonDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-marathons"
            element={
              <PrivateRoute roles={['student']}>
                <MyMarathons />
              </PrivateRoute>
            }
          />
          <Route
            path="/create-marathon"
            element={
              <PrivateRoute roles={['admin', 'professor']}>
                <CreateMarathon />
              </PrivateRoute>
            }
          />

          {/* Problemas */}
          <Route
            path="/problems"
            element={
              <PrivateRoute>
                <ProblemList />
              </PrivateRoute>
            }
          />
          <Route
            path="/problems/:id"
            element={
              <PrivateRoute>
                <ProblemDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/create-problem"
            element={
              <PrivateRoute roles={['admin', 'professor']}>
                <CreateProblem />
              </PrivateRoute>
            }
          />

          {/* Usuarios */}
          <Route
            path="/users"
            element={
              <PrivateRoute>
                <UserList />
              </PrivateRoute>
            }
          />

          {/* Perfil */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <EditProfile />
              </PrivateRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}