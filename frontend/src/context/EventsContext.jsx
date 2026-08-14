import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "../lib/api";
import { useAdmin } from "./AdminContext";

const EventsContext = createContext(null);

export function EventsProvider({ children }) {
  const { token } = useAdmin();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getEvents();
      setEvents(data || []);
    } catch (err) {
      setError(err.message || "Couldn't load events right now.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function addEvent(event) {
    await api.createEvent(event, token);
    await refresh();
  }

  async function deleteEvent(id) {
    await api.deleteEvent(id, token);
    await refresh();
  }

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = [...events]
    .filter((e) => e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
  const past = [...events]
    .filter((e) => e.date < today)
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <EventsContext.Provider
      value={{ events, upcoming, past, loading, error, addEvent, deleteEvent, refresh }}
    >
      {children}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  const ctx = useContext(EventsContext);
  if (!ctx) throw new Error("useEvents must be used within EventsProvider");
  return ctx;
}
