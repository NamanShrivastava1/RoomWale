import { House } from "lucide-react";
export function Loader({ label = "Loading" }) {
  return (
    <div className="loader-screen">
      <span className="loader-mark">
        <House size={22} />
      </span>
      <span>{label}</span>
      <i className="loader-line" />
    </div>
  );
}
