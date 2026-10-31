import { House, Sparkles } from "lucide-react";
export default function AuthFrame({ title, subtitle, children, footer }) {
  return (
    <main className="auth-page">
      <div className="auth-art">
        <a className="brand brand-light" href="/">
          <span className="brand-mark">
            <House size={19} />
          </span>{" "}
          room wale
        </a>
        <div className="art-copy">
          <span className="eyebrow eyebrow-light">
            <Sparkles size={14} /> A little more in sync
          </span>
          <h1>
            A happier home
            <br />
            is a shared one.
          </h1>
          <p>
            Make the everyday stuff feel lighter. Keep the chores fair, the
            house calmer, and the good vibes going.
          </p>
          <div className="art-note">
            <span className="note-dot" />
            <span>
              Less “who did this last?”
              <br />
              <b>More “we’ve got this.”</b>
            </span>
          </div>
        </div>
        <div className="art-orbit orbit-one" />
        <div className="art-orbit orbit-two" />
        <span className="art-stamp">
          MADE FOR
          <br />
          ROOMMATES
        </span>
      </div>
      <section className="auth-panel">
        <div className="auth-form-wrap">
          <div className="mobile-brand">
            <span className="brand-mark">
              <House size={18} />
            </span>{" "}
            room wale
          </div>
          <span className="eyebrow">YOUR HOME, IN HARMONY</span>
          <h2>{title}</h2>
          <p className="auth-subtitle">{subtitle}</p>
          {children}
          <div className="auth-footer">{footer}</div>
          <p className="privacy-note">
            A little structure. A lot less friction.
          </p>
        </div>
      </section>
    </main>
  );
}
