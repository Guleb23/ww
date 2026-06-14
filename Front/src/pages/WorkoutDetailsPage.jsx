import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { axiosClient } from "../api/axiosClient";

export const WorkoutDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [workout, setWorkout] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [workoutExercises, setWorkoutExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    exerciseId: "",
    sets: 3,
    reps: 10,
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [workoutRes, wexRes, exRes] = await Promise.all([
        axiosClient.get(`/api/workouts/${id}`),
        axiosClient.get(`/api/workoutexercises/by-workout/${id}`),
        axiosClient.get("/api/exercises"),
      ]);
      setWorkout(workoutRes.data);
      setWorkoutExercises(wexRes.data);
      setExercises(exRes.data);
    } catch (err) {
      console.error(err);
      setError("Не удалось загрузить данные тренировки");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [id]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddExercise = async (e) => {
    e.preventDefault();
    if (!form.exerciseId) return;
    setSaving(true);
    setError("");
    try {
      await axiosClient.post("/api/workoutexercises", {
        workoutId: id,
        exerciseId: form.exerciseId,
        sets: Number(form.sets),
        reps: Number(form.reps),
        notes: form.notes || null,
      });
      setForm({ exerciseId: "", sets: 3, reps: 10, notes: "" });
      await loadData();
    } catch (err) {
      console.error(err);
      setError("Не удалось добавить упражнение в тренировку");
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (we) => {
    if (!window.confirm("Удалить упражнение из тренировки?")) return;
    try {
      await axiosClient.delete(`/api/workoutexercises/${we.id}`);
      await loadData();
    } catch (err) {
      console.error(err);
      alert("Не удалось удалить упражнение из тренировки");
    }
  };

  const getExerciseName = (exerciseId) => {
    const ex = exercises.find((e) => e.id === exerciseId);
    return ex ? ex.name : exerciseId;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-600 border-t-sky-500" />
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-red-400">Тренировка не найдена.</p>
        <button
          onClick={() => navigate(-1)}
          className="rounded-md bg-slate-800 px-3 py-2 text-sm text-slate-100 hover:bg-slate-700"
        >
          Назад
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {workout.name}
          </h1>
          {workout.description && (
            <p className="text-sm text-slate-400 mt-2">{workout.description}</p>
          )}
          <p className="text-xs text-slate-500 mt-1">
            Создано:{" "}
            {workout.createdDate
              ? new Date(workout.createdDate).toLocaleString("ru-RU")
              : "неизвестно"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {workoutExercises.length > 0 && (
            <Link
              to={`/workouts/${id}/session`}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-3 text-sm font-bold text-white hover:from-emerald-500 hover:to-emerald-400 shadow-lg shadow-emerald-500/25 transition-all duration-200 transform hover:scale-105"
            >
              🏋️ Начать тренировку
            </Link>
          )}
          <Link
            to="/workouts"
            className="rounded-lg bg-slate-800/80 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700 transition-all duration-200"
          >
            ← Ко всем тренировкам
          </Link>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-400 bg-red-950/40 border border-red-800 rounded px-3 py-2">
          {error}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[2fr,1.2fr]">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-100">
              Упражнения в тренировке ({workoutExercises.length})
            </h2>
            {workoutExercises.length > 0 && (
              <Link
                to={`/workouts/${id}/session`}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
              >
                🏋️ Начать →
              </Link>
            )}
          </div>
          {workoutExercises.length === 0 ? (
            <div className="rounded-xl border border-slate-800/50 bg-slate-900/30 p-8 text-center">
              <p className="text-sm text-slate-400">
                В эту тренировку ещё не добавлены упражнения.
              </p>
              <p className="text-xs text-slate-500 mt-2">
                Добавьте упражнения справа, чтобы начать тренировку
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {workoutExercises
                .sort((a, b) => a.order - b.order)
                .map((we, idx) => {
                  const exercise = exercises.find((e) => e.id === we.exerciseId);
                  return (
                    <li
                      key={we.id}
                      className="group rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-sm p-4 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-xs font-bold text-white">
                              {idx + 1}
                            </span>
                            <span className="font-bold text-base text-slate-100">
                              {exercise?.name || getExerciseName(we.exerciseId)}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-slate-400">
                            <span className="flex items-center gap-1">
                              🔥 <span className="font-mono font-semibold text-purple-400">{we.sets}</span> подходов
                            </span>
                            <span className="flex items-center gap-1">
                              💪 <span className="font-mono font-semibold text-pink-400">{we.reps}</span> повторений
                            </span>
                          </div>
                          {we.notes && (
                            <p className="text-xs text-slate-400 mt-2 italic">📝 {we.notes}</p>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemove(we)}
                          className="rounded-lg bg-red-700/60 px-3 py-1.5 text-xs font-medium text-red-50 hover:bg-red-600 transition-all duration-200 opacity-0 group-hover:opacity-100"
                        >
                          🗑️
                        </button>
                      </div>
                    </li>
                  );
                })}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/90 to-slate-950/90 backdrop-blur-sm p-6 shadow-xl text-sm">
          <h2 className="text-base font-bold mb-4 text-slate-100">
            ➕ Добавить упражнение в тренировку
          </h2>
          <form onSubmit={handleAddExercise} className="space-y-3">
            <div>
              <label className="block mb-1" htmlFor="exerciseId">
                Упражнение
              </label>
              <select
                id="exerciseId"
                name="exerciseId"
                value={form.exerciseId}
                onChange={handleFormChange}
                className="w-full rounded-lg border border-slate-700/50 bg-slate-950/80 px-4 py-2.5 text-slate-100 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                required
              >
                <option value="">Выберите упражнение</option>
                {exercises.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1" htmlFor="sets">
                  Подходы
                </label>
                <input
                  id="sets"
                  name="sets"
                  type="number"
                  min={1}
                  value={form.sets}
                  onChange={handleFormChange}
                  className="w-full rounded-lg border border-slate-700/50 bg-slate-950/80 px-4 py-2.5 text-slate-100 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block mb-1" htmlFor="reps">
                  Повторения
                </label>
                <input
                  id="reps"
                  name="reps"
                  type="number"
                  min={1}
                  value={form.reps}
                  onChange={handleFormChange}
                  className="w-full rounded-lg border border-slate-700/50 bg-slate-950/80 px-4 py-2.5 text-slate-100 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                />
              </div>
            </div>
            <div>
              <label className="block mb-1" htmlFor="notes">
                Заметки (необязательно)
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                value={form.notes}
                onChange={handleFormChange}
                className="w-full rounded-lg border border-slate-700/50 bg-slate-950/80 px-4 py-2.5 text-slate-100 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-3 text-sm font-semibold text-white hover:from-purple-500 hover:to-pink-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25 transition-all duration-200 transform hover:scale-105 disabled:transform-none"
            >
              {saving ? "⏳ Добавляем..." : "✨ Добавить упражнение"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

