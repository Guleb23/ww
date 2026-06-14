import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosClient } from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";

export const WorkoutsPage = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    id: null,
    name: "",
    description: "",
    imageUrl: "",
  });
  const [saving, setSaving] = useState(false);

  const loadWorkouts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosClient.get("/api/workouts");
      setItems(res.data);
    } catch (err) {
      console.error(err);
      setError("Не удалось загрузить тренировки");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadWorkouts();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) {
      await loadWorkouts();
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await axiosClient.get("/api/workouts/search", {
        params: { term: search },
      });
      setItems(res.data);
    } catch (err) {
      console.error(err);
      setError("Не удалось выполнить поиск тренировок");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      id: null,
      name: "",
      description: "",
      imageUrl: "",
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (workout) => {
    setForm({
      id: workout.id,
      name: workout.name,
      description: workout.description ?? "",
      imageUrl: workout.imageUrl ?? "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Удалить эту тренировку?")) return;
    try {
      await axiosClient.delete(`/api/workouts/${id}`);
      await loadWorkouts();
    } catch (err) {
      console.error(err);
      alert("Не удалось удалить тренировку");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (form.id) {
        await axiosClient.put(`/api/workouts/${form.id}`, {
          name: form.name,
          description: form.description,
          imageUrl: form.imageUrl || null,
        });
      } else {
        // Т.к. backend требует userId, а мы его явно не знаем из токена,
        // временно попросим пользователя ввести GUID в prompt, если нет сохранённого.
        let storedUserId = localStorage.getItem("userId");
        if (!storedUserId) {
          storedUserId = window.prompt(
            "Enter your UserId (GUID) from backend to create workouts:"
          );
          if (!storedUserId) {
            setSaving(false);
            return;
          }
          localStorage.setItem("userId", storedUserId);
        }

        await axiosClient.post("/api/workouts", {
          name: form.name,
          description: form.description,
          imageUrl: form.imageUrl || null,
          userId: storedUserId,
        });
      }
      resetForm();
      await loadWorkouts();
    } catch (err) {
      console.error(err);
      setError("Не удалось сохранить тренировку");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            🏋️ Тренировки
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Просматривайте и редактируйте планы тренировок.
          </p>
        </div>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Поиск тренировок..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border border-slate-700/50 bg-slate-950/80 backdrop-blur-sm px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
          />
          <button
            type="submit"
            className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-2.5 text-sm font-medium text-white hover:from-purple-500 hover:to-pink-400 shadow-lg shadow-purple-500/25 transition-all duration-200 transform hover:scale-105"
          >
            🔍 Найти
          </button>
        </form>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr,1.2fr]">
        <section className="space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-600 border-t-sky-500" />
            </div>
          ) : error ? (
            <p className="text-sm text-red-400">{error}</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {items.map((w) => (
                <article
                  key={w.id}
                  className="group rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-sm p-5 flex flex-col gap-3 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 hover:bg-gradient-to-br hover:from-slate-900 hover:to-slate-950 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h2 className="font-bold text-base text-slate-100 group-hover:text-purple-300 transition-colors">
                        {w.name}
                      </h2>
                      {w.description && (
                        <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                          {w.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(w)}
                        className="rounded-lg bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-100 hover:bg-purple-600 hover:text-white transition-all duration-200 shadow-sm"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(w.id)}
                        className="rounded-lg bg-red-700/60 px-3 py-1.5 text-xs font-medium text-red-50 hover:bg-red-600 hover:text-white transition-all duration-200 shadow-sm"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800/50">
                    <span className="flex items-center gap-1">
                      👤 {w.userId ? w.userId.substring(0, 8) + "..." : "н/д"}
                    </span>
                    <span className="flex items-center gap-1">
                      📅 {w.createdDate
                        ? new Date(w.createdDate).toLocaleDateString("ru-RU")
                        : ""}
                    </span>
                  </div>
                  <div className="flex justify-end mt-2">
                    <Link
                      to={`/workouts/${w.id}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors group/link"
                    >
                      Подробнее
                      <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                    </Link>
                  </div>
                </article>
              ))}
              {items.length === 0 && (
                <p className="text-sm text-slate-400">Тренировки не найдены.</p>
              )}
            </div>
          )}
        </section>

        <section className="rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/90 to-slate-950/90 backdrop-blur-sm p-6 shadow-xl">
          <h2 className="text-base font-bold mb-4 text-slate-100">
            {form.id ? "✏️ Редактировать тренировку" : "➕ Создать тренировку"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-3 text-sm">
            <div>
              <label className="block mb-1" htmlFor="name">
                Название
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleFormChange}
                required
                className="w-full rounded-lg border border-slate-700/50 bg-slate-950/80 px-4 py-2.5 text-slate-100 placeholder:text-slate-500 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block mb-1" htmlFor="description">
                Описание
              </label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleFormChange}
                rows={3}
                className="w-full rounded-lg border border-slate-700/50 bg-slate-950/80 px-4 py-2.5 text-slate-100 placeholder:text-slate-500 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block mb-1" htmlFor="imageUrl">
                URL изображения
              </label>
              <input
                id="imageUrl"
                name="imageUrl"
                type="text"
                value={form.imageUrl}
                onChange={handleFormChange}
                className="w-full rounded-lg border border-slate-700/50 bg-slate-950/80 px-4 py-2.5 text-slate-100 placeholder:text-slate-500 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 resize-none"
              />
            </div>
            {error && (
              <p className="text-xs text-red-400 bg-red-950/40 border border-red-800 rounded px-3 py-2">
                {error}
              </p>
            )}
            <div className="flex justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-slate-700/50 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800/50 hover:border-slate-600 transition-all duration-200"
              >
                Сбросить
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-2 text-sm font-semibold text-white hover:from-purple-500 hover:to-pink-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25 transition-all duration-200 transform hover:scale-105 disabled:transform-none"
              >
                {saving
                  ? "⏳ Сохранение..."
                  : form.id
                  ? "💾 Обновить тренировку"
                  : "✨ Создать тренировку"}
              </button>
            </div>
            {!user && (
              <p className="mt-2 text-[11px] text-amber-400">
                Вы не авторизованы. Тренировки всё равно будут созданы, если вы введёте
                корректный UserId (GUID) из бэкенда, когда появится запрос.
              </p>
            )}
          </form>
        </section>
      </div>
    </div>
  );
};

