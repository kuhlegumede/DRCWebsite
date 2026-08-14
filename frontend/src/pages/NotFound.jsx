import { NavLink } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-32 text-center">
      <p className="font-mono text-sun-dark text-sm mb-3">404</p>
      <h1 className="font-display font-semibold text-4xl text-ink mb-4">
        This page can't be found.
      </h1>
      <p className="text-ink/60 mb-8">
        The page you're looking for may have moved or doesn't exist.
      </p>
      <NavLink
        to="/"
        className="inline-flex rounded-lg bg-ink text-cream font-semibold px-6 py-3 hover:bg-sun transition-colors"
      >
        Back to Home
      </NavLink>
    </div>
  );
}
