import { useState } from "react";
import TriangleTrim from "../components/TriangleTrim";
import { useNews } from "../context/NewsContext";
import { useAdmin } from "../context/AdminContext";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || ""
).replace(/\/+$/, "");

const emptyForm = {
  title: "",
  content: "",
  images: [],
};

function getImageUrl(path) {
  if (!path) return "";

  if (
    path.startsWith("http://") ||
    path.startsWith("https://")
  ) {
    return path;
  }

  const cleanPath = path.startsWith("/")
    ? path
    : `/${path}`;

  return `${API_BASE_URL}${cleanPath}`;
}

/* =========================================================
ADMIN LOGIN
========================================================= */

function LoginPanel() {
  const { login } = useAdmin();

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setBusy(true);
    setError("");

    try {
      const result = await login(password);

      if (!result.success) {
        setError(
          result.error ||
            "Incorrect password. Please try again."
        );

        return;
      }

      setPassword("");
    } catch (err) {
      setError(
        err.message ||
          "Unable to sign in. Please try again."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-xl border border-ink/10 bg-white p-6">
      <p className="font-mono text-xs uppercase tracking-widest text-ink/50 mb-1">
        School Staff
      </p>

      <h2 className="font-display font-semibold text-lg text-ink mb-4">
        Admin Sign-In
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-3"
      >
        <div>
          <label
            htmlFor="news-admin-password"
            className="sr-only"
          >
            Admin password
          </label>

          <input
            id="news-admin-password"
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            placeholder="Enter admin password"
            autoComplete="current-password"
            required
            className="w-full rounded-lg border border-ink/15 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sun"
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

      {error && (
        <p className="mt-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <p className="mt-4 text-xs text-ink/40 leading-relaxed">
        Only school staff with the admin password can
        publish or remove news updates.
      </p>
    </div>
  );
}

/* =========================================================
ADD NEWS FORM
========================================================= */

function AddNewsForm() {
  const { addNews } = useNews();

  const [form, setForm] = useState(emptyForm);
  const [savedMsg, setSavedMsg] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function update(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleImages(e) {
    const files = Array.from(e.target.files || []);

    update("images", files);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setSavedMsg(false);

    if (!form.title.trim()) {
      setError("Please enter a news title.");
      return;
    }

    if (!form.content.trim()) {
      setError("Please enter the news update.");
      return;
    }

    if (form.title.trim().length > 200) {
      setError(
        "The title cannot be longer than 200 characters."
      );
      return;
    }

    if (form.content.trim().length > 10000) {
      setError(
        "The update cannot be longer than 10 000 characters."
      );
      return;
    }

    setBusy(true);

    try {
      const formData = new FormData();

      formData.append(
        "title",
        form.title.trim()
      );

      formData.append(
        "content",
        form.content.trim()
      );

      form.images.forEach((file) => {
        formData.append("images", file);
      });

      await addNews(formData);

      setForm(emptyForm);

      // Reset the file input
      const fileInput =
        document.getElementById("news-images");

      if (fileInput) {
        fileInput.value = "";
      }

      setSavedMsg(true);

      setTimeout(() => {
        setSavedMsg(false);
      }, 3000);
    } catch (err) {
      setError(
        err.message ||
          "Couldn't publish the news update. Please try again."
      );
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
        Publish News
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        {/* TITLE */}
        <div>
          <label
            htmlFor="news-title"
            className="block text-xs font-semibold text-ink/60 mb-1.5"
          >
            News title
          </label>

          <input
            id="news-title"
            type="text"
            required
            maxLength={200}
            value={form.title}
            onChange={(e) =>
              update("title", e.target.value)
            }
            placeholder="e.g. DRC Primary School Sports Day"
            className="w-full rounded-lg border border-ink/15 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sun"
          />
        </div>

        {/* CONTENT */}
        <div>
          <label
            htmlFor="news-content"
            className="block text-xs font-semibold text-ink/60 mb-1.5"
          >
            News update
          </label>

          <textarea
            id="news-content"
            required
            maxLength={10000}
            rows={7}
            value={form.content}
            onChange={(e) =>
              update("content", e.target.value)
            }
            placeholder="Write the school news update here..."
            className="w-full rounded-lg border border-ink/15 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sun resize-y"
          />
        </div>

        {/* IMAGES */}
        <div>
          <label
            htmlFor="news-images"
            className="block text-xs font-semibold text-ink/60 mb-1.5"
          >
            Images (optional)
          </label>

          <input
            id="news-images"
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            multiple
            onChange={handleImages}
            className="block w-full rounded-lg border border-ink/15 px-4 py-2.5 text-sm bg-white"
          />

          {form.images.length > 0 && (
            <p className="mt-2 text-xs text-ink/50">
              {form.images.length} image
              {form.images.length === 1 ? "" : "s"} selected.
            </p>
          )}

          <p className="mt-2 text-xs text-ink/40">
            JPG, JPEG, PNG or WEBP. Maximum 5 MB per image.
          </p>
        </div>

        {/* BUTTON / STATUS */}
        <div className="flex items-center gap-4 flex-wrap">
          <button
            type="submit"
            disabled={busy}
            className="rounded-lg bg-sun text-ink text-sm font-semibold px-6 py-2.5 hover:bg-gold transition-colors disabled:opacity-60"
          >
            {busy
              ? "Publishing…"
              : "Publish News"}
          </button>

          {savedMsg && (
            <span className="text-sm text-green-700 font-medium">
              News published successfully.
            </span>
          )}

          {error && (
            <span className="text-sm text-red-600 font-medium">
              {error}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}

/* =========================================================
NEWS CARD
========================================================= */

function NewsCard({
  item,
  isAdmin,
  onDelete,
}) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this news update?"
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setError("");

    try {
      await onDelete(item.id);
    } catch (err) {
      setError(
        err.message ||
          "Couldn't delete this news update."
      );
      setDeleting(false);
    }
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm">
      {/* IMAGES */}
      {Array.isArray(item.images) &&
        item.images.length > 0 && (
          <div
            className={
              item.images.length === 1
                ? "grid grid-cols-1"
                : "grid grid-cols-1 sm:grid-cols-2"
            }
          >
            {item.images.map((image) => {
              const imageUrl = getImageUrl(
                image.imageUrl
              );

              return (
                <img
                  key={image.id}
                  src={imageUrl}
                  alt={
                    image.caption ||
                    item.title ||
                    "School news"
                  }
                  className="h-64 w-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display =
                      "none";
                  }}
                />
              );
            })}
          </div>
        )}

      {/* CONTENT */}
      <div className="p-6">
        <p className="font-mono text-xs uppercase tracking-widest text-sun-dark mb-2">
          School News
        </p>

        <h2 className="font-display font-semibold text-2xl text-ink">
          {item.title}
        </h2>

        {item.publishedAtUtc && (
          <p className="mt-2 text-xs font-mono uppercase tracking-wide text-ink/50">
            {new Date(
              item.publishedAtUtc
            ).toLocaleDateString("en-ZA", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        )}

        <div className="mt-5 whitespace-pre-line text-base leading-7 text-ink/75">
          {item.content}
        </div>

        {error && (
          <p className="mt-4 text-sm text-red-600">
            {error}
          </p>
        )}

        {isAdmin && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="mt-6 rounded-lg border border-red-200 text-red-600 text-xs font-semibold px-3 py-2 hover:bg-red-50 transition-colors disabled:opacity-60"
          >
            {deleting
              ? "Deleting…"
              : "Delete Update"}
          </button>
        )}
      </div>
    </article>
  );
}

/* =========================================================
NEWS PAGE
========================================================= */

export default function News() {
  const {
    news,
    loading,
    error,
    deleteNews,
  } = useNews();

  const {
    isAdmin,
    ready,
    logout,
  } = useAdmin();

  return (
    <div>
      {/* HEADER */}
      <section className="bg-ink text-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-gold mb-4">
              DRC Primary School
            </p>

            <h1 className="font-display font-semibold text-4xl sm:text-5xl">
              School News
            </h1>

            <p className="mt-4 max-w-2xl text-cream/70 leading-relaxed">
              Stay up to date with the latest news,
              announcements and activities from DRC
              Primary School.
            </p>
          </div>

          {ready && isAdmin && (
            <button
              type="button"
              onClick={logout}
              className="rounded-lg border border-cream/30 text-cream text-sm font-semibold px-5 py-2.5 hover:bg-cream/10 transition-colors"
            >
              Sign out of admin
            </button>
          )}
        </div>

        <TriangleTrim />
      </section>

      {/* MAIN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* NEWS LIST */}
          <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
            {/* LOADING */}
            {loading && (
              <div className="rounded-2xl border border-dashed border-ink/20 py-16 text-center text-ink/50">
                Loading news…
              </div>
            )}

            {/* ERROR */}
            {!loading && error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 py-10 px-6 text-center text-red-700">
                <p className="font-semibold">
                  Unable to load school news.
                </p>

                <p className="mt-2 text-sm">
                  {error}
                </p>
              </div>
            )}

            {/* EMPTY */}
            {!loading &&
              !error &&
              news.length === 0 && (
                <div className="rounded-2xl border border-dashed border-ink/20 py-16 px-6 text-center text-ink/50">
                  <p className="text-lg font-semibold text-ink/60">
                    No news updates yet.
                  </p>

                  <p className="mt-2 text-sm">
                    Please check back soon for the
                    latest school news.
                  </p>
                </div>
              )}

            {/* NEWS */}
            {!loading &&
              !error &&
              news.map((item) => (
                <NewsCard
                  key={item.id}
                  item={item}
                  isAdmin={isAdmin}
                  onDelete={deleteNews}
                />
              ))}
          </div>

          {/* ADMIN PANEL */}
          <div className="order-1 lg:order-2 space-y-6">
            {ready &&
              (isAdmin ? (
                <AddNewsForm />
              ) : (
                <LoginPanel />
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}
