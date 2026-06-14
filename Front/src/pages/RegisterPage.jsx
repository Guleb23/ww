import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    if (form.password !== form.confirm) {
      setError("Пароли не совпадают");
      return;
    }
    setLoading(true);
    try {
      await register(form.username, form.password);
      navigate("/");
    } catch (err) {
      console.error(err);
      const message = err.response?.data;
      if (typeof message === "string" && message.toLowerCase().includes("username")) {
        setError("Имя пользователя уже занято");
      } else {
        setError("Не удалось зарегистрироваться. Попробуйте ещё раз.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Регистрация</h1>
      <p className="text-sm text-slate-400 mb-6">
        Создайте аккаунт, чтобы начать составлять свои тренировки.
      </p>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-lg border border-slate-800 bg-slate-900/60 p-6"
      >
        <div>
          <label className="block text-sm mb-1" htmlFor="username">
            Имя пользователя
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={form.username}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="password">
            Пароль
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="confirm">
            Подтверждение пароля
          </label>
          <input
            id="confirm"
            name="confirm"
            type="password"
            value={form.confirm}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            required
          />
        </div>
        {error && (
          <p className="text-sm text-red-400 bg-red-950/40 border border-red-800 rounded px-3 py-2">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-sky-600 py-2 text-sm font-medium text-white hover:bg-sky-500 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Создаём аккаунт..." : "Зарегистрироваться"}
        </button>
        <p className="text-xs text-slate-400">
          Уже есть аккаунт?{" "}
          <Link to="/login" className="underline">
            Войти
          </Link>
        </p>
      </form>
    </div>
  );
};

