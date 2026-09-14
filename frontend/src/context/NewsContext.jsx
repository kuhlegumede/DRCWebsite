import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import { api } from "../lib/api";
import { useAdmin } from "./AdminContext";

const NewsContext = createContext(null);

export function NewsProvider({ children }) {
  const { token } = useAdmin();

  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await api.getNews();

      setNews(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error("Failed to load news:", err);

      setError(
        err.message ||
          "Couldn't load news updates right now."
      );

      setNews([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function addNews(formData) {
    if (!token) {
      throw new Error(
        "You must be signed in as an administrator."
      );
    }

    await api.createNews(
      formData,
      token
    );

    await refresh();
  }

  async function deleteNews(id) {
    if (!token) {
      throw new Error(
        "You must be signed in as an administrator."
      );
    }

    await api.deleteNews(
      id,
      token
    );

    await refresh();
  }

  return (
    <NewsContext.Provider
      value={{
        news,
        loading,
        error,
        addNews,
        deleteNews,
        refresh,
      }}
    >
      {children}
    </NewsContext.Provider>
  );
}

export function useNews() {
  const context = useContext(
    NewsContext
  );

  if (!context) {
    throw new Error(
      "useNews must be used within NewsProvider"
    );
  }

  return context;
}
