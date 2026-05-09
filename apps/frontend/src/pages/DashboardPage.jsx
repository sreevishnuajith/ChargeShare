import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const FEATURE_CARDS = [
  { title: "Available Chargers", desc: "Browse and book EV charging slots" },
  { title: "My Bookings", desc: "View and manage your upcoming bookings" },
  { title: "Charging Sessions", desc: "Track your energy usage history" },
  { title: "My Invoices", desc: "View your monthly billing statements" },
];

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-100">
      <nav className="bg-white border-b border-teal-100 shadow-sm px-6 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-brand-dark">ChargeShare</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-700">
            {user?.fullName}
            <span className="ml-2 text-xs font-medium text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">
              {user?.role}
            </span>
          </span>
          <button
            onClick={handleLogout}
            className="text-sm text-slate-500 hover:text-red-600 transition-colors"
          >
            Log Out
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            Welcome, {user?.fullName}
          </h2>
          <p className="text-slate-500 mt-1">
            ChargeShare — {user?.role === "ADMIN" ? "Admin Console" : "Resident Dashboard"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FEATURE_CARDS.map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-xl border border-teal-100 shadow-sm p-5"
            >
              <h3 className="font-semibold text-slate-800 mb-1">{card.title}</h3>
              <p className="text-sm text-slate-500 mb-3">{card.desc}</p>
              <span className="text-xs font-medium text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">
                Coming soon
              </span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
