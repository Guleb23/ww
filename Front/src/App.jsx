import React from "react";
import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ExercisesPage } from "./pages/ExercisesPage";
import { WorkoutsPage } from "./pages/WorkoutsPage";
import { WorkoutDetailsPage } from "./pages/WorkoutDetailsPage";
import { WorkoutSessionPage } from "./pages/WorkoutSessionPage";
import { NotFoundPage } from "./pages/NotFoundPage";

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="exercises" element={<ExercisesPage />} />
            <Route path="workouts" element={<WorkoutsPage />} />
            <Route path="workouts/:id" element={<WorkoutDetailsPage />} />
            <Route path="workouts/:id/session" element={<WorkoutSessionPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
};

export default App;

