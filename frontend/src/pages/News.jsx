import { useAdmin } from "../context/AdminContext";
import { useNews } from "../context/NewsContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export default function NewsCard({ item }) {
  const { isAdmin } = useAdmin();
  const { deleteNews } = useNews();

  // Helper to safely construct absolute image URLs
  function getImageUrl(path) {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const cleanBase = API_BASE_URL.replace(/\/+$/, "");
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${cleanBase}${cleanPath}`;
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this news update?"
    );

    if (!confirmed) return;

    try {
      await deleteNews(item.id);
    } catch (error) {
      alert(
        error.message ||
          "Could not delete this update."
      );
    }
  }

  return (
    <article className="overflow-hidden rounded-3xl bg-cream shadow-sm">
      {item.images?.length > 0 && (
        <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
          {item.images.map((image) => (
            <img
              key={image.id}
              src={getImageUrl(image.imageUrl)}
              alt={image.caption || item.title}
              className="h-64 w-full object-cover"
            />
          ))}
        </div>
      )}

      <div className="p-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">
          School News
        </p>

        <h2 className="mt-2 text-2xl font-black text-ink">
          {item.title}
        </h2>

        <p className="mt-2 text-sm text-ink/50">
          {new Date(
            item.publishedAtUtc
          ).toLocaleDateString("en-ZA", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>

        <div className="mt-5 whitespace-pre-line text-base leading-7 text-ink/75">
          {item.content}
        </div>

        {isAdmin && (
          <button
            type="button"
            onClick={handleDelete}
            className="mt-6 rounded-full border border-red-200 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-50"
          >
            Delete Update
          </button>
        )}
      </div>
    </article>
  );
}
