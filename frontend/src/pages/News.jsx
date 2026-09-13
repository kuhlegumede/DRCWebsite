import TriangleTrim from "../components/TriangleTrim";
import SEO from "../components/SEO";
import NewsCard from "../components/NewsCard";
import AddNewsForm from "../components/AddNewsForm";

import { useNews } from "../context/NewsContext";
import { useAdmin } from "../context/AdminContext";

export default function News() {
  const {
    news,
    loading,
    error,
  } = useNews();

  const {
    isAdmin,
  } = useAdmin();

  return (
    <div>
      <SEO
        title="News & Updates"
        description="Read the latest news, activities, celebrations, trips and updates from DRC Primary School in Tsolo, Eastern Cape."
        path="/news"
      />

      <section className="bg-ink px-6 pb-20 pt-20 text-cream">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-sun">
            DRC Primary School
          </p>

          <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight sm:text-6xl">
            News & Updates
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-cream/70">
            Discover what has been happening at our school,
            from learner activities and educational trips to
            celebrations, meetings and community moments.
          </p>
        </div>
      </section>

      <TriangleTrim />

      <main className="bg-white px-6 py-16">
        <div className="mx-auto max-w-6xl">
          {isAdmin && (
            <div className="mb-12">
              <AddNewsForm />
            </div>
          )}

          {loading && (
            <div className="py-16 text-center text-ink/50">
              Loading school news...
            </div>
          )}

          {error && (
            <div className="rounded-2xl bg-red-50 p-5 text-red-700">
              {error}
            </div>
          )}

          {!loading &&
            !error &&
            news.length === 0 && (
              <div className="rounded-3xl bg-cream p-10 text-center">
                <h2 className="text-2xl font-black text-ink">
                  No news updates yet
                </h2>

                <p className="mt-3 text-ink/60">
                  School news and updates will appear here.
                </p>
              </div>
            )}

          {!loading &&
            news.length > 0 && (
              <div className="space-y-10">
                {news.map((item) => (
                  <NewsCard
                    key={item.id}
                    item={item}
                  />
                ))}
              </div>
            )}
        </div>
      </main>
    </div>
  );
}