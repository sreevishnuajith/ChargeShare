import { useEffect, useState } from "react";
import api from "../api/auth";
import Navbar from "../components/Navbar";

function formatDate(dt) {
  return new Date(dt).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const STATUS_STYLES = {
  DRAFT: "text-slate-600 bg-slate-50 border-slate-200",
  SENT: "text-amber-700 bg-amber-50 border-amber-200",
  PAID: "text-teal-700 bg-teal-50 border-teal-200",
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/invoices/me")
      .then((r) => setInvoices(r.data))
      .catch(() => setError("Could not load invoices."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-100">
      <Navbar />
      <main className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">My Invoices</h2>
        {loading && <p className="text-slate-500">Loading…</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && invoices.length === 0 && (
          <p className="text-slate-500">
            No invoices yet. Invoices are generated monthly by your building administrator.
          </p>
        )}
        <div className="space-y-4">
          {invoices.map((inv) => (
            <div key={inv.id} className="bg-white rounded-xl border border-teal-100 shadow-sm p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-slate-800">
                    Invoice #{inv.id}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Period: {formatDate(inv.periodStart)} — {formatDate(inv.periodEnd)}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Issued {formatDate(inv.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-800">
                    ${inv.totalAud.toFixed(2)}
                    <span className="text-sm font-normal text-slate-400 ml-1">AUD</span>
                  </p>
                  <span className={`mt-2 inline-block text-xs font-medium border px-2 py-0.5 rounded-full ${STATUS_STYLES[inv.status] ?? STATUS_STYLES.DRAFT}`}>
                    {inv.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
