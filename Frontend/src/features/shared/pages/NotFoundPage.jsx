import { Link } from "react-router-dom";
import { ArrowLeft, House } from "lucide-react";
export default function NotFoundPage() {
  return (
    <main className="not-found">
      <span className="modal-icon">
        <House size={24} />
      </span>
      <span className="eyebrow">A LITTLE OFF THE MAP</span>
      <h1>
        This room doesn’t exist.
        <br />
        <em>Yet.</em>
      </h1>
      <p>Looks like this page wandered into the wrong house.</p>
      <Link to="/" className="button button-primary">
        <ArrowLeft size={16} /> Back to your home
      </Link>
    </main>
  );
}
