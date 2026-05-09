import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(fullName, email, password);
      navigate("/dashboard");
    } catch (err) {
      const fieldErrors = err.response?.data?.error;
      if (fieldErrors && typeof fieldErrors === "object") {
        setError(Object.values(fieldErrors).flat().join(". "));
      } else {
        setError(fieldErrors || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-teal-100 p-8">
        <h1 className="text-2xl font-bold text-brand-dark">ChargeShare</h1>
        <p className="text-slate-500 text-sm mt-1 mb-6">Fair EV charging in shared buildings</p>

        <h2 className="text-xl font-semibold text-slate-800 mb-4">Create an account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder="John Abraham"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
            />
          </div>

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
              placeholder="At least 8 characters"
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
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="text-brand font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
