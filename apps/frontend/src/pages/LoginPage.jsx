import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const DEMO_ACCOUNTS = [
  { label: "Building Admin", email: "admin@chargeshare.local", role: "ADMIN" },
  { label: "Ajith UAT Admin", email: "ajith@chargeshare.local", role: "ADMIN" },
  { label: "Vishnu", email: "vishnu@chargeshare.local", role: "RESIDENT" },
  { label: "Resident Two", email: "resident2@chargeshare.local", role: "RESIDENT" },
  { label: "Resident Three", email: "resident3@chargeshare.local", role: "RESIDENT" },
  { label: "Rejini UAT Resident", email: "rejini@chargeshare.local", role: "RESIDENT" },
];

const DEMO_PASSWORD = "ChangeMe123!";

const ROLE_STYLE = {
  ADMIN: "text-indigo-700 bg-indigo-50 border-indigo-200",
  RESIDENT: "text-teal-700 bg-teal-50 border-teal-200",
};

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function fillAccount(acct) {
    setEmail(acct.email);
    setPassword(DEMO_PASSWORD);
    setError("");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-teal-100 p-8">
        <h1 className="text-2xl font-bold text-brand-dark">ChargeShare</h1>
        <p className="text-slate-500 text-sm mt-1 mb-6">Fair EV charging in shared buildings</p>

        <h2 className="text-xl font-semibold text-slate-800 mb-4">Log in</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand text-white py-2 rounded-lg font-medium hover:bg-brand-dark transition-colors disabled:opacity-60"
          >
            {loading ? "Logging in…" : "Log In"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-brand font-medium hover:underline">
            Register
          </Link>
        </p>

        {/* Demo accounts panel */}
        <div className="mt-6 border-t border-dashed border-slate-200 pt-4">
          <button
            type="button"
            onClick={() => setShowDemo((v) => !v)}
            className="w-full text-left text-xs text-slate-400 hover:text-slate-600 transition-colors flex items-center justify-between"
          >
            <span>Demo accounts</span>
            <span>{showDemo ? "▲" : "▼"}</span>
          </button>

          {showDemo && (
            <div className="mt-3 space-y-2">
              {DEMO_ACCOUNTS.map((acct) => (
                <button
                  key={acct.email}
                  type="button"
                  onClick={() => fillAccount(acct)}
                  className="w-full flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 hover:bg-slate-100 px-3 py-2 transition-colors text-left"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-700">{acct.label}</p>
                    <p className="text-xs text-slate-400">{acct.email}</p>
                  </div>
                  <span className={`text-xs font-medium border px-2 py-0.5 rounded-full ${ROLE_STYLE[acct.role]}`}>
                    {acct.role}
                  </span>
                </button>
              ))}
              <p className="text-xs text-slate-400 text-center pt-1">
                All accounts use password: <span className="font-mono">{DEMO_PASSWORD}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
