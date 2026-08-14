export default function TriangleTrim({ variant = "orange", size = "default" }) {
  const colorClass = variant === "gold" ? "triangle-trim--gold" : "";
  const sizeClass = size === "sm" ? "triangle-trim--sm" : "";
  return (
    <div
      className={`triangle-trim ${colorClass} ${sizeClass}`}
      role="presentation"
      aria-hidden="true"
    />
  );
}
