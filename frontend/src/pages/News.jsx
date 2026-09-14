export default function NewsCard({ item }) {
  const { isAdmin } = useAdmin();
  const { deleteNews } = useNews();

  // 1. Guard check to stop undefined errors on initial render
  if (!item) return null;

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
      {/* 2. Extra safe check for images array */}
      {item?.images?.length > 0 && (
        <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
          {item.images.map((image) => (
            <img
              key={image.id}
              src={getImageUrl(image.imageUrl)}
              alt={image.caption || item.title || "News Image"}
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
          {item.publishedAtUtc &&
            new Date(item.publishedAtUtc).toLocaleDateString("en-ZA", {
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
