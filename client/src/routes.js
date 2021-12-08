import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthPage } from "./pages/AuthPage";
import { CreatePage } from "./pages/CreatePage";
import { DetailsPage } from "./pages/DetailsPage";
import { LinksPage } from "./pages/LinksPage";

export const useRoutes = (isAuth) => {
  if (isAuth) {
    return (
      <Routes>
        <Route path="links" element={<LinksPage />} />
        <Route path="create" element={<CreatePage />} />
        <Route path="details/:id" element={<DetailsPage />} />
        <Route path="*" element={<Navigate to="create" />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};
