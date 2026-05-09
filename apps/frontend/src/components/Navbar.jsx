import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="bg-white border-b border-teal-100 shadow-sm px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link to="/dashboard" className="text-xl font-bold text-brand-dark">ChargeShare</Link>
        <Link to="/chargers" className="text-sm text-slate-600 hover:text-brand transition-colors">Chargers</Link>
        <Link to="/bookings" className="text-sm text-slate-600 hover:text-brand transition-colors">My Bookings</Link>
      </div>
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
  );
}
