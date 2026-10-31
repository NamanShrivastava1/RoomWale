import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./AppLayout.jsx";
import { ProtectedRoute, GuestRoute } from "../features/auth/RouteGuards.jsx";
import LoginPage from "../features/auth/pages/LoginPage.jsx";
import RegisterPage from "../features/auth/pages/RegisterPage.jsx";
import DashboardPage from "../features/rooms/pages/DashboardPage.jsx";
import RoomPage from "../features/rooms/pages/RoomPage.jsx";
import NotFoundPage from "../features/shared/pages/NotFoundPage.jsx";
export const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <GuestRoute>
        <LoginPage />
      </GuestRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <GuestRoute>
        <RegisterPage />
      </GuestRoute>
    ),
  },
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/", element: <DashboardPage /> },
      { path: "/rooms/:roomId", element: <RoomPage /> },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);
