import { useState } from "react";
import { useNews } from "../context/NewsContext";

export default function AddNewsForm() {
  const { addNews } = useNews();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleImages(event) {
    const files = Array.from(event.target.files || []);

    setImages(files);

    const previewUrls = files.map((file) =>
      URL.createObjectURL(file)
    );

    setPreviews(previewUrls);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!title.trim()) {
      setError("Please enter a title.");
      return;
    }

    if (!content.trim()) {
      setError("Please enter the update.");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("title", title.trim());
      formData.append("content", content.trim());

      images.forEach((image) => {
        formData.append("images", image);
      });

      await addNews(formData);

      setTitle("");
      setContent("");
      setImages([]);
      setPreviews([]);

      setMessage("News update published successfully.");
    } catch (err) {
      setError(
        err.message ||
          "Could not publish the update."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-3xl bg-cream p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
          Admin
        </p>

        <h2 className="mt-2 text-2xl font-black text-ink">
          Add News & Update
        </h2>

        <p className="mt-2 text-sm text-ink/60">
          Share recent school activities, celebrations,
          meetings, trips and other important moments.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <div>
          <label className="mb-2 block text-sm font-bold text-ink">
            Title
          </label>

          <input
            type="text"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            placeholder="e.g. Grade 7 Educational Trip"
            maxLength={200}
            className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-ink outline-none transition focus:border-gold"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-ink">
            Update
          </label>

          <textarea
            value={content}
            onChange={(e) =>
              setContent(e.target.value)
            }
            placeholder="Tell parents and the community what happened..."
            rows={7}
            maxLength={10000}
            className="w-full resize-y rounded-2xl border border-ink/10 bg-white px-4 py-3 text-ink outline-none transition focus:border-gold"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-ink">
            Photos
          </label>

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleImages}
            className="block w-full cursor-pointer rounded-2xl border border-dashed border-ink/20 bg-white p-4 text-sm"
          />

          <p className="mt-2 text-xs text-ink/50">
            JPG, PNG or WEBP. Maximum 5 MB per image.
          </p>
        </div>

        {previews.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {previews.map((preview, index) => (
              <div
                key={preview}
                className="overflow-hidden rounded-2xl bg-white"
              >
                <img
                  src={preview}
                  alt={`Selected preview ${index + 1}`}
                  className="h-32 w-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div className="rounded-2xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-ink px-6 py-3 text-sm font-bold text-cream transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving
            ? "Publishing..."
            : "Publish Update"}
        </button>
      </form>
    </div>
  );
}