import React, { useEffect, useState } from "react";
import { axiosClient } from "../api/axiosClient";

export const ExercisesPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const [form, setForm] = useState({
    id: null,
    name: "",
    description: "",
    imageUrl: "",
    gifUrl: "",
    instructions: "",
  });
  const [saving, setSaving] = useState(false);

  const loadExercises = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosClient.get("/api/exercises");
      setItems(res.data);
    } catch (err) {
      console.error(err);
      setError("Не удалось загрузить упражнения");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadExercises();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) {
      await loadExercises();
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await axiosClient.get("/api/exercises/search", {
        params: { term: search },
      });
      setItems(res.data);
    } catch (err) {
      console.error(err);
      setError("Не удалось выполнить поиск упражнений");
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
      gifUrl: "",
      instructions: "",
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCardClick = (exercise) => {
    setSelected(exercise);
  };

  const handleEdit = (exercise) => {
    setForm({
      id: exercise.id,
      name: exercise.name,
      description: exercise.description ?? "",
      imageUrl: exercise.imageUrl ?? "",
      gifUrl: exercise.gifUrl ?? "",
      instructions: exercise.instructions ?? "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Удалить это упражнение?")) return;
    try {
      await axiosClient.delete(`/api/exercises/${id}`);
      await loadExercises();
    } catch (err) {
      console.error(err);
      alert("Не удалось удалить упражнение");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (form.id) {
        await axiosClient.put(`/api/exercises/${form.id}`, {
          name: form.name,
          description: form.description,
          imageUrl: form.imageUrl || null,
          gifUrl: form.gifUrl || null,
          instructions: form.instructions || null,
        });
      } else {
        await axiosClient.post("/api/exercises", {
          name: form.name,
          description: form.description,
          imageUrl: form.imageUrl || null,
          gifUrl: form.gifUrl || null,
          instructions: form.instructions || null,
        });
      }
      resetForm();
      await loadExercises();
    } catch (err) {
      console.error(err);
      setError("Не удалось сохранить упражнение");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-400 to-sky-600 bg-clip-text text-transparent">
            💪 Упражнения
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Просматривайте и редактируйте каталог упражнений.
          </p>
        </div>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Поиск упражнений..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border border-slate-700/50 bg-slate-950/80 backdrop-blur-sm px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all duration-200"
          />
          <button
            type="submit"
            className="rounded-lg bg-gradient-to-r from-sky-600 to-sky-500 px-5 py-2.5 text-sm font-medium text-white hover:from-sky-500 hover:to-sky-400 shadow-lg shadow-sky-500/25 transition-all duration-200 transform hover:scale-105"
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
              {items.map((ex) => (
                <article
                  key={ex.id}
                  className="group rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-sm p-5 flex flex-col gap-3 hover:border-sky-500/50 hover:shadow-lg hover:shadow-sky-500/10 hover:bg-gradient-to-br hover:from-slate-900 hover:to-slate-950 cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
                  onClick={() => handleCardClick(ex)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h2 className="font-bold text-base text-slate-100 group-hover:text-sky-300 transition-colors">
                        {ex.name}
                      </h2>
                      {ex.description && (
                        <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                          {ex.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(ex);
                        }}
                        className="rounded-lg bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-100 hover:bg-sky-600 hover:text-white transition-all duration-200 shadow-sm"
                      >
                        ✏️
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(ex.id);
                        }}
                        className="rounded-lg bg-red-700/60 px-3 py-1.5 text-xs font-medium text-red-50 hover:bg-red-600 hover:text-white transition-all duration-200 shadow-sm"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {ex.imageUrl && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-sky-500/10 text-[11px] text-sky-400 border border-sky-500/20">
                        🖼️ Изображение
                      </span>
                    )}
                    {ex.gifUrl && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-purple-500/10 text-[11px] text-purple-400 border border-purple-500/20">
                        🎬 GIF
                      </span>
                    )}
                    {ex.instructions && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-500/10 text-[11px] text-emerald-400 border border-emerald-500/20">
                        📋 Инструкции
                      </span>
                    )}
                  </div>
                </article>
              ))}
              {items.length === 0 && (
                <p className="text-sm text-slate-400">Упражнения не найдены.</p>
              )}
            </div>
          )}
        </section>

        <section className="rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/90 to-slate-950/90 backdrop-blur-sm p-6 shadow-xl">
          <h2 className="text-base font-bold mb-4 text-slate-100">
            {form.id ? "✏️ Редактировать упражнение" : "➕ Создать упражнение"}
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
                className="w-full rounded-lg border border-slate-700/50 bg-slate-950/80 px-4 py-2.5 text-slate-100 placeholder:text-slate-500 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all duration-200"
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
                className="w-full rounded-lg border border-slate-700/50 bg-slate-950/80 px-4 py-2.5 text-slate-100 placeholder:text-slate-500 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all duration-200 resize-none"
              />
            </div>
            <div className="grid grid-cols-1 gap-3">
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
                  className="w-full rounded-lg border border-slate-700/50 bg-slate-950/80 px-4 py-2.5 text-slate-100 placeholder:text-slate-500 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block mb-1" htmlFor="gifUrl">
                  URL GIF
                </label>
                <input
                  id="gifUrl"
                  name="gifUrl"
                  type="text"
                  value={form.gifUrl}
                  onChange={handleFormChange}
                  className="w-full rounded-lg border border-slate-700/50 bg-slate-950/80 px-4 py-2.5 text-slate-100 placeholder:text-slate-500 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all duration-200"
                />
              </div>
            </div>
            <div>
              <label className="block mb-1" htmlFor="instructions">
                Инструкции
              </label>
              <textarea
                id="instructions"
                name="instructions"
                value={form.instructions}
                onChange={handleFormChange}
                rows={3}
                className="w-full rounded-lg border border-slate-700/50 bg-slate-950/80 px-4 py-2.5 text-slate-100 placeholder:text-slate-500 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all duration-200 resize-none"
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
                className="rounded-lg bg-gradient-to-r from-sky-600 to-sky-500 px-5 py-2 text-sm font-semibold text-white hover:from-sky-500 hover:to-sky-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-sky-500/25 transition-all duration-200 transform hover:scale-105 disabled:transform-none"
              >
                {saving
                  ? "⏳ Сохранение..."
                  : form.id
                  ? "💾 Обновить упражнение"
                  : "✨ Создать упражнение"}
              </button>
            </div>
          </form>
        </section>
      </div>

      {selected && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4 animate-in fade-in duration-200"
          onClick={() => setSelected(null)}
        >
          <div 
            className="max-w-3xl w-full rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8 relative shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="absolute right-6 top-6 rounded-full bg-slate-800/80 w-9 h-9 flex items-center justify-center text-lg text-slate-300 hover:bg-red-600 hover:text-white transition-all duration-200 shadow-lg hover:scale-110"
            >
              ✕
            </button>
            <h2 className="text-3xl font-bold mb-3 text-slate-100 pr-10">{selected.name}</h2>
            {selected.description && (
              <p className="text-base text-slate-300 mb-6 leading-relaxed">{selected.description}</p>
            )}
            <div className="grid gap-4 md:grid-cols-2 mb-6">
              {selected.imageUrl && (
                <div className="rounded-xl overflow-hidden border border-slate-800/50 shadow-lg">
                  <p className="text-xs font-semibold text-slate-400 mb-2 px-3 pt-3">🖼️ Изображение</p>
                  <img
                    src={selected.imageUrl}
                    alt={selected.name}
                    className="w-full object-cover max-h-80"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <div className="hidden text-center py-8 text-slate-500 text-sm">Изображение не загружено</div>
                </div>
              )}
              {selected.gifUrl && (
                <div className="rounded-xl overflow-hidden border border-slate-800/50 shadow-lg">
                  <p className="text-xs font-semibold text-slate-400 mb-2 px-3 pt-3">🎬 GIF анимация</p>
                  <img
                    src={selected.gifUrl}
                    alt={`${selected.name} GIF`}
                    className="w-full object-cover max-h-80"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <div className="hidden text-center py-8 text-slate-500 text-sm">GIF не загружен</div>
                </div>
              )}
            </div>
            {selected.instructions && (
              <div className="mt-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800/50">
                <p className="text-sm font-bold text-sky-400 mb-3 flex items-center gap-2">
                  📋 Инструкции по выполнению
                </p>
                <p className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">
                  {selected.instructions}
                </p>
              </div>
            )}
            {!selected.imageUrl && !selected.gifUrl && !selected.instructions && (
              <div className="mt-4 p-6 rounded-xl bg-slate-900/30 border border-slate-800/30 text-center">
                <p className="text-sm text-slate-400">
                  Для этого упражнения пока нет дополнительной информации.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

