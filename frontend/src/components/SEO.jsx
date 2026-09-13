import { useEffect } from "react";

const SITE_URL = "https://drcprimaryschool.co.za";

export default function SEO({
  title,
  description,
  path = "/",
}) {
  useEffect(() => {
    const fullTitle = `${title} | DRC Primary School`;

    document.title = fullTitle;

    const setMeta = (name, content) => {
      let element = document.querySelector(`meta[name="${name}"]`);

      if (!element) {
        element = document.createElement("meta");
        element.setAttribute("name", name);
        document.head.appendChild(element);
      }

      element.setAttribute("content", content);
    };

    const setProperty = (property, content) => {
      let element = document.querySelector(
        `meta[property="${property}"]`
      );

      if (!element) {
        element = document.createElement("meta");
        element.setAttribute("property", property);
        document.head.appendChild(element);
      }

      element.setAttribute("content", content);
    };

    const canonicalUrl = `${SITE_URL}${path}`;

    setMeta("description", description);

    setProperty("og:title", fullTitle);
    setProperty("og:description", description);
    setProperty("og:url", canonicalUrl);

    const canonical =
      document.querySelector('link[rel="canonical"]') ||
      document.createElement("link");

    canonical.setAttribute("rel", "canonical");
    canonical.setAttribute("href", canonicalUrl);

    if (!canonical.parentNode) {
      document.head.appendChild(canonical);
    }
  }, [title, description, path]);

  return null;
}