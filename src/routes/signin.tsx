import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Bus,
  MapPin,
  Zap,
  User,
  Phone,
  CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/signin")({
  head: () => ({
    meta: [
      { title: "Sign In / Sign Up — payana.ai" },
      {
        name: "description",
        content:
          "Sign in or create your payana.ai account — AI-powered Bengaluru transit companion.",
      },
    ],
  }),
  component: AuthPage,
});

/* ── floating decorations ────────────────────────────── */
const floatingBuses: { top: string; left?: string; right?: string; delay: number }[] = [
  { top: "10%", left: "6%", delay: 0 },
  { top: "68%", left: "4%", delay: 1.3 },
  { top: "28%", right: "5%", delay: 0.7 },
  { top: "80%", right: "8%", delay: 1.9 },
];

/* ── tiny helpers ────────────────────────────────────── */
function InputField({
  id,
  label,
  type = "text",
  placeholder,
  icon: Icon,
  value,
  onChange,
  extra,
  autoComplete,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  icon: React.ElementType;
  value: string;
  onChange: (v: string) => void;
  extra?: React.ReactNode;
  autoComplete?: string;
}) {
  const [show, setShow] = useState(false);
  const isPw = type === "password";

  return (
    <div className="auth-field">
      <div className="auth-label-row">
        <label htmlFor={id} className="auth-label">
          {label}
        </label>
        {extra}
      </div>
      <div className="auth-input-wrap">
        <Icon size={15} className="auth-input-icon" />
        <input
          id={id}
          type={isPw ? (show ? "text" : "password") : type}
          placeholder={placeholder}
          {...({ autoComplete: autoComplete || "off" } as any)}
          className={`auth-input${isPw ? " auth-input-pw" : ""}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {isPw && (
          <button
            type="button"
            className="auth-eye-btn"
            onClick={() => setShow(!show)}
            tabIndex={-1}
          >
            {show ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        )}
      </div>
    </div>
  );
}

/* ── main component ──────────────────────────────────── */
function AuthPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"signin" | "signup">("signin");

  /* sign-in state */
  const [siEmail, setSiEmail] = useState("");
  const [siPassword, setSiPassword] = useState("");

  /* sign-up state */
  const [suName, setSuName] = useState("");
  const [suPhone, setSuPhone] = useState("");
  const [suEmail, setSuEmail] = useState("");
  const [suPassword, setSuPassword] = useState("");
  const [suConfirm, setSuConfirm] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ── handlers ─────────────────── */
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!siEmail || !siPassword) {
      setError("Please fill in all fields.");
      return;
    }
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    localStorage.setItem("payana_auth", "true");
    setIsLoading(false);
    navigate({ to: "/" });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!suName || !suEmail || !suPassword || !suConfirm) {
      setError("Please fill in all required fields.");
      return;
    }
    if (suPassword !== suConfirm) {
      setError("Passwords do not match.");
      return;
    }
    if (suPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1600));
    localStorage.setItem("payana_auth", "true");
    setIsLoading(false);
    setSuccess("Account created! Redirecting…");
    await new Promise((r) => setTimeout(r, 1000));
    navigate({ to: "/" });
  };

  const switchTab = (t: "signin" | "signup") => {
    setTab(t);
    setError("");
    setSuccess("");
  };

  /* ── render ───────────────────── */
  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="circuit-grid" />

      {floatingBuses.map((b, i) => (
        <motion.div
          key={i}
          className="floating-bus"
          style={{
            top: b.top,
            left: b.left,
            right: b.right,
          }}
          animate={{ y: [0, -18, 0], opacity: [0.15, 0.28, 0.15] }}
          transition={{
            duration: 5 + i * 0.8,
            delay: b.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Bus size={26} />
        </motion.div>
      ))}

      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* ── Brand ── */}
        <div className="auth-brand flex flex-col items-start gap-1">
          <div className="w-16 h-16 rounded-2xl bg-indigo flex items-center justify-center shadow-[0_4px_20px_rgba(79,70,229,0.35)] mb-3">
            <MapPin size={36} className="text-white fill-white/10" />
          </div>
          <p className="auth-brand-sub mt-1.5">
            AI-Powered Transit · Bengaluru
          </p>
        </div>

        <div className="auth-hr" />

        {/* ── Tabs ── */}
        <div className="auth-tabs" role="tablist">
          {(["signin", "signup"] as const).map((t) => {
            const isSelected = tab === t;
            return (
              <button
                key={t}
                role="tab"
                id={`tab-${t}`}
                className={`auth-tab${isSelected ? " auth-tab-active" : ""}`}
                onClick={() => switchTab(t)}
                {...({ "aria-selected": isSelected ? "true" : "false" } as any)}
              >
                {t === "signin" ? "Sign In" : "Sign Up"}
              </button>
            );
          })}
          <motion.div
            className="auth-tab-indicator"
            animate={{ x: tab === "signin" ? 0 : "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
          />
        </div>

        {/* ── Forms ── */}
        <AnimatePresence mode="wait">
          {tab === "signin" ? (
            <motion.form
              key="signin"
              id="signin-form"
              onSubmit={handleSignIn}
              className="auth-form"
              noValidate
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 18 }}
              transition={{ duration: 0.22 }}
            >
              <div className="auth-form-heading">
                <h2 className="auth-heading">Welcome back 👋</h2>
                <p className="auth-sub">Sign in to your transit dashboard</p>
              </div>

              <InputField
                id="si-email"
                label="Email address"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                icon={Mail}
                value={siEmail}
                onChange={setSiEmail}
              />
              <InputField
                id="si-password"
                label="Password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                icon={Lock}
                value={siPassword}
                onChange={setSiPassword}
                extra={
                  <a href="#" className="auth-forgot">
                    Forgot password?
                  </a>
                }
              />

              {error && <ErrorMsg msg={error} />}
              {success && <SuccessMsg msg={success} />}

              <SubmitBtn loading={isLoading} label="Sign In" />

              <SocialRow />

              <p className="auth-switch-text">
                Don't have an account?{" "}
                <button
                  type="button"
                  className="auth-switch-link"
                  onClick={() => switchTab("signup")}
                >
                  Create one free
                </button>
              </p>
            </motion.form>
          ) : (
            <motion.form
              key="signup"
              id="signup-form"
              onSubmit={handleSignUp}
              className="auth-form"
              noValidate
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.22 }}
            >
              <div className="auth-form-heading">
                <h2 className="auth-heading">Create account 🚌</h2>
                <p className="auth-sub">Join thousands of Bengaluru commuters</p>
              </div>

              <InputField
                id="su-name"
                label="Full name"
                autoComplete="name"
                placeholder="Rahul Kumar"
                icon={User}
                value={suName}
                onChange={setSuName}
              />
              <InputField
                id="su-phone"
                label="Phone number (optional)"
                type="tel"
                autoComplete="tel"
                placeholder="+91 98765 43210"
                icon={Phone}
                value={suPhone}
                onChange={setSuPhone}
              />
              <InputField
                id="su-email"
                label="Email address"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                icon={Mail}
                value={suEmail}
                onChange={setSuEmail}
              />
              <InputField
                id="su-password"
                label="Password"
                type="password"
                autoComplete="new-password"
                placeholder="Min. 8 characters"
                icon={Lock}
                value={suPassword}
                onChange={setSuPassword}
              />
              <InputField
                id="su-confirm"
                label="Confirm password"
                type="password"
                autoComplete="new-password"
                placeholder="Repeat password"
                icon={Lock}
                value={suConfirm}
                onChange={setSuConfirm}
              />

              {/* Password strength */}
              {suPassword.length > 0 && <PasswordStrength password={suPassword} />}

              {error && <ErrorMsg msg={error} />}
              {success && <SuccessMsg msg={success} />}

              <SubmitBtn loading={isLoading} label="Create Account" />

              <SocialRow signUp />

              <p className="auth-switch-text">
                Already have an account?{" "}
                <button
                  type="button"
                  className="auth-switch-link"
                  onClick={() => switchTab("signin")}
                >
                  Sign in
                </button>
              </p>

              <p className="auth-terms">
                By signing up you agree to our{" "}
                <a href="#" className="auth-terms-link">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="auth-terms-link">
                  Privacy Policy
                </a>
                .
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>

      {/* bottom badge */}
      <motion.div
        className="auth-bottom-badge"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
      >
        <span className="auth-live-dot-sm" />
        Live transit data active · Bengaluru
      </motion.div>

      <style>{`
        /* ── page shell ── */
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          background: #090d18;
          padding: 5rem 1rem 4rem;
        }
        .auth-bg {
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 80% 55% at 50% -5%,  rgba(79,70,229,.22) 0%, transparent 70%),
            radial-gradient(ellipse 55% 45% at 8%  82%,  rgba(0,255,157,.07) 0%, transparent 60%),
            radial-gradient(ellipse 45% 40% at 90% 68%,  rgba(255,0,122,.06) 0%, transparent 60%),
            linear-gradient(180deg, #090d18 0%, #0e1220 100%);
          z-index: 0;
        }
        .circuit-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(79,70,229,.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(79,70,229,.055) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
          z-index: 0;
        }
        .floating-bus {
          position: absolute;
          color: rgba(79,70,229,.22);
          z-index: 1;
          pointer-events: none;
        }

        /* ── card ── */
        .auth-card {
          position: relative; z-index: 10;
          width: 100%; max-width: 440px;
          background: rgba(13,17,30,.84);
          backdrop-filter: blur(26px);
          border: 1px solid rgba(79,70,229,.22);
          border-radius: 1.5rem;
          padding: 2rem 2rem 1.75rem;
          box-shadow:
            0 0 0 1px rgba(255,255,255,.04) inset,
            0 28px 70px rgba(0,0,0,.55),
            0 0 90px rgba(79,70,229,.08);
        }

        /* ── brand ── */
        .auth-brand {
          display: flex; align-items: center; gap: .85rem;
          margin-bottom: 1.1rem;
        }
        .auth-logo-ring {
          width: 46px; height: 46px; flex-shrink: 0;
          border-radius: 50%;
          border: 2px solid rgba(79,70,229,.38);
          background: rgba(79,70,229,.1);
          display: flex; align-items: center; justify-content: center;
          position: relative;
        }
        .auth-logo-ring::before {
          content: '';
          position: absolute; inset: -3px;
          border-radius: 50%;
          border: 1px dashed rgba(79,70,229,.22);
        }
        .auth-brand-name {
          font-family: var(--font-heading);
          font-size: 1.45rem; font-weight: 700;
          color: #fff; letter-spacing: -.03em;
          line-height: 1; margin: 0;
          display: flex; align-items: center; gap: .3rem;
        }
        .auth-live-dot {
          display: inline-block;
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--hyper-green);
          animation: pulse-green 2s ease-in-out infinite;
          flex-shrink: 0;
        }
        .auth-live-dot-sm {
          display: inline-block;
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--hyper-green);
          animation: pulse-green 2s ease-in-out infinite;
        }
        .auth-brand-sub {
          font-size: .7rem; color: rgba(255,255,255,.35);
          letter-spacing: .04em; margin-top: .22rem;
          font-family: var(--font-mono);
        }
        .auth-hr {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(79,70,229,.3), transparent);
          margin-bottom: 1.25rem;
        }

        /* ── tabs ── */
        .auth-tabs {
          display: grid; grid-template-columns: 1fr 1fr;
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(255,255,255,.07);
          border-radius: .85rem;
          padding: .3rem;
          position: relative;
          margin-bottom: 1.5rem;
        }
        .auth-tab-indicator {
          position: absolute;
          top: .3rem; left: .3rem;
          width: calc(50% - .3rem);
          height: calc(100% - .6rem);
          background: linear-gradient(135deg, #4F46E5, #7C3AED);
          border-radius: .6rem;
          box-shadow: 0 4px 16px rgba(79,70,229,.35);
          pointer-events: none;
          z-index: 0;
        }
        .auth-tab {
          position: relative; z-index: 1;
          padding: .55rem 0;
          font-size: .83rem; font-weight: 600;
          border: none; background: none; cursor: pointer;
          border-radius: .6rem;
          color: rgba(255,255,255,.38);
          transition: color .18s;
          font-family: var(--font-body);
        }
        .auth-tab-active { color: #fff; }

        /* ── form ── */
        .auth-form {
          display: flex; flex-direction: column; gap: .9rem;
        }
        .auth-form-heading { margin-bottom: .2rem; }
        .auth-heading {
          font-family: var(--font-heading);
          font-size: 1.2rem; font-weight: 700;
          color: #fff; margin: 0 0 .2rem;
          letter-spacing: -.02em;
        }
        .auth-sub {
          font-size: .78rem; color: rgba(255,255,255,.38); margin: 0;
        }

        /* fields */
        .auth-field { display: flex; flex-direction: column; gap: .38rem; }
        .auth-label-row {
          display: flex; align-items: center; justify-content: space-between;
        }
        .auth-label {
          font-size: .74rem; font-weight: 500;
          color: rgba(255,255,255,.55);
        }
        .auth-forgot {
          font-size: .72rem; color: var(--indigo); text-decoration: none;
          transition: opacity .15s;
        }
        .auth-forgot:hover { opacity: .72; }
        .auth-input-wrap {
          position: relative; display: flex; align-items: center;
        }
        .auth-input-icon {
          position: absolute; left: .8rem;
          color: rgba(255,255,255,.28); pointer-events: none;
        }
        .auth-input {
          width: 100%;
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.09);
          border-radius: .65rem;
          padding: .6rem .8rem .6rem 2.35rem;
          font-size: .85rem; color: #fff; outline: none;
          transition: border-color .2s, box-shadow .2s, background .2s;
          font-family: var(--font-body);
        }
        .auth-input::placeholder { color: rgba(255,255,255,.18); }
        .auth-input:focus {
          border-color: rgba(79,70,229,.58);
          background: rgba(79,70,229,.06);
          box-shadow: 0 0 0 3px rgba(79,70,229,.14);
        }
        .auth-input-pw { padding-right: 2.6rem; }
        .auth-eye-btn {
          position: absolute; right: .7rem;
          background: none; border: none; cursor: pointer;
          color: rgba(255,255,255,.28); padding: .25rem;
          display: flex; align-items: center;
          transition: color .15s;
        }
        .auth-eye-btn:hover { color: rgba(255,255,255,.65); }

        /* password strength */
        .pw-strength { display: flex; flex-direction: column; gap: .3rem; }
        .pw-bars { display: flex; gap: .25rem; }
        .pw-bar {
          flex: 1; height: 3px; border-radius: 2px;
          background: rgba(255,255,255,.08);
          transition: background .3s;
        }
        .pw-bar.active-weak   { background: #EF4444; }
        .pw-bar.active-medium { background: #FACC15; }
        .pw-bar.active-strong { background: #00FF9D; }
        .pw-label {
          font-size: .68rem; font-family: var(--font-mono);
        }

        /* messages */
        .auth-error {
          font-size: .77rem; color: #ff6b6b;
          background: rgba(239,68,68,.1);
          border: 1px solid rgba(239,68,68,.2);
          border-radius: .5rem;
          padding: .48rem .7rem; margin: 0;
        }
        .auth-success {
          font-size: .77rem; color: #00FF9D;
          background: rgba(0,255,157,.08);
          border: 1px solid rgba(0,255,157,.22);
          border-radius: .5rem;
          padding: .48rem .7rem; margin: 0;
          display: flex; align-items: center; gap: .45rem;
        }

        /* submit */
        .auth-btn {
          display: flex; align-items: center; justify-content: center; gap: .45rem;
          width: 100%; padding: .72rem;
          border-radius: .85rem;
          background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
          color: #fff; font-size: .88rem; font-weight: 600;
          border: none; cursor: pointer;
          transition: opacity .2s;
          font-family: var(--font-body);
          box-shadow: 0 4px 22px rgba(79,70,229,.35), 0 0 0 1px rgba(255,255,255,.08) inset;
          position: relative; overflow: hidden;
          margin-top: .15rem;
        }
        .auth-btn::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,.12), transparent 60%);
          pointer-events: none;
        }
        .auth-btn:disabled { opacity: .65; cursor: not-allowed; }
        .auth-spinner {
          width: 17px; height: 17px;
          border: 2px solid rgba(255,255,255,.28);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin .7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* OR */
        .auth-or {
          display: flex; align-items: center; gap: .65rem;
          margin: .25rem 0;
        }
        .auth-or-line { flex:1; height: 1px; background: rgba(255,255,255,.07); }
        .auth-or-text {
          font-size: .68rem; color: rgba(255,255,255,.25);
          letter-spacing: .04em; white-space: nowrap;
        }

        /* social */
        .auth-social {
          display: grid; grid-template-columns: 1fr 1fr; gap: .65rem;
        }
        .auth-social-btn {
          display: flex; align-items: center; justify-content: center; gap: .45rem;
          padding: .56rem 1rem;
          border-radius: .65rem;
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.09);
          color: rgba(255,255,255,.7);
          font-size: .8rem; font-weight: 500;
          cursor: pointer;
          transition: background .15s, border-color .15s;
          font-family: var(--font-body);
        }
        .auth-social-btn:hover {
          background: rgba(255,255,255,.09);
          border-color: rgba(255,255,255,.18);
        }

        /* footer text */
        .auth-switch-text {
          text-align: center; font-size: .78rem;
          color: rgba(255,255,255,.32); margin: .1rem 0 0;
        }
        .auth-switch-link {
          background: none; border: none; cursor: pointer;
          color: var(--indigo); font-weight: 500; font-size: .78rem;
          font-family: var(--font-body);
          text-decoration: underline; text-underline-offset: 2px;
          transition: opacity .15s; padding: 0;
        }
        .auth-switch-link:hover { opacity: .72; }
        .auth-terms {
          text-align: center; font-size: .68rem;
          color: rgba(255,255,255,.2); margin: -.15rem 0 0;
        }
        .auth-terms-link {
          color: rgba(255,255,255,.38); text-decoration: underline;
          text-underline-offset: 2px;
        }
        .auth-terms-link:hover { color: rgba(255,255,255,.6); }

        /* bottom pill */
        .auth-bottom-badge {
          position: fixed; bottom: 1.2rem; left: 50%; transform: translateX(-50%);
          z-index: 20;
          display: flex; align-items: center; gap: .45rem;
          padding: .32rem .85rem;
          border-radius: 999px;
          background: rgba(13,17,30,.88);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(0,255,157,.18);
          font-size: .7rem; color: rgba(255,255,255,.4);
          font-family: var(--font-mono); white-space: nowrap;
          box-shadow: 0 4px 24px rgba(0,0,0,.38);
        }
      `}</style>
    </div>
  );
}

/* ── sub-components ──────────────────────────────────── */
function ErrorMsg({ msg }: { msg: string }) {
  return (
    <motion.p className="auth-error" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}>
      {msg}
    </motion.p>
  );
}

function SuccessMsg({ msg }: { msg: string }) {
  return (
    <motion.p
      className="auth-success"
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <CheckCircle2 size={14} /> {msg}
    </motion.p>
  );
}

function SubmitBtn({ loading, label }: { loading: boolean; label: string }) {
  return (
    <motion.button
      id={`auth-submit-${label.replace(/\s+/g, "-").toLowerCase()}`}
      type="submit"
      className="auth-btn"
      disabled={loading}
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.013 }}
    >
      {loading ? (
        <span className="auth-spinner" />
      ) : (
        <>
          {label} <ArrowRight size={15} />
        </>
      )}
    </motion.button>
  );
}

function SocialRow({ signUp }: { signUp?: boolean }) {
  return (
    <>
      <div className="auth-or">
        <span className="auth-or-line" />
        <span className="auth-or-text">or {signUp ? "sign up" : "sign in"} with</span>
        <span className="auth-or-line" />
      </div>
      <div className="auth-social">
        <button
          id={`social-google-${signUp ? "signup" : "signin"}`}
          type="button"
          className="auth-social-btn"
        >
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
            <path
              d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
              fill="#4285F4"
            />
            <path
              d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
              fill="#34A853"
            />
            <path
              d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332Z"
              fill="#FBBC05"
            />
            <path
              d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58Z"
              fill="#EA4335"
            />
          </svg>
          Google
        </button>
        <button
          id={`social-otp-${signUp ? "signup" : "signin"}`}
          type="button"
          className="auth-social-btn"
        >
          <Zap size={14} style={{ color: "var(--amber)" }} />
          OTP Login
        </button>
      </div>
    </>
  );
}

function PasswordStrength({ password }: { password: string }) {
  const score =
    (password.length >= 8 ? 1 : 0) +
    (/[A-Z]/.test(password) ? 1 : 0) +
    (/[0-9]/.test(password) ? 1 : 0) +
    (/[^A-Za-z0-9]/.test(password) ? 1 : 0);

  const level = score <= 1 ? "weak" : score <= 3 ? "medium" : "strong";
  const colors = { weak: "#EF4444", medium: "#FACC15", strong: "#00FF9D" };
  const label = { weak: "Weak", medium: "Good", strong: "Strong" };

  return (
    <div className="pw-strength">
      <div className="pw-bars">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className={`pw-bar${score >= n ? ` active-${level}` : ""}`} />
        ))}
      </div>
      <span 
        className={`pw-label ${level === 'weak' ? 'text-red-500' : level === 'medium' ? 'text-yellow-400' : 'text-[#00FF9D]'}`}
      >
        {label[level]} password
      </span>
    </div>
  );
}
