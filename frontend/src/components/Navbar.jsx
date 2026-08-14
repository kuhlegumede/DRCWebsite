import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Crest from "./Crest";
import { useEvents } from "../context/EventsContext";
import { SCHOOL } from "../data/schoolInfo";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About & Vision" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
];

function formatDate(dateStr) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
  });
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [eventsOpen, setEventsOpen] = useState(false);
  const { upcoming } = useEvents();
  const dropdownRef = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setEventsOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const linkClass = ({ isActive }) =>
    `px-1 py-2 text-sm font-semibold tracking-wide transition-colors border-b-2 ${
      isActive
        ? "text-sun border-sun"
        : "text-ink/80 border-transparent hover:text-sun hover:border-sun/40"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur border-b border-ink/10">
      <div className="triangle-trim triangle-trim--sm" />
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <NavLink to="/" className="flex items-center gap-3 group">
            <Crest className="h-12 w-12 shrink-0 transition-transform group-hover:scale-105" />
            <span className="leading-tight">
              <span className="block font-display font-semibold text-lg sm:text-xl text-ink">
                {SCHOOL.name}
              </span>
              <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-sun-dark">
                Tsolo · Eastern Cape
              </span>
            </span>
          </NavLink>

          <div className="hidden lg:flex items-center gap-7">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
                {l.label}
              </NavLink>
            ))}

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setEventsOpen((v) => !v)}
                aria-expanded={eventsOpen}
                aria-haspopup="true"
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-ink text-cream text-sm font-semibold hover:bg-sun transition-colors"
              >
                Upcoming Events
                <span
                  className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-sun px-1 text-[11px] font-mono font-bold text-ink"
                  aria-label={`${upcoming.length} upcoming events`}
                >
                  {upcoming.length}
                </span>
              </button>

              {eventsOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white border border-ink/10 rounded-xl shadow-xl overflow-hidden">
                  <div className="triangle-trim triangle-trim--sm" />
                  <div className="p-4">
                    <p className="font-mono text-[11px] uppercase tracking-widest text-ink/50 mb-3">
                      What's coming up
                    </p>
                    {upcoming.length === 0 && (
                      <p className="text-sm text-ink/60">
                        No events scheduled right now — check back soon.
                      </p>
                    )}
                    <ul className="space-y-3">
                      {upcoming.slice(0, 3).map((e) => (
                        <li key={e.id} className="flex gap-3">
                          <div className="shrink-0 w-12 text-center bg-cream border border-ink/10 rounded-lg py-1.5">
                            <span className="block font-mono text-[10px] uppercase text-sun-dark font-bold">
                              {formatDate(e.date).split(" ")[1]}
                            </span>
                            <span className="block font-display text-lg leading-none font-semibold text-ink">
                              {formatDate(e.date).split(" ")[0]}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-ink leading-snug truncate">
                              {e.title}
                            </p>
                            <p className="text-xs text-ink/60 truncate">
                              {e.location}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <NavLink
                      to="/events"
                      onClick={() => setEventsOpen(false)}
                      className="mt-4 inline-flex w-full justify-center rounded-lg bg-ink text-cream text-sm font-semibold py-2.5 hover:bg-sun transition-colors"
                    >
                      View all events
                    </NavLink>
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg border border-ink/15 text-ink"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation menu"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div className="lg:hidden pb-6 border-t border-ink/10 pt-4 space-y-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2.5 rounded-lg text-sm font-semibold ${
                    isActive
                      ? "bg-sun/15 text-sun-dark"
                      : "text-ink/80 hover:bg-ink/5"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <NavLink
              to="/events"
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold ${
                  isActive
                    ? "bg-sun/15 text-sun-dark"
                    : "text-ink/80 hover:bg-ink/5"
                }`
              }
            >
              Upcoming Events
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-sun px-1 text-[11px] font-mono font-bold text-ink">
                {upcoming.length}
              </span>
            </NavLink>
          </div>
        )}
      </nav>
    </header>
  );
}
