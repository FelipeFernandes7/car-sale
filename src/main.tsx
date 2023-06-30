import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./App";
import { Toaster } from "react-hot-toast";
import AuthProvider from "./context/AuthContext";
import { register } from "swiper/element";

register();
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
