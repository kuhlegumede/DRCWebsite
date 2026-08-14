import TriangleTrim from "../components/TriangleTrim";
import { SCHOOL } from "../data/schoolInfo";
import signPhoto from "../assets/school-sign.jpg";

export default function About() {
  return (
    <div>
      <section className="bg-ink text-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <p className="font-mono text-xs uppercase tracking-widest text-gold mb-4">
            About Our School
          </p>
          <h1 className="font-display font-semibold text-4xl sm:text-5xl max-w-3xl">
            Vision &amp; Mission
          </h1>
        </div>
        <TriangleTrim />
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-3">
          <div className="mb-16">
            <p className="font-mono text-xs uppercase tracking-widest text-sun-dark mb-3">
              Vision
            </p>
            <p className="font-display font-medium text-2xl sm:text-3xl text-ink leading-snug">
              {SCHOOL.vision}
            </p>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-sun-dark mb-6">
              Mission
            </p>
            <p className="text-ink/70 leading-relaxed mb-8 max-w-2xl">
              At DRC Primary School, we are a community of learners, educators and
              parents who believe that every child deserves the opportunity to learn,
              grow and shine. We are committed to respecting our country, celebrating
              our heritage and building a school community founded on kindness,
              responsibility, respect and unity. Together, we strive to create a school
              where:
            </p>
            <ol className="space-y-5">
              {SCHOOL.mission.map((item, i) => (
                <li key={i} className="flex gap-4">
                  <span className="shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-sun/15 text-sun-dark font-mono text-sm font-bold">
                    {i + 1}
                  </span>
                  <p className="text-ink/80 leading-relaxed pt-1">{item}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="sticky top-28">
            <img
              src={signPhoto}
              alt="DRC Junior Secondary School signboard displaying the school's vision and mission"
              className="rounded-xl border border-ink/10 shadow-md w-full object-cover"
            />
            <p className="mt-3 text-xs text-ink/50 font-mono">
              Our founding values, on display.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
