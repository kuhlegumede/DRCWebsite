import { NavLink } from "react-router-dom";
import Crest from "./Crest";
import logo from "../assets/logo.jpeg";
import TriangleTrim from "./TriangleTrim";
import { SCHOOL } from "../data/schoolInfo";

export default function Footer() {
  return (
    <footer className="bg-ink text-cream mt-24">
      <TriangleTrim />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid gap-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Crest className="h-10 w-10" />
            <span className="font-display font-semibold text-lg">
              {SCHOOL.name}
            </span>
          </div>
          <p className="text-sm text-cream/70 leading-relaxed">
            {SCHOOL.vision}
          </p>
        </div>

        <div>
          <h3 className="font-mono text-xs uppercase tracking-widest text-gold mb-4">
            Visit &amp; Contact
          </h3>
          <ul className="space-y-2.5 text-sm text-cream/80">
            <li>{SCHOOL.postalAddress}</li>
            <li>{SCHOOL.streetAddress}</li>
            <li>
              <a href={SCHOOL.phoneHref} className="hover:text-sun transition-colors">
                {SCHOOL.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${SCHOOL.email}`}
                className="hover:text-sun transition-colors break-all"
              >
                {SCHOOL.email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-mono text-xs uppercase tracking-widest text-gold mb-4">
            Explore
          </h3>
          <ul className="space-y-2.5 text-sm">
            <li>
              <NavLink to="/about" className="text-cream/80 hover:text-sun transition-colors">
                About &amp; Vision
              </NavLink>
            </li>
            <li>
              <NavLink to="/events" className="text-cream/80 hover:text-sun transition-colors">
                Upcoming Events
              </NavLink>
            </li>
            <li>
              <NavLink to="/gallery" className="text-cream/80 hover:text-sun transition-colors">
                Gallery
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className="text-cream/80 hover:text-sun transition-colors">
                Contact Us
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-cream/50">
          <p>© {new Date().getFullYear()} {SCHOOL.name}. All rights reserved.</p>
          <p>Education is the key.</p>
        </div>
      </div>
    </footer>
  );
}
