import { useState } from "react";
import TriangleTrim from "../components/TriangleTrim";
import { SCHOOL } from "../data/schoolInfo";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/Contact`;

const infoItems = [
  {
    label: "Postal Address",
    value: SCHOOL.postalAddress,
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M3 8l9 6 9-6M4 6h16a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1z"
      />
    ),
  },
  {
    label: "Physical Address",
    value: SCHOOL.streetAddress,
    icon: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.5 10.5c0 5-6 10.5-6 10.5s-6-5.5-6-10.5a6 6 0 1112 0z" />
        <circle cx="11.5" cy="10.5" r="2.2" strokeWidth={1.8} />
      </>
    ),
  },
  {
    label: "Phone",
    value: SCHOOL.phone,
    href: SCHOOL.phoneHref,
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M3 5.5C3 4.7 3.7 4 4.5 4h2.6c.5 0 .9.3 1 .8l1 3.6c.1.5-.1 1-.5 1.3L7 11c1 2.4 2.9 4.3 5.3 5.3l1.3-1.6c.3-.4.8-.6 1.3-.5l3.6 1c.5.1.8.5.8 1v2.6c0 .8-.7 1.5-1.5 1.5C10.6 20.3 3.7 13.4 3 5.5z"
      />
    ),
  },
  {
    label: "Email",
    value: SCHOOL.email,
    href: `mailto:${SCHOOL.email}`,
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M3 6.5A1.5 1.5 0 014.5 5h15A1.5 1.5 0 0121 6.5v11a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 17.5v-11zM3.5 6l8.5 6.5L20.5 6"
      />
    ),
  },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", body: "" });
  const [status, setStatus] = useState({ state: "idle", message: "" });

  const handleChange = (e) => {
    const { id, value } = e.target;
    const key = id.replace("c-", "");
    setForm((prev) => ({ ...prev, [key]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ state: "sending", message: "" });

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      setStatus({ state: "success", message: "Message sent! You will be contacted soon." });
      setForm({ name: "", email: "", subject: "", body: "" });
    } catch (err) {
      setStatus({ state: "error", message: err.message });
    }
  };

  return (
    <div>
      <section className="bg-ink text-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <p className="font-mono text-xs uppercase tracking-widest text-gold mb-4">
            Get in Touch
          </p>
          <h1 className="font-display font-semibold text-4xl sm:text-5xl max-w-2xl">
            Contact DRC Primary School
          </h1>
        </div>
        <TriangleTrim />
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-2 space-y-5">
          {infoItems.map((item) => (
            <div
              key={item.label}
              className="flex items-start gap-4 bg-white rounded-xl border border-ink/10 p-5"
            >
              <span className="shrink-0 flex items-center justify-center h-11 w-11 rounded-lg bg-sun/15 text-sun-dark">
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                  {item.icon}
                </svg>
              </span>
              <div className="min-w-0">
                <p className="font-mono text-[11px] uppercase tracking-widest text-ink/40 mb-1">
                  {item.label}
                </p>
                {item.href ? (
                  <a
                    href={item.href}
                    className="text-ink font-semibold hover:text-sun transition-colors break-words"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="text-ink font-semibold break-words">{item.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-ink/10 p-6 sm:p-8">
            <h2 className="font-display font-semibold text-2xl text-ink mb-2">
              Send us a message
            </h2>
            <p className="text-sm text-ink/60 mb-6">
              Have a question for the school office? Fill in the form below
              and we'll get back to you.
            </p>

            {status.state === "success" ? (
              <div className="rounded-lg bg-sun/10 border border-sun/30 p-5 text-ink">
                <p className="font-semibold mb-1">Thank you.</p>
                <p className="text-sm text-ink/70">
                  Your message has been noted. For urgent matters, please call{" "}
                  <a href={SCHOOL.phoneHref} className="text-sun-dark font-semibold">
                    {SCHOOL.phone}
                  </a>{" "}
                  directly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink/60 mb-1.5" htmlFor="c-name">
                    Full name
                  </label>
                  <input
                    id="c-name"
                    required
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-ink/15 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sun"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink/60 mb-1.5" htmlFor="c-email">
                    Email address
                  </label>
                  <input
                    id="c-email"
                    required
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-ink/15 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sun"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-ink/60 mb-1.5" htmlFor="c-subject">
                    Subject
                  </label>
                  <input
                    id="c-subject"
                    required
                    type="text"
                    value={form.subject}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-ink/15 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sun"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-ink/60 mb-1.5" htmlFor="c-message">
                    Message
                  </label>
                  <textarea
                    id="c-body"
                    required
                    rows={5}
                    value={form.body}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-ink/15 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sun resize-none"
                  />
                </div>
                {status.state === "error" && (
                  <div className="sm:col-span-2 text-sm text-red-600">
                    {status.message}
                  </div>
                )}

                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    disabled={status.state === "sending"}
                    className="rounded-lg bg-sun text-ink font-semibold px-6 py-3 hover:bg-gold transition-colors disabled:opacity-60"
                  >
                    {status.state === "sending" ? "Sending..." : "Send Message"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
