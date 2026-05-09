import { useEffect, useState } from "react";
import api from "../api/auth";
import Navbar from "../components/Navbar";

const STATUS_STYLES = {
  CONFIRMED: "text-teal-700 bg-teal-50 border-teal-200",
  COMPLETED: "text-slate-600 bg-slate-50 border-slate-200",
  CANCELLED: "text-red-600 bg-red-50 border-red-200",
};

function formatDateTime(dt) {
  return new Date(dt).toLocaleString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function loadBookings() {
    setLoading(true);
    api.get("/bookings/me")
      .then((r) => setBookings(r.data))
      .catch(() => setError("Could not load bookings."))
      .finally(() => setLoading(false));
  }

  useEffect(loadBookings, []);

  async function handleCancel(id) {
    try {
      await api.delete(`/bookings/${id}`);
      loadBookings();
    } catch (err) {
      alert(err.response?.data?.error || "Could not cancel booking.");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-100">
      <Navbar />
      <main className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">My Bookings</h2>
        {loading && <p className="text-slate-500">Loading…</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && bookings.length === 0 && (
          <p className="text-slate-500">No bookings yet. <a href="/chargers" className="text-brand hover:underline">Browse chargers</a> to make your first booking.</p>
        )}
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b.id} className="bg-white rounded-xl border border-teal-100 shadow-sm p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-slate-800">
                    Charger {b.charger.label}
                    <span className="ml-2 text-sm font-normal text-slate-500">{b.charger.location}</span>
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {formatDateTime(b.startAt)} → {formatDateTime(b.endAt)}
                  </p>
                  {b.session && (
                    <p className="text-sm text-teal-700 mt-1">
                      {b.session.energyKwh.toFixed(1)} kWh · ${b.session.costAud.toFixed(2)}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`text-xs font-medium border px-2 py-0.5 rounded-full ${STATUS_STYLES[b.status]}`}>
                    {b.status}
                  </span>
                  {b.status === "CONFIRMED" && new Date(b.startAt) > new Date() && (
                    <button
                      onClick={() => handleCancel(b.id)}
                      className="text-xs text-red-500 hover:text-red-700 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
