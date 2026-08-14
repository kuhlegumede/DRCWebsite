import { NavLink } from "react-router-dom";
import TriangleTrim from "../components/TriangleTrim";
import { useEvents } from "../context/EventsContext";
import { SCHOOL, PRINCIPAL } from "../data/schoolInfo";
import groupPhoto from "../assets/group-blockb.jpg";
import principalPhoto from "../assets/principal.jpg";
import assemblyPhoto from "../assets/assembly.jpg";
import zumbaPhoto from "../assets/zumba-staff.jpg";
import iceCreamPhoto from "../assets/icecream-day.jpg";

function formatDate(dateStr) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-ZA", {
    weekday: "short",
    day: "numeric",
    month: "long",
  });
}

export default function Home() {
  const { upcoming } = useEvents();

  return (
    <div>
      <section className="relative overflow-hidden bg-ink text-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16 lg:pt-20 lg:pb-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-gold bg-gold/10 border border-gold/30 rounded-full px-3 py-1.5">
              Tsolo · Eastern Cape
            </span>
            <h1 className="font-display font-semibold text-4xl sm:text-5xl lg:text-6xl leading-[1.05] mt-6">
              Life skills and learning,
              <span className="text-sun"> for every child.</span>
            </h1>
            <p className="mt-6 text-lg text-cream/75 max-w-xl leading-relaxed">
              {SCHOOL.vision}
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <NavLink
                to="/about"
                className="inline-flex items-center justify-center rounded-lg bg-sun text-ink font-semibold px-6 py-3 hover:bg-gold transition-colors"
              >
                Our Vision &amp; Mission
              </NavLink>
              <NavLink
                to="/events"
                className="inline-flex items-center justify-center rounded-lg border border-cream/30 text-cream font-semibold px-6 py-3 hover:bg-cream/10 transition-colors"
              >
                Upcoming Events
              </NavLink>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-2xl bg-sun/20 rotate-2" aria-hidden="true" />
            <img
              src={groupPhoto}
              alt="DRC Primary School learners and staff gathered outside Block B, celebrating together in traditional dress"
              className="relative rounded-2xl shadow-2xl w-full h-[340px] sm:h-[420px] object-cover"
            />
          </div>
        </div>
        <TriangleTrim />
      </section>

      {/* ---------------- Quick facts ---------------- */}
      <section className="bg-cream border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-wrap gap-x-10 gap-y-4 justify-between font-mono text-xs sm:text-sm text-ink/70">
          <p><span className="text-sun-dark font-bold">Address —</span> {SCHOOL.streetAddress}</p>
          <p><span className="text-sun-dark font-bold">Phone —</span> {SCHOOL.phone}</p>
          <p><span className="text-sun-dark font-bold">Postal —</span> {SCHOOL.postalAddress}</p>
        </div>
      </section>

      {/* ---------------- Principal's message ---------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 grid lg:grid-cols-5 gap-12 items-start">
        <div className="lg:col-span-2">
          <div className="relative">
            <div className="absolute -inset-3 rounded-2xl bg-gold/25 -rotate-2" aria-hidden="true" />
            <img
              src={principalPhoto}
              alt={`${PRINCIPAL.name}, ${PRINCIPAL.title}`}
              className="relative rounded-2xl shadow-xl w-full max-w-sm mx-auto object-cover"
            />
          </div>
        </div>
        <div className="lg:col-span-3">
          <p className="font-mono text-xs uppercase tracking-widest text-sun-dark mb-3">
            A Message From
          </p>
          <h2 className="font-display font-semibold text-3xl sm:text-4xl text-ink mb-2">
            {PRINCIPAL.name}
          </h2>
          <p className="text-ink/50 text-sm mb-8">{PRINCIPAL.title}</p>
          <div className="space-y-5 text-ink/80 leading-relaxed text-[15px] sm:text-base">
            {PRINCIPAL.message.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-ink/10">
        <p className="text-sm text-ink/60 italic">
           Warm regards,
       </p>

       <p className="mt-1 font-display text-xl font-semibold text-sun-dark">
           Nombulelo Zuma Gumede
      </p>
     </div>
        </div>
      </section>

      <TriangleTrim variant="gold" size="sm" />

      {/* ---------------- Vision ---------------- */}
      <section className="bg-ink text-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-gold mb-4">Our Vision</p>
          <p className="font-display font-medium text-2xl sm:text-3xl leading-snug">
            &ldquo;{SCHOOL.vision}&rdquo;
          </p>
        </div>
      </section>

      {/* ---------------- Community moments ---------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-sun-dark mb-3">
              Around the School
            </p>
            <h2 className="font-display font-semibold text-3xl sm:text-4xl text-ink">
              Life at DRC Primary
            </h2>
          </div>
          <NavLink
            to="/gallery"
            className="text-sm font-semibold text-sun-dark hover:text-sun transition-colors"
          >
            View full gallery →
          </NavLink>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          <figure className="group overflow-hidden rounded-xl border border-ink/10">
            <img src={assemblyPhoto} alt="Learners gathered for a whole-school assembly" className="h-64 w-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <figcaption className="p-4 text-sm text-ink/70 bg-white">Whole-school assembly and performances</figcaption>
          </figure>
          <figure className="group overflow-hidden rounded-xl border border-ink/10">
            <img src={zumbaPhoto} alt="Staff taking part in a wellness and fitness session" className="h-64 w-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <figcaption className="p-4 text-sm text-ink/70 bg-white">Staff wellness &amp; fitness sessions</figcaption>
          </figure>
          <figure className="group overflow-hidden rounded-xl border border-ink/10">
            <img src={iceCreamPhoto} alt="Learners in uniform enjoying an ice cream treat day" className="h-64 w-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <figcaption className="p-4 text-sm text-ink/70 bg-white">Treat days &amp; small celebrations</figcaption>
          </figure>
        </div>
      </section>

      {/* ---------------- Events preview ---------------- */}
      <section className="bg-cream border-t border-ink/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-sun-dark mb-3">
                Mark Your Calendar
              </p>
              <h2 className="font-display font-semibold text-3xl sm:text-4xl text-ink">
                Upcoming Events
              </h2>
            </div>
            <NavLink
              to="/events"
              className="text-sm font-semibold text-sun-dark hover:text-sun transition-colors"
            >
              View all events →
            </NavLink>
          </div>

          {upcoming.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-ink/20 py-16 text-center text-ink/50">
              No events scheduled at the moment — please check back soon.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcoming.slice(0, 3).map((event) => (
                <article
                  key={event.id}
                  className="bg-white rounded-xl border border-ink/10 p-6 flex flex-col hover:shadow-lg transition-shadow"
                >
                  <span className="font-mono text-xs uppercase tracking-widest text-sun-dark mb-3">
                    {formatDate(event.date)}{event.time ? ` · ${event.time}` : ""}
                  </span>
                  <h3 className="font-display font-semibold text-xl text-ink mb-2">
                    {event.title}
                  </h3>
                  {event.location && (
                    <p className="text-sm text-ink/50 mb-3">{event.location}</p>
                  )}
                  {event.description && (
                    <p className="text-sm text-ink/70 leading-relaxed">
                      {event.description}
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
