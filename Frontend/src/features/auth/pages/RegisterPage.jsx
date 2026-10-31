import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, UserRound, Mail, Lock } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../auth.slice.js";
import AuthFrame from "./AuthFrame.jsx";
export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const dispatch = useDispatch(),
    navigate = useNavigate(),
    { status, error } = useSelector((s) => s.auth);
  const submit = async (e) => {
    e.preventDefault();
    const result = await dispatch(registerUser(form));
    if (registerUser.fulfilled.match(result)) navigate("/", { replace: true });
  };
  return (
    <AuthFrame
      title="Make yourself at home."
      subtitle="Create your account. Your room is just around the corner."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login">
            Sign in <ArrowRight size={14} />
          </Link>
        </>
      }
    >
      <form className="auth-form" onSubmit={submit}>
        <label>Your name</label>
        <div className="input-wrap">
          <UserRound size={17} />
          <input
            autoComplete="name"
            placeholder="What should we call you?"
            required
            minLength={2}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
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
            autoComplete="new-password"
            placeholder="At least 8 characters"
            required
            minLength={8}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        {error && <div className="form-error">{error}</div>}
        <button
          className="button button-primary button-wide"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Creating your account…" : "Create account"}{" "}
          <ArrowRight size={17} />
        </button>
        <p className="form-hint">
          By continuing, you agree to be a good roommate. (The unofficial rule.)
        </p>
      </form>
    </AuthFrame>
  );
}
