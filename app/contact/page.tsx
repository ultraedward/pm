import { SiteFooter } from "@/components/SiteFooter";

export const metadata = {
  title: "Contact",
  description:
    "Get in touch with Lode. Questions, feedback, partnerships, or press — reach us at hello@lode.rocks.",
  alternates: {
    canonical: "https://lode.rocks/contact",
  },
  openGraph: {
    title: "Contact | Lode",
    description:
      "Reach the Lode team at hello@lode.rocks — questions, feedback, partnerships, or press.",
    url: "https://lode.rocks/contact",
  },
};

export default function ContactPage() {
  return (
    <>
    <main className="px-6 py-12 sm:py-24" style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}>
      <div className="mx-auto max-w-2xl space-y-12">

        <div>
          <p className="label mb-2">Get in touch</p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Contact</h1>
          <p className="mt-3 text-sm text-gray-500">
            Questions, feedback, partnerships, or press — we read every message.
          </p>
        </div>

        <div className="space-y-8 text-sm text-gray-400 leading-relaxed">

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">Email</h2>
            <p>
              The fastest way to reach us is{" "}
              <a
                href="mailto:hello@lode.rocks"
                className="text-amber-500 hover:text-amber-400 transition-colors"
              >
                hello@lode.rocks
              </a>
              . We respond to every email — usually within one business day.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">What to include</h2>
            <p>
              If you&rsquo;re reporting a bug, a short description and what you were doing when it happened helps us fix it faster. For feature requests, tell us what problem you&rsquo;re trying to solve — we&rsquo;ll often find a better way to help than the specific feature you had in mind.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">Other ways to reach us</h2>
            <p>
              Account-related questions can also be sent from the{" "}
              <a
                href="/account"
                className="text-amber-500 hover:text-amber-400 transition-colors"
              >
                Account
              </a>{" "}
              page once you&rsquo;re signed in. Privacy or data-deletion requests are handled the same way — see our{" "}
              <a
                href="/privacy"
                className="text-amber-500 hover:text-amber-400 transition-colors"
              >
                Privacy Policy
              </a>
              .
            </p>
          </section>

        </div>
      </div>
      </main>
    <SiteFooter />
  </>
  );
}
