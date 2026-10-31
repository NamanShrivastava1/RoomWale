import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowRight, Mail, Lock } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../auth.slice.js";
import AuthFrame from "./AuthFrame.jsx";
export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const dispatch = useDispatch(),
    navigate = useNavigate(),
    location = useLocation(),
    { status, error } = useSelector((s) => s.auth);
  const submit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(result))
      navigate(location.state?.from || "/", { replace: true });
  };
  return (
    <AuthFrame
      title="Welcome back."
      subtitle="Pick up where your household left off."
      footer={
        <>
          New to Room Wale?{" "}
          <Link to="/register">
            Create an account <ArrowRight size={14} />
          </Link>
        </>
      }
    >
      <form className="auth-form" onSubmit={submit}>
        <label>Email address</label>
        <div className="input-wrap">
          <Mail size={17} />
          <input
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <label>Password</label>
        <div className="input-wrap">
          <Lock size={17} />
          <input
            type="password"
            autoComplete="current-password"
            placeholder="Your password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        {error && <div className="form-error">{error}</div>}
        <button
          className="button button-primary button-wide"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Signing you in…" : "Sign in"}{" "}
          <ArrowRight size={17} />
        </button>
      </form>
    </AuthFrame>
  );
}
