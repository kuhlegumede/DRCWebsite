import { useEffect } from "react";
import { SCHOOL } from "../data/schoolInfo";

export default function SchoolSchema() {
  useEffect(() => {
    const id = "school-structured-data";

    const existing = document.getElementById(id);

    if (existing) {
      existing.remove();
    }

    const schema = {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "@id": "https://drcprimaryschool.co.za/#school",
      name: "DRC Primary School",
      url: "https://drcprimaryschool.co.za/",
      description:
        "DRC Primary School is a primary school in Tsolo, Eastern Cape, South Africa.",
      telephone: SCHOOL.phone,
      email: SCHOOL.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: SCHOOL.streetAddress,
        postalCode: SCHOOL.postalAddress,
        addressLocality: "Tsolo",
        addressRegion: "Eastern Cape",
        addressCountry: "ZA",
      },
    };

    const script = document.createElement("script");

    script.id = id;
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schema);

    document.head.appendChild(script);

    return () => {
      document.getElementById(id)?.remove();
    };
  }, []);

  return null;
}