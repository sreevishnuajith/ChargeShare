const phases = [
  "User Authentication",
  "Charger Discovery",
  "Booking and Reservation",
  "Session Metering",
  "Billing and Invoicing",
  "Admin Dashboard",
];

export default function App() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-100 p-6 text-slate-900">
      <div className="mx-auto max-w-3xl rounded-2xl border border-teal-200 bg-white/90 p-6 shadow-xl">
        <h1 className="text-3xl font-bold text-brand-dark">ChargeShare</h1>
        <p className="mt-2 text-slate-600">
          Foundation setup complete. This prototype will be built in phases for
          the Year 12 Enterprise Computing assessment.
        </p>

        <section className="mt-6">
          <h2 className="text-xl font-semibold">Planned Build Phases</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-6 text-slate-700">
            {phases.map((phase) => (
              <li key={phase}>{phase}</li>
            ))}
          </ol>
        </section>
      </div>
    </main>
  );
}
