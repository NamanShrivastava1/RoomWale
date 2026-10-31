import { useState } from "react";
import { X, House, KeyRound, ArrowRight } from "lucide-react";
export function RoomModal({ mode, onClose, onSubmit, loading, error }) {
  const [name, setName] = useState(""),
    [code, setCode] = useState("");
  const join = mode === "join";
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section className="modal-card">
        <button
          className="icon-button modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={19} />
        </button>
        <span className="modal-icon">
          {join ? <KeyRound size={22} /> : <House size={22} />}
        </span>
        <span className="eyebrow">{join ? "COME ON IN" : "MAKE IT YOURS"}</span>
        <h2>{join ? "Join your household" : "Create a room"}</h2>
        <p>
          {join
            ? "Got an invite code from a roommate? Enter it below."
            : "Give your shared space a name everyone recognises."}
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(join ? code.trim() : name.trim());
          }}
        >
          {join ? (
            <>
              <label>Invite code</label>
              <input
                className="text-input invite-input"
                placeholder="e.g. H7K9PX"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                required
                autoFocus
              />
            </>
          ) : (
            <>
              <label>Room name</label>
              <input
                className="text-input"
                placeholder="e.g. The Sunday House"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={60}
                autoFocus
              />{" "}
            </>
          )}
          {error && <div className="form-error">{error}</div>}
          <button
            className="button button-primary button-wide"
            disabled={loading}
          >
            {loading ? "One moment…" : join ? "Join room" : "Create room"}{" "}
            <ArrowRight size={17} />
          </button>
        </form>
      </section>
    </div>
  );
}
