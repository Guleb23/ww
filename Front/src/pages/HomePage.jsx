import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/90 via-slate-950/90 to-slate-900/90 backdrop-blur-sm p-8 md:p-10 shadow-2xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-sky-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Личный онлайн‑трекер тренировок
        </h1>
        <p className="text-base md:text-lg text-slate-300 max-w-2xl mb-6 leading-relaxed">
          Собирайте собственный каталог упражнений, создавайте персональные планы тренировок
          и проходите их шаг за шагом с наглядными картинками, описаниями и счётчиком подходов.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/workouts"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-3 text-sm font-semibold text-white hover:from-purple-500 hover:to-pink-400 shadow-lg shadow-purple-500/25 transition-all duration-200 transform hover:scale-105"
          >
            🏋️ Список тренировок
          </Link>
          <Link
            to="/exercises"
            className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-700/50 bg-slate-900/50 backdrop-blur-sm px-6 py-3 text-sm font-semibold text-slate-100 hover:bg-slate-800/50 hover:border-sky-500/50 transition-all duration-200 transform hover:scale-105"
          >
            💪 Список упражнений
          </Link>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="group rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-sm p-6 hover:border-sky-500/50 hover:shadow-lg hover:shadow-sky-500/10 transition-all duration-300 transform hover:-translate-y-1">
          <div className="text-3xl mb-3">🔐</div>
          <h2 className="font-bold text-base mb-2 text-slate-100 group-hover:text-sky-400 transition-colors">
            Безопасный личный кабинет
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Регистрация и вход с защитой токенами: ваши данные и прогресс доступны только вам.
          </p>
        </div>
        <div className="group rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-sm p-6 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 transform hover:-translate-y-1">
          <div className="text-3xl mb-3">💪</div>
          <h2 className="font-bold text-base mb-2 text-slate-100 group-hover:text-purple-400 transition-colors">
            Гибкие планы тренировок
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Собирайте тренировки из своих упражнений, задавайте подходы, повторения и заметки под свои цели.
          </p>
        </div>
        <div className="group rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-sm p-6 hover:border-pink-500/50 hover:shadow-lg hover:shadow-pink-500/10 transition-all duration-300 transform hover:-translate-y-1">
          <div className="text-3xl mb-3">⚡</div>
          <h2 className="font-bold text-base mb-2 text-slate-100 group-hover:text-pink-400 transition-colors">
            Удобный режим сессии
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Запускайте тренировку и проходите её шаг за шагом: описание, картинки, GIF и параметры каждого упражнения.
          </p>
        </div>
      </section>

      {!user && (
        <section className="rounded-lg border border-amber-700/60 bg-amber-950/40 p-4 text-xs text-amber-100">
          <p className="mb-1">
            Войдите или зарегистрируйтесь, чтобы сохранять свои тренировки и возвращаться к ним с любого устройства.
          </p>
          <p className="text-amber-300/80">
            После авторизации вы сможете создавать личные планы и проходить их в интерактивном режиме.
          </p>
        </section>
      )}
    </div>
  );
};

