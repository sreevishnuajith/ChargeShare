import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";

const FEATURE_CARDS = [
  { title: "Available Chargers", desc: "Browse and book EV charging slots", path: "/chargers", ready: true },
  { title: "My Bookings", desc: "View and manage your upcoming bookings", path: "/bookings", ready: true },
  { title: "Charging Sessions", desc: "Track your energy usage history", path: null, ready: false },
  { title: "My Invoices", desc: "View your monthly billing statements", path: null, ready: false },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-100">
      <Navbar />

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
              onClick={() => card.ready && navigate(card.path)}
              className={`bg-white rounded-xl border border-teal-100 shadow-sm p-5 ${card.ready ? "cursor-pointer hover:shadow-md hover:border-teal-300 transition-all" : ""}`}
            >
              <h3 className="font-semibold text-slate-800 mb-1">{card.title}</h3>
              <p className="text-sm text-slate-500 mb-3">{card.desc}</p>
              {card.ready ? (
                <span className="text-xs font-medium text-white bg-brand px-2 py-0.5 rounded-full">
                  Open →
                </span>
              ) : (
                <span className="text-xs font-medium text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">
                  Coming soon
                </span>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
