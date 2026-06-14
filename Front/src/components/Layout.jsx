import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        isActive
          ? "bg-gradient-to-r from-sky-600 to-sky-500 text-white shadow-lg shadow-sky-500/25"
          : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
      }`
    }
  >
    {children}
  </NavLink>
);

export const Layout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-800/50 bg-slate-950/90 backdrop-blur-md shadow-lg">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <span className="h-10 w-10 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-sky-500/30 group-hover:scale-110 transition-transform duration-200">
              💪
            </span>
            <span className="font-bold text-lg bg-gradient-to-r from-sky-400 to-purple-400 bg-clip-text text-transparent">
              Трекер тренировок
            </span>
          </Link>
          <nav className="flex items-center gap-2">
            <NavItem to="/exercises">💪 Упражнения</NavItem>
            <NavItem to="/workouts">🏋️ Тренировки</NavItem>
          </nav>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-slate-300 hidden md:inline">
                  Вы вошли как{" "}
                  <span className="font-semibold text-sky-400">{user.username}</span>
                </span>
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-800/80 text-slate-100 hover:bg-red-600 hover:text-white transition-all duration-200 shadow-sm"
                >
                  Выйти
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800/50 transition-all duration-200"
                >
                  Войти
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-sky-600 to-sky-500 text-white hover:from-sky-500 hover:to-sky-400 shadow-lg shadow-sky-500/25 transition-all duration-200 transform hover:scale-105"
                >
                  Регистрация
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <Outlet />
        </div>
      </main>
      <footer className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        JWT Fitness App &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

