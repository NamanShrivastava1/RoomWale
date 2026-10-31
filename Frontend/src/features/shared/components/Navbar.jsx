import { Link, useNavigate } from "react-router-dom";
import { House, LogOut, ChevronDown } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../auth/auth.slice.js";
import { initials } from "../../../lib/normalize.js";
import { useState } from "react";
export function Navbar() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch(),
    navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const name = user?.name || user?.fullName || "Roommate";
  return (
    <header className="navbar">
      <div className="nav-inner">
        <Link className="brand" to="/">
          <span className="brand-mark">
            <House size={18} />
          </span>
          <span>
            room wale<span className="brand-period">.</span>
          </span>
        </Link>
        <div className="nav-right">
          <Link to="/" className="nav-home">
            Your home
          </Link>
          <button
            className="profile-button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
          >
            <span className="avatar">{initials(name)}</span>
            <span className="profile-name">{name.split(" ")[0]}</span>
            <ChevronDown size={15} />
          </button>
          {open && (
            <div className="profile-menu">
              <div className="profile-menu-user">
                <b>{name}</b>
                <span>{user?.email}</span>
              </div>
              <button
                onClick={async () => {
                  await dispatch(logoutUser());
                  setOpen(false);
                  navigate("/login", { replace: true });
                }}
              >
                <LogOut size={16} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
