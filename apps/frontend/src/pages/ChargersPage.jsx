import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/auth";
import Navbar from "../components/Navbar";

function formatSlot(b) {
  const start = new Date(b.startAt);
  const end = new Date(b.endAt);
  return `${start.toLocaleDateString("en-AU", { day: "numeric", month: "short" })} ${start.toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" })}–${end.toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" })}`;
}

export default function ChargersPage() {
  const [chargers, setChargers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/chargers")
      .then((r) => setChargers(r.data))
      .catch(() => setError("Could not load chargers."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-100">
      <Navbar />
      <main className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Available Chargers</h2>
        {loading && <p className="text-slate-500">Loading…</p>}
        {error && <p className="text-red-600">{error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {chargers.map((c) => (
            <div key={c.id} className="bg-white rounded-xl border border-teal-100 shadow-sm p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-slate-800 text-lg">Charger {c.label}</h3>
                  <p className="text-sm text-slate-500">{c.location} · {c.powerKw} kW</p>
                </div>
                <button
                  onClick={() => navigate(`/chargers/${c.id}/book`)}
                  className="bg-brand text-white text-sm px-4 py-1.5 rounded-lg font-medium hover:bg-brand-dark transition-colors"
                >
                  Book
                </button>
              </div>
              {c.bookings.length === 0 ? (
                <p className="text-xs text-teal-700 bg-teal-50 border border-teal-200 px-2 py-1 rounded-full inline-block">
                  No upcoming bookings this week
                </p>
              ) : (
                <div>
                  <p className="text-xs text-slate-500 mb-1">Booked slots this week:</p>
                  <ul className="space-y-1">
                    {c.bookings.map((b, i) => (
                      <li key={i} className="text-xs text-slate-600 bg-slate-50 border border-slate-100 px-2 py-1 rounded">
                        {formatSlot(b)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
