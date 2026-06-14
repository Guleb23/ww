import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosClient } from "../api/axiosClient";

export const WorkoutSessionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [workout, setWorkout] = useState(null);
  const [workoutExercises, setWorkoutExercises] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime] = useState(new Date());

  const loadData = async () => {
    setLoading(true);
    try {
      const [workoutRes, wexRes, exRes] = await Promise.all([
        axiosClient.get(`/api/workouts/${id}`),
        axiosClient.get(`/api/workoutexercises/by-workout/${id}`),
        axiosClient.get("/api/exercises"),
      ]);
      setWorkout(workoutRes.data);
      const sortedWex = wexRes.data.sort((a, b) => a.order - b.order);
      setWorkoutExercises(sortedWex);
      setExercises(exRes.data);
    } catch (err) {
      console.error(err);
      alert("Не удалось загрузить данные тренировки");
      navigate(`/workouts/${id}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [id]);

  const getCurrentExercise = () => {
    if (workoutExercises.length === 0 || currentIndex >= workoutExercises.length) {
      return null;
    }
    const wex = workoutExercises[currentIndex];
    const exercise = exercises.find((e) => e.id === wex.exerciseId);
    return { workoutExercise: wex, exercise };
  };

  const handleNext = () => {
    if (currentIndex < workoutExercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFinish = () => {
    const duration = Math.round((new Date() - startTime) / 1000 / 60);
    if (window.confirm(`Завершить тренировку? Продолжительность: ${duration} минут`)) {
      navigate(`/workouts/${id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-600 border-t-sky-500 mx-auto mb-4" />
          <p className="text-slate-400">Загрузка тренировки...</p>
        </div>
      </div>
    );
  }

  if (workoutExercises.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-lg text-slate-300 mb-4">
          В этой тренировке нет упражнений
        </p>
        <button
          onClick={() => navigate(`/workouts/${id}`)}
          className="rounded-lg bg-gradient-to-r from-sky-600 to-sky-500 px-6 py-3 text-sm font-semibold text-white hover:from-sky-500 hover:to-sky-400 shadow-lg shadow-sky-500/25 transition-all duration-200"
        >
          Вернуться к тренировке
        </button>
      </div>
    );
  }

  const current = getCurrentExercise();
  const isLast = currentIndex === workoutExercises.length - 1;
  const progress = ((currentIndex + 1) / workoutExercises.length) * 100;

  if (!current) {
    return null;
  }

  const { workoutExercise: wex, exercise } = current;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header с прогрессом */}
      <div className="rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/90 to-slate-950/90 backdrop-blur-sm p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {workout.name}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Упражнение {currentIndex + 1} из {workoutExercises.length}
            </p>
          </div>
          <button
            onClick={() => navigate(`/workouts/${id}`)}
            className="rounded-lg bg-slate-800/80 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700 transition-all duration-200"
          >
            Выйти
          </button>
        </div>
        
        {/* Прогресс-бар */}
        <div className="w-full bg-slate-800/50 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Текущее упражнение */}
      <div className="rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/90 to-slate-950/90 backdrop-blur-sm p-8 shadow-2xl">
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-2">
            {exercise?.name || "Упражнение не найдено"}
          </h2>
          {exercise?.description && (
            <p className="text-base text-slate-300 mt-3 max-w-2xl mx-auto leading-relaxed">
              {exercise.description}
            </p>
          )}
        </div>

        {/* Параметры тренировки */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 p-4 text-center">
            <div className="text-2xl mb-1">🔥</div>
            <div className="text-3xl font-bold text-purple-300 mb-1">{wex.sets}</div>
            <div className="text-xs text-slate-400 uppercase">Подходов</div>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-pink-500/20 to-pink-600/20 border border-pink-500/30 p-4 text-center">
            <div className="text-2xl mb-1">💪</div>
            <div className="text-3xl font-bold text-pink-300 mb-1">{wex.reps}</div>
            <div className="text-xs text-slate-400 uppercase">Повторений</div>
          </div>
        </div>

        {wex.notes && (
          <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <p className="text-sm font-semibold text-amber-400 mb-1">📝 Заметки:</p>
            <p className="text-sm text-slate-300">{wex.notes}</p>
          </div>
        )}

        {/* Изображения */}
        <div className="grid gap-4 md:grid-cols-2 mb-6">
          {exercise?.imageUrl && (
            <div className="rounded-xl overflow-hidden border border-slate-800/50 shadow-lg">
              <p className="text-xs font-semibold text-slate-400 mb-2 px-3 pt-3">🖼️ Изображение</p>
              <img
                src={exercise.imageUrl}
                alt={exercise.name}
                className="w-full object-cover max-h-80"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          )}
          {exercise?.gifUrl && (
            <div className="rounded-xl overflow-hidden border border-slate-800/50 shadow-lg">
              <p className="text-xs font-semibold text-slate-400 mb-2 px-3 pt-3">🎬 GIF анимация</p>
              <img
                src={exercise.gifUrl}
                alt={`${exercise.name} GIF`}
                className="w-full object-cover max-h-80"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          )}
        </div>

        {/* Инструкции */}
        {exercise?.instructions && (
          <div className="mb-6 p-5 rounded-xl bg-slate-900/50 border border-slate-800/50">
            <p className="text-sm font-bold text-sky-400 mb-3 flex items-center gap-2">
              📋 Инструкции по выполнению
            </p>
            <p className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">
              {exercise.instructions}
            </p>
          </div>
        )}

        {/* Навигация */}
        <div className="flex items-center justify-between gap-4 pt-6 border-t border-slate-800/50">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 rounded-lg border border-slate-700/50 px-5 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800/50 hover:border-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
          >
            ← Предыдущее
          </button>

          {isLast ? (
            <button
              onClick={handleFinish}
              className="flex-1 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 px-8 py-3 text-base font-bold text-white hover:from-emerald-500 hover:to-emerald-400 shadow-lg shadow-emerald-500/25 transition-all duration-200 transform hover:scale-105"
            >
              ✅ Завершить тренировку
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex-1 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 px-8 py-3 text-base font-bold text-white hover:from-purple-500 hover:to-pink-400 shadow-lg shadow-purple-500/25 transition-all duration-200 transform hover:scale-105"
            >
              Следующее упражнение →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
