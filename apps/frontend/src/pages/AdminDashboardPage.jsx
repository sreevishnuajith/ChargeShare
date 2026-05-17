import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import api from "../api/auth";
import Navbar from "../components/Navbar";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const CHART_OPTS = {
  responsive: true,
  plugins: { legend: { display: false } },
  scales: { y: { beginAtZero: true } },
};

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-white rounded-xl border border-teal-100 shadow-sm p-5">
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</p>
      <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
      {sub && <p className="text-sm text-slate-500 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [invoices, setInvoices] = useState([]);
  const [users, setUsers] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [genMsg, setGenMsg] = useState("");
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");

  useEffect(() => {
    Promise.all([
      api.get("/admin/dashboard"),
      api.get("/invoices/"),
      api.get("/admin/users"),
    ])
      .then(([dashRes, invRes, usersRes]) => {
        setData(dashRes.data);
        setInvoices(invRes.data);
        setUsers(usersRes.data);
      })
      .catch(() => setError("Could not load admin dashboard data."))
      .finally(() => setLoading(false));
  }, []);

  async function handleGenerateInvoices() {
    if (!periodStart || !periodEnd) return;
    setGenerating(true);
    setGenMsg("");
    try {
      const res = await api.post("/invoices/generate", {
        periodStart: new Date(periodStart).toISOString(),
        periodEnd: new Date(periodEnd).toISOString(),
      });
      setGenMsg(`Generated ${res.data.created} invoice(s).`);
      const invRes = await api.get("/invoices/");
      setInvoices(invRes.data);
    } catch (e) {
      setGenMsg(e?.response?.data?.error ?? "Failed to generate invoices.");
    } finally {
      setGenerating(false);
    }
  }

  async function handleStatusChange(id, status) {
    try {
      await api.put(`/invoices/${id}/status`, { status });
      const invRes = await api.get("/invoices/");
      setInvoices(invRes.data);
    } catch {
      // silently fail — status stays unchanged
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-100">
        <Navbar />
        <main className="max-w-6xl mx-auto p-6"><p className="text-slate-500">Loading…</p></main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-100">
        <Navbar />
        <main className="max-w-6xl mx-auto p-6"><p className="text-red-600">{error}</p></main>
      </div>
    );
  }

  const { summary, dailyStats, chargerUtilization } = data;
  const labels = dailyStats.map((d) => d.date);

  const sessionsChartData = {
    labels,
    datasets: [
      {
        label: "Sessions",
        data: dailyStats.map((d) => d.sessions),
        backgroundColor: "rgba(20, 184, 166, 0.6)",
        borderRadius: 4,
      },
    ],
  };

  const revenueChartData = {
    labels,
    datasets: [
      {
        label: "Revenue (AUD)",
        data: dailyStats.map((d) => d.revenue),
        borderColor: "rgb(20, 184, 166)",
        backgroundColor: "rgba(20, 184, 166, 0.1)",
        tension: 0.3,
        fill: true,
        pointRadius: 4,
      },
    ],
  };

  const utilChartData = {
    labels: chargerUtilization.map((c) => c.label),
    datasets: [
      {
        label: "Completed Sessions",
        data: chargerUtilization.map((c) => c.completedSessions),
        backgroundColor: "rgba(99, 102, 241, 0.6)",
        borderRadius: 4,
      },
    ],
  };

  const STATUS_STYLES = {
    DRAFT: "text-slate-600 bg-slate-50 border-slate-200",
    SENT: "text-amber-700 bg-amber-50 border-amber-200",
    PAID: "text-teal-700 bg-teal-50 border-teal-200",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-100">
      <Navbar />
      <main className="max-w-6xl mx-auto p-6 space-y-8">
        <h2 className="text-2xl font-bold text-slate-800">Admin Dashboard</h2>

        {/* Summary stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard label="Residents" value={summary.totalUsers} />
          <StatCard label="Bookings" value={summary.totalBookings} />
          <StatCard label="Sessions" value={summary.totalSessions} />
          <StatCard label="Total Energy" value={`${summary.totalEnergyKwh} kWh`} />
          <StatCard label="Total Revenue" value={`$${summary.totalRevenueAud.toFixed(2)}`} sub="AUD" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-teal-100 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Sessions per Day (last 14 days)</h3>
            {dailyStats.length === 0
              ? <p className="text-slate-400 text-sm">No session data yet.</p>
              : <Bar data={sessionsChartData} options={CHART_OPTS} />
            }
          </div>
          <div className="bg-white rounded-xl border border-teal-100 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Revenue per Day — AUD (last 14 days)</h3>
            {dailyStats.length === 0
              ? <p className="text-slate-400 text-sm">No revenue data yet.</p>
              : <Line data={revenueChartData} options={CHART_OPTS} />
            }
          </div>
        </div>

        <div className="bg-white rounded-xl border border-teal-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Charger Utilisation (completed sessions)</h3>
          {chargerUtilization.length === 0
            ? <p className="text-slate-400 text-sm">No charger data yet.</p>
            : <div className="max-w-md"><Bar data={utilChartData} options={CHART_OPTS} /></div>
          }
        </div>

        {/* Generate invoices */}
        <div className="bg-white rounded-xl border border-teal-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Generate Monthly Invoices</h3>
          <div className="flex flex-wrap gap-3 items-end">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Period Start</label>
              <input
                type="date"
                value={periodStart}
                onChange={(e) => setPeriodStart(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Period End</label>
              <input
                type="date"
                value={periodEnd}
                onChange={(e) => setPeriodEnd(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
            <button
              onClick={handleGenerateInvoices}
              disabled={generating || !periodStart || !periodEnd}
              className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              {generating ? "Generating…" : "Generate Invoices"}
            </button>
          </div>
          {genMsg && <p className="mt-3 text-sm text-teal-700">{genMsg}</p>}
        </div>

        {/* Invoices table */}
        <div className="bg-white rounded-xl border border-teal-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">All Invoices</h3>
          {invoices.length === 0 ? (
            <p className="text-slate-400 text-sm">No invoices yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                    <th className="pb-2 pr-4">ID</th>
                    <th className="pb-2 pr-4">Resident</th>
                    <th className="pb-2 pr-4">Period</th>
                    <th className="pb-2 pr-4">Amount</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="text-slate-700">
                      <td className="py-2 pr-4 text-slate-400">#{inv.id}</td>
                      <td className="py-2 pr-4 font-medium">{inv.user.fullName}</td>
                      <td className="py-2 pr-4 text-slate-500">
                        {new Date(inv.periodStart).toLocaleDateString("en-AU", { day: "numeric", month: "short" })}
                        {" — "}
                        {new Date(inv.periodEnd).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="py-2 pr-4 font-semibold">${inv.totalAud.toFixed(2)}</td>
                      <td className="py-2">
                        <select
                          value={inv.status}
                          onChange={(e) => handleStatusChange(inv.id, e.target.value)}
                          className={`text-xs font-medium border px-2 py-0.5 rounded-full cursor-pointer focus:outline-none ${STATUS_STYLES[inv.status] ?? STATUS_STYLES.DRAFT}`}
                        >
                          <option value="DRAFT">DRAFT</option>
                          <option value="SENT">SENT</option>
                          <option value="PAID">PAID</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Residents table */}
        <div className="bg-white rounded-xl border border-teal-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Residents ({users.length})</h3>
          {users.length === 0 ? (
            <p className="text-slate-400 text-sm">No residents registered.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                    <th className="pb-2 pr-4">Name</th>
                    <th className="pb-2 pr-4">Email</th>
                    <th className="pb-2 pr-4">Bookings</th>
                    <th className="pb-2">Invoices</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {users.map((u) => (
                    <tr key={u.id} className="text-slate-700">
                      <td className="py-2 pr-4 font-medium">{u.fullName}</td>
                      <td className="py-2 pr-4 text-slate-500">{u.email}</td>
                      <td className="py-2 pr-4">{u._count.bookings}</td>
                      <td className="py-2">{u._count.invoices}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
