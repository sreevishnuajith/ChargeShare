import { useEffect, useState } from "react";
import api from "../api/auth";
import Navbar from "../components/Navbar";

function formatDateTime(dt) {
  return new Date(dt).toLocaleString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/sessions/me")
      .then((r) => setSessions(r.data))
      .catch(() => setError("Could not load sessions."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-100">
      <Navbar />
      <main className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Charging Sessions</h2>
        {loading && <p className="text-slate-500">Loading…</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && sessions.length === 0 && (
          <p className="text-slate-500">No sessions yet. Sessions appear here once a booking starts charging.</p>
        )}
        <div className="space-y-4">
          {sessions.map((s) => {
            const inProgress = !s.endedAt;
            return (
              <div key={s.id} className="bg-white rounded-xl border border-teal-100 shadow-sm p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      Charger {s.booking.charger.label}
                      <span className="ml-2 text-sm font-normal text-slate-500">{s.booking.charger.location}</span>
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      {formatDateTime(s.startedAt)}
                      {s.endedAt ? ` → ${formatDateTime(s.endedAt)}` : " (in progress)"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-slate-800">{s.energyKwh.toFixed(2)} kWh</p>
                    <p className="text-sm text-teal-700 font-medium">${s.costAud.toFixed(2)}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  {inProgress ? (
                    <span className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                      In Progress
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">
                      Completed
                    </span>
                  )}
                  <span className="text-xs text-slate-400">{s.booking.charger.powerKw} kW charger</span>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
