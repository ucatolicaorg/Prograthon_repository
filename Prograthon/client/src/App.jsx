// client/src/App.jsx

import { useState } from "react";
import "./App.css";
import "./index.css";

import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import UserList from "./components/UserList";
import EditProfile from "./components/EditProfile";
import Navbar from "./components/Navbar";

import MaratonesMenu from "./components/MaratonesMenu";
import CreateMaraton from "./components/CreateMaraton";
import ViewMaratones from "./components/ViewMaratones";
import MaratonDetail from "./components/MaratonDetail";

import ProblemasMenu from "./components/ProblemasMenu";
import CreateProblema from "./components/CreateProblema";
import AssignProblemas from "./components/AssignProblemas";
import VerProblemasMaraton from "./components/VerProblemasMaraton";

import StudentMaratonesMenu from "./components/StudentMaratonesMenu";
import StudentViewMaratones from "./components/StudentViewMaratones";
import StudentMaratonDetail from "./components/StudentMaratonDetail";

import Ranking from "./components/Ranking";

import { getCurrentUser, maratones } from "./api";

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState("login");
  const [editingUser, setEditingUser] = useState(null);
  const [selectedMaraton, setSelectedMaraton] = useState(null);

  // 1) Obtener usuario actual y pasar a “profile”
  const handleLogin = async () => {
    try {
      const u = await getCurrentUser();
      setUser(u);
      setCurrentView("profile");
    } catch {
      setUser(null);
      setCurrentView("login");
    }
  };

  // 2) Logout
  const handleLogout = () => {
    setUser(null);
    setCurrentView("login");
  };

  // 3) Editar usuario
  const handleEditUser = (userData) => {
    setEditingUser(userData);
    setCurrentView("edit-profile");
  };
  const handleUpdateUser = () => {
    setEditingUser(null);
    setCurrentView("profile");
    getCurrentUser().then((u) => setUser(u));
  };

  // 4) Vistas de Maratones para Admin/Profesor y Estudiante
  const handleOpenMaratonesMenu = () => {
    if (user.role === "estudiante") {
      setCurrentView("student-maratones-menu");
    } else {
      setCurrentView("maratones-menu");
    }
  };

  const handleGoCreateMaraton = () => {
    setCurrentView("create-maraton");
  };
  const handleGoViewMaratones = () => {
    setCurrentView("view-maratones");
  };
  const handleSelectMaraton = (maraton) => {
    setSelectedMaraton(maraton);
    setCurrentView("maraton-detail");
  };

  // 5) Vistas de Problemas (Admin/Profesor)
  const handleOpenProblemasMenu = () => {
    setCurrentView("problemas-menu");
  };
  const handleGoCreateProblema = () => {
    setCurrentView("create-problema");
  };

  // 6) Vistas de Estudiante: Inscribirse y detalle de maratón
  const handleGoStudentViewMaratones = () => {
    setCurrentView("student-view-maratones");
  };
  const handleSelectStudentMaraton = (maraton) => {
    setSelectedMaraton(maraton);
    (async () => {
      try {
        await maratones.inscribir(maraton._id);
        setCurrentView("student-maraton-detail");
      } catch (error) {
        alert(error.message || "Error al inscribirse.");
        setCurrentView("student-view-maratones");
      }
    })();
  };

  // 7) Ranking de participantes (para cualquiera)
  const handleGoRanking = (maraton) => {
    setSelectedMaraton(maraton);
    setCurrentView("ranking");
  };

  // ─────────────────────────────────────────────
  // Renderizar según currentView
  const renderCurrentView = () => {
    switch (currentView) {
      case "login":
        return (
          <Login
            onLogin={handleLogin}
            onSwitchToRegister={() => setCurrentView("register")}
          />
        );
      case "register":
        return (
          <Register
            onRegister={() => setCurrentView("login")}
            onSwitchToLogin={() => setCurrentView("login")}
          />
        );
      case "profile":
        return <Profile user={user} onEdit={() => handleEditUser(user)} />;
      case "users":
        return <UserList onEditUser={handleEditUser} />;
      case "edit-profile":
        return (
          <EditProfile
            user={editingUser}
            currentUser={user}
            onUpdate={handleUpdateUser}
            onCancel={() => setCurrentView("profile")}
          />
        );

      // ─────────────────────────────────────────────
      // Vistas ADMIN / PROFESOR de MARATONES
      case "maratones-menu":
        return (
          <MaratonesMenu
            onCreate={handleGoCreateMaraton}
            onView={handleGoViewMaratones}
          />
        );
      case "create-maraton":
        return (
          <CreateMaraton
            onCancel={() => setCurrentView("maratones-menu")}
            onCreated={() => setCurrentView("view-maratones")}
          />
        );
      case "view-maratones":
        return (
          <ViewMaratones
            onBack={() => setCurrentView("maratones-menu")}
            onSelect={handleSelectMaraton}
          />
        );
      case "maraton-detail":
        return (
          <MaratonDetail
            maraton={selectedMaraton}
            currentUser={user}
            onBack={() => setCurrentView("view-maratones")}
            onAssignProblemas={(m) => {
              setSelectedMaraton(m);
              setCurrentView("assign-problemas");
            }}
            onViewProblemas={(m) => {
              setSelectedMaraton(m);
              setCurrentView("ver-problemas-maratón");
            }}
            onRanking={(m) => handleGoRanking(m)}
          />
        );
      case "assign-problemas":
        return (
          <AssignProblemas
            maraton={selectedMaraton}
            onBack={() => setCurrentView("maraton-detail")}
          />
        );
      case "ver-problemas-maratón":
        return (
          <VerProblemasMaraton
            maraton={selectedMaraton}
            onBack={() => setCurrentView("maraton-detail")}
          />
        );

      // ─────────────────────────────────────────────
      // RUTAS DE PROBLEMAS (Admin/Profesor)
      case "problemas-menu":
        return (
          <ProblemasMenu
            onCreate={handleGoCreateProblema}
            onBack={() => setCurrentView("profile")}
          />
        );
      case "create-problema":
        return (
          <CreateProblema
            onCancel={() => setCurrentView("problemas-menu")}
            onCreated={() => setCurrentView("problemas-menu")}
          />
        );

      // ─────────────────────────────────────────────
      // RUTAS DE ESTUDIANTE: INSCRIPCIÓN Y DETALLE
      case "student-maratones-menu":
        return (
          <StudentMaratonesMenu
            onInscribirse={handleGoStudentViewMaratones}
            onBack={() => setCurrentView("profile")}
          />
        );
      case "student-view-maratones":
        return (
          <StudentViewMaratones
            onBack={() => setCurrentView("student-maratones-menu")}
            onSelect={handleSelectStudentMaraton}
          />
        );
      case "student-maraton-detail":
        return (
          <StudentMaratonDetail
            maraton={selectedMaraton}
            onBack={() => setCurrentView("student-view-maratones")}
            onRanking={() => handleGoRanking(selectedMaraton)}
          />
        );

      // ─────────────────────────────────────────────
      // RANKING (Estudiante / Profesor / Admin)
      case "ranking":
        return (
          <Ranking
            currentUser={user}
            maraton={selectedMaraton}
            onBack={() => {
              if (user.role === "estudiante") {
                setCurrentView("student-maraton-detail");
              } else {
                setCurrentView("maraton-detail");
              }
            }}
          />
        );

      default:
        return (
          <Login
            onLogin={handleLogin}
            onSwitchToRegister={() => setCurrentView("register")}
          />
        );
    }
  };

  return (
    <div className="app-container">
      {user && (
        <Navbar
          user={user}
          currentView={currentView}
          onViewChange={(v) => {
            if (v === "maratones-menu" && user.role === "estudiante") {
              setCurrentView("student-maratones-menu");
            } else {
              setCurrentView(v);
            }
          }}
          onLogout={handleLogout}
          onOpenMaratones={handleOpenMaratonesMenu}
          onOpenProblemas={handleOpenProblemasMenu}
        />
      )}
      <main className="main-content">{renderCurrentView()}</main>
    </div>
  );
}

export default App;
