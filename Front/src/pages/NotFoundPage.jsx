import React from "react";
import { Link } from "react-router-dom";

export const NotFoundPage = () => {
  return (
    <div className="text-center py-20">
      <h1 className="text-3xl font-semibold mb-2">404</h1>
      <p className="text-sm text-slate-400 mb-4">Страница не найдена.</p>
      <Link
        to="/"
        className="inline-flex items-center justify-center rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500"
      >
        На главную
      </Link>
    </div>
  );
};

