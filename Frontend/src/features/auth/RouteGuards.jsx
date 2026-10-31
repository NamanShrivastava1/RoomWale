import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMe } from "./auth.slice.js";
import { Loader } from "../shared/components/Loader.jsx";
export function ProtectedRoute({ children }) {
  const dispatch = useDispatch(),
    { user, checking } = useSelector((s) => s.auth);
  const loc = useLocation();
  useEffect(() => {
    if (checking) dispatch(fetchMe());
  }, [dispatch, checking]);
  if (checking) return <Loader label="Getting your home ready" />;
  return user ? (
    children
  ) : (
    <Navigate to="/login" replace state={{ from: loc.pathname }} />
  );
}
export function GuestRoute({ children }) {
  const dispatch = useDispatch(),
    { user, checking } = useSelector((s) => s.auth);
  useEffect(() => {
    if (checking) dispatch(fetchMe());
  }, [dispatch, checking]);
  if (checking) return <Loader label="One moment" />;
  return user ? <Navigate to="/" replace /> : children;
}
