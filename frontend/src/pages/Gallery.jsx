import TriangleTrim from "../components/TriangleTrim";
import groupPhoto from "../assets/group-blockb.jpg";
import zumbaPhoto from "../assets/zumba-staff.jpg";
import iceCreamPhoto from "../assets/icecream-day.jpg";
import signPhoto from "../assets/school-sign.jpg";
import assemblyPhoto from "../assets/assembly.jpg";
import visit from "../assets/visit.jpeg";
import free from "../assets/freedom-day.jpeg";

const photos = [
  {
    src: groupPhoto,
    alt: "Learners and staff gathered outside Block B in traditional dress, celebrating together",
    caption: "Heritage celebrations outside Block B",
  },
  {
    src: assemblyPhoto,
    alt: "Learners in uniform gathered for a whole-school assembly",
    caption: "Cultural Day",
  },
  {
    src: visit,
    alt: "Special visit from officials",
    caption: "Special Vist"
  },
  {
    src: free,
    alt:"Freedom day celebrations",
    caption: "Freedom Day celebrations"
  },
  {
    src: iceCreamPhoto,
    alt: "Learners in uniform enjoying an ice cream treat day",
    caption: "A treat day for our learners",
  },
  {
    src: zumbaPhoto,
    alt: "Staff members taking part in an outdoor fitness and wellness session",
    caption: "Staff wellness &amp; team spirit",
  },
  {
    src: signPhoto,
    alt: "School signboard displaying the vision and mission of the school",
    caption: "Our founding vision, on display",
  },
];

export default function Gallery() {
  return (
    <div>
      <section className="bg-ink text-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <p className="font-mono text-xs uppercase tracking-widest text-gold mb-4">
            Photo Gallery
          </p>
          <h1 className="font-display font-semibold text-4xl sm:text-5xl max-w-2xl">
            Life at DRC Primary School
          </h1>
        </div>
        <TriangleTrim />
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {photos.map((photo, i) => (
            <figure
              key={i}
              className="break-inside-avoid rounded-xl overflow-hidden border border-ink/10 bg-white group"
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <figcaption className="p-4 text-sm text-ink/70">
                {photo.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </div>
  );
}
