import { useState } from "react";
import TriangleTrim from "../components/TriangleTrim";
import { useEvents } from "../context/EventsContext";
import { useAdmin } from "../context/AdminContext";

function formatDate(dateStr) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-ZA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const emptyForm = { title: "", date: "", time: "", location: "", description: "" };

function LoginPanel() {
  const { login } = useAdmin();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const result = await login(password);
    setBusy(false);
    if (!result.success) {
      setError(result.error || "Incorrect password. Please try again.");
      return;
    }
    setPassword("");
  }

  return (
    <div className="rounded-xl border border-ink/10 bg-white p-6">
      <p className="font-mono text-xs uppercase tracking-widest text-ink/50 mb-1">
        School Staff
      </p>
      <h2 className="font-display font-semibold text-lg text-ink mb-4">
        Admin Sign-In
      </h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="sr-only" htmlFor="admin-password">
            Admin password
          </label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            autoComplete="current-password"
            className="w-full rounded-lg border border-ink/15 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sun"
            required
          />
        </div>
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg bg-ink text-cream text-sm font-semibold px-6 py-2.5 hover:bg-sun transition-colors disabled:opacity-60"
        >
          {busy ? "Signing in…" : "Sign In"}
        </button>
      </form>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      <p className="mt-4 text-xs text-ink/40 leading-relaxed">
        Only school staff with the admin password can add or remove events.
        Contact the school office if you need access.
      </p>
    </div>
  );
}

function AddEventForm() {
  const { addEvent } = useEvents();
  const [form, setForm] = useState(emptyForm);
  const [savedMsg, setSavedMsg] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.date) return;
    setBusy(true);
    setError("");
    try {
      await addEvent(form);
      setForm(emptyForm);
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 3000);
    } catch (err) {
      setError(err.message || "Couldn't add the event. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-xl border border-ink/10 bg-white p-6">
      <p className="font-mono text-xs uppercase tracking-widest text-sun-dark mb-1">
        Admin
      </p>
      <h2 className="font-display font-semibold text-lg text-ink mb-4">
        Add a New Event
      </h2>
      <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-ink/60 mb-1.5" htmlFor="ev-title">
            Event title
          </label>
          <input
            id="ev-title"
            type="text"
            required
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            className="w-full rounded-lg border border-ink/15 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sun"
            placeholder="e.g. Grade 7 Prize-Giving"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-ink/60 mb-1.5" htmlFor="ev-date">
            Date
          </label>
          <input
            id="ev-date"
            type="date"
            required
            value={form.date}
            onChange={(e) => update("date", e.target.value)}
            className="w-full rounded-lg border border-ink/15 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sun"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-ink/60 mb-1.5" htmlFor="ev-time">
            Time (optional)
          </label>
          <input
            id="ev-time"
            type="time"
            value={form.time}
            onChange={(e) => update("time", e.target.value)}
            className="w-full rounded-lg border border-ink/15 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sun"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-ink/60 mb-1.5" htmlFor="ev-location">
            Location (optional)
          </label>
          <input
            id="ev-location"
            type="text"
            value={form.location}
            onChange={(e) => update("location", e.target.value)}
            className="w-full rounded-lg border border-ink/15 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sun"
            placeholder="e.g. School Hall"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-ink/60 mb-1.5" htmlFor="ev-description">
            Details (optional)
          </label>
          <textarea
            id="ev-description"
            rows={3}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            className="w-full rounded-lg border border-ink/15 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sun resize-none"
            placeholder="A short description parents and staff should know"
          />
        </div>
        <div className="sm:col-span-2 flex items-center gap-4 flex-wrap">
          <button
            type="submit"
            disabled={busy}
            className="rounded-lg bg-sun text-ink text-sm font-semibold px-6 py-2.5 hover:bg-gold transition-colors disabled:opacity-60"
          >
            {busy ? "Adding…" : "Add Event"}
          </button>
          {savedMsg && (
            <span className="text-sm text-green-700 font-medium">Event added.</span>
          )}
          {error && <span className="text-sm text-red-600 font-medium">{error}</span>}
        </div>
      </form>
    </div>
  );
}

function EventCard({ event, isAdmin, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    setDeleting(true);
    setError("");
    try {
      await onDelete(event.id);
    } catch (err) {
      setError(err.message || "Couldn't delete this event.");
      setDeleting(false);
    }
  }

  return (
    <article className="bg-white rounded-xl border border-ink/10 p-6 flex flex-col sm:flex-row sm:items-start gap-5">
      <div className="shrink-0 w-20 text-center bg-cream border border-ink/10 rounded-xl py-3">
        <span className="block font-mono text-[11px] uppercase text-sun-dark font-bold">
          {new Date(`${event.date}T00:00:00`).toLocaleDateString("en-ZA", { month: "short" })}
        </span>
        <span className="block font-display text-3xl leading-none font-semibold text-ink mt-1">
          {new Date(`${event.date}T00:00:00`).getDate()}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-display font-semibold text-xl text-ink mb-1">
          {event.title}
        </h3>
        <p className="text-xs font-mono uppercase tracking-wide text-ink/50 mb-2">
          {formatDate(event.date)}
          {event.time ? ` · ${event.time}` : ""}
          {event.location ? ` · ${event.location}` : ""}
        </p>
        {event.description && (
          <p className="text-sm text-ink/70 leading-relaxed">{event.description}</p>
        )}
        {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
      </div>
      {isAdmin && (
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="shrink-0 self-start rounded-lg border border-red-200 text-red-600 text-xs font-semibold px-3 py-2 hover:bg-red-50 transition-colors disabled:opacity-60"
        >
          {deleting ? "Deleting…" : "Delete"}
        </button>
      )}
    </article>
  );
}

export default function Events() {
  const { upcoming, past, loading, error, deleteEvent } = useEvents();
  const { isAdmin, ready, logout } = useAdmin();
  const [showPast, setShowPast] = useState(false);

  return (
    <div>
      <section className="bg-ink text-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-gold mb-4">
              School Calendar
            </p>
            <h1 className="font-display font-semibold text-4xl sm:text-5xl">
              Upcoming Events
            </h1>
          </div>
          {ready && isAdmin && (
            <button
              onClick={logout}
              className="rounded-lg border border-cream/30 text-cream text-sm font-semibold px-5 py-2.5 hover:bg-cream/10 transition-colors"
            >
              Sign out of admin
            </button>
          )}
        </div>
        <TriangleTrim />
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-5 order-2 lg:order-1">
            {loading && (
              <div className="rounded-2xl border border-dashed border-ink/20 py-16 text-center text-ink/50">
                Loading events…
              </div>
            )}

            {!loading && error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 py-10 px-6 text-center text-red-700">
                {error}
              </div>
            )}

            {!loading && !error && upcoming.length === 0 && (
              <div className="rounded-2xl border border-dashed border-ink/20 py-16 text-center text-ink/50">
                No events scheduled at the moment — please check back soon.
              </div>
            )}

            {!loading &&
              !error &&
              upcoming.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isAdmin={isAdmin}
                  onDelete={deleteEvent}
                />
              ))}

            {!loading && !error && past.length > 0 && (
              <div className="pt-6">
                <button
                  onClick={() => setShowPast((v) => !v)}
                  className="text-sm font-semibold text-sun-dark hover:text-sun transition-colors mb-5"
                >
                  {showPast ? "Hide" : "Show"} past events ({past.length})
                </button>
                {showPast && (
                  <div className="space-y-5 opacity-70">
                    {past.map((event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        isAdmin={isAdmin}
                        onDelete={deleteEvent}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="order-1 lg:order-2 space-y-6">
            {ready && (isAdmin ? <AddEventForm /> : <LoginPanel />)}
          </div>
        </div>
      </section>
    </div>
  );
}
