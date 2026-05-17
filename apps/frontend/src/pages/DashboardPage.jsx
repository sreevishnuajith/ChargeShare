import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";

const RESIDENT_CARDS = [
  { title: "Available Chargers", desc: "Browse and book EV charging slots", path: "/chargers" },
  { title: "My Bookings", desc: "View and manage your upcoming bookings", path: "/bookings" },
  { title: "Charging Sessions", desc: "Track your energy usage history", path: "/sessions" },
  { title: "My Invoices", desc: "View your monthly billing statements", path: "/invoices" },
];

const ADMIN_CARDS = [
  { title: "Admin Dashboard", desc: "Usage charts, revenue stats, and charger utilisation", path: "/admin" },
  { title: "Manage Invoices", desc: "Generate and update invoice status for all residents", path: "/admin" },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === "ADMIN";
  const cards = isAdmin ? ADMIN_CARDS : RESIDENT_CARDS;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-100">
      <Navbar />

      <main className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            Welcome, {user?.fullName}
          </h2>
          <p className="text-slate-500 mt-1">
            ChargeShare — {isAdmin ? "Admin Console" : "Resident Dashboard"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cards.map((card) => (
            <div
              key={card.title}
              onClick={() => navigate(card.path)}
              className="bg-white rounded-xl border border-teal-100 shadow-sm p-5 cursor-pointer hover:shadow-md hover:border-teal-300 transition-all"
            >
              <h3 className="font-semibold text-slate-800 mb-1">{card.title}</h3>
              <p className="text-sm text-slate-500 mb-3">{card.desc}</p>
              <span className="text-xs font-medium text-white bg-teal-600 px-2 py-0.5 rounded-full">
                Open →
              </span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
