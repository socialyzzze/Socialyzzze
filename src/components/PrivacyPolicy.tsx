import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Lock,
  Mail,
  MessageSquare,
  Phone,
  ShieldCheck,
  Trash2,
} from "lucide-react";

const COMPANY_NAME = "Socialyzzze";
const COMPANY_LOCATION = "Delhi NCR, India";
const CONTACT_EMAIL = "socialyzzze@gmail.com";
const PHONE_DISPLAY = "+91 98104 08596";
const PHONE_LINK = "+919810408596";
const WHATSAPP_DISPLAY = "+91 98104 08596";
const WHATSAPP_LINK = "https://wa.me/919810408596";
const LOCATION_LINE = "Delhi NCR · India · Working Worldwide";
const LAST_UPDATED = "4 October 2026";

interface PolicySection {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  after?: string;
}

const HIGHLIGHTS = [
  {
    icon: Lock,
    title: "Only what we need",
    text: "We collect the minimum information required to respond to you and run our website.",
  },
  {
    icon: ShieldCheck,
    title: "Never sold",
    text: "We do not sell your personal data to anyone, for any reason.",
  },
  {
    icon: Trash2,
    title: "Your choice",
    text: "You can ask us to access, correct or delete your data at any time.",
  },
];

const SECTIONS: PolicySection[] = [
  {
    title: "Who we are",
    paragraphs: [
      `${COMPANY_NAME} is a digital growth agency based in ${COMPANY_LOCATION}. We help brands grow through social media, creative content, performance marketing and web solutions. This policy explains how we collect, use and protect personal data when you visit our website or get in touch with us.`,
      `For the purposes of this policy, ${COMPANY_NAME} is the party that decides how and why your personal data is processed.`,
    ],
  },
  {
    title: "Information we collect",
    paragraphs: ["We collect only the information we need to respond to you and run our website."],
    bullets: [
      "Information you give us: your name, email address, phone number, company name and the message you send through our contact form, by email, by phone or on WhatsApp.",
      "Information collected automatically: your IP address, browser type, device type, pages visited and the time you spend on them, collected through cookies and similar technologies.",
      "Information from communications: records of the correspondence between you and us, including project briefs you choose to share.",
    ],
  },
  {
    title: "How we use your information",
    bullets: [
      "To reply to your enquiries and provide the services you ask about.",
      "To prepare proposals, manage projects and handle invoicing with our clients.",
      "To understand how our website is used and improve its performance and content.",
      "To keep our website secure and prevent misuse.",
      "To meet our legal and regulatory obligations.",
      "To send you updates about our work, only where you have agreed to receive them. You can opt out at any time.",
    ],
  },
  {
    title: "Consent and legal basis",
    paragraphs: [
      "We process your personal data with your consent, for example when you submit our contact form or message us, or where it is needed to respond to your request, perform a contract, or comply with the law.",
      "Where we rely on your consent, you can withdraw it at any time by contacting us using the details at the end of this policy. Withdrawing consent does not affect processing that took place before you withdrew it.",
    ],
  },
  {
    title: "Cookies and analytics",
    paragraphs: [
      "Cookies are small files stored on your device. We use essential cookies that the website needs to work. Where we use analytics or marketing cookies, we ask for your consent first where the law requires it, and you can change your choice at any time.",
      "You can also block or delete cookies in your browser settings. Blocking essential cookies may stop parts of the site from working properly.",
    ],
  },
  {
    title: "Who we share your data with",
    paragraphs: ["We do not sell your personal data. We share it only in these situations:"],
    bullets: [
      "Service providers that help us run our business, such as website hosting, email, form handling, analytics and project management tools. They may only use your data to provide their service to us.",
      "Professional advisers, such as accountants and lawyers, where needed.",
      "Authorities, courts or regulators where we are legally required to do so.",
      "A successor business, if our business is ever merged, sold or restructured. In that case your data would remain protected under this policy.",
    ],
  },
  {
    title: "International transfers",
    paragraphs: [
      "We work with clients worldwide, and some of our service providers may be located outside India or outside your country. Where your data is transferred, we take reasonable steps to make sure it stays protected and is handled in line with this policy and applicable law.",
    ],
  },
  {
    title: "How long we keep your data",
    paragraphs: [
      "We keep personal data only for as long as we need it for the purposes above, or as the law requires. Enquiries that do not lead to a project are normally deleted within a reasonable period. Client and invoicing records are kept for the period required by tax and accounting law. When data is no longer needed, we delete or anonymise it.",
    ],
  },
  {
    title: "How we protect your data",
    paragraphs: [
      "We use reasonable technical and organisational measures to protect personal data against loss, misuse and unauthorised access, including access controls and encrypted connections (HTTPS). No method of transmission over the internet is completely secure, so we cannot guarantee absolute security.",
      "If a personal data breach affects you, we will notify you and the relevant authorities where the law requires us to.",
    ],
  },
  {
    title: "Your rights",
    paragraphs: ["Depending on where you live, you may have the right to:"],
    bullets: [
      "Ask what personal data we hold about you and how we use it.",
      "Ask us to correct or update inaccurate or incomplete data.",
      "Ask us to delete your personal data.",
      "Withdraw your consent at any time.",
      "Object to or ask us to restrict certain processing and, where applicable, receive a copy of your data in a portable format.",
      "Nominate another person to exercise your rights on your behalf if you are unable to, where the law allows.",
      "Make a complaint to us, or to the data protection authority in your country.",
    ],
    after: `To use any of these rights, email us at ${CONTACT_EMAIL} or message us using the details at the end of this policy. We may need to verify your identity before we act on a request, and we will respond within the time required by applicable law.`,
  },
  {
    title: "Children",
    paragraphs: [
      "Our website and services are meant for businesses and are not directed at children. We do not knowingly collect personal data from anyone under 18. If you believe a child has given us personal data, contact us and we will delete it.",
    ],
  },
  {
    title: "Third-party links",
    paragraphs: [
      "Our website may link to other websites and social platforms, such as Instagram, X, LinkedIn and WhatsApp. We are not responsible for their privacy practices, so please read their policies before sharing information with them.",
    ],
  },
  {
    title: "Changes to this policy",
    paragraphs: [
      "We may update this policy from time to time. The latest version will always be on this page, with the date it was last updated shown at the top. If we make a significant change, we will make that clear on our website.",
    ],
  },
];

const CONTACT_TITLE = "Contact and grievances";
const TOC_TITLES = [...SECTIONS.map((section) => section.title), CONTACT_TITLE];

const sectionId = (index: number) => `section-${index + 1}`;
const pad = (index: number) => String(index + 1).padStart(2, "0");

export function PrivacyPolicy() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const ids = TOC_TITLES.map((_, index) => sectionId(index));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(ids.indexOf(entry.target.id));
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    ids.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (index: number) => {
    document.getElementById(sectionId(index))?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="min-h-screen bg-[#0E090B] text-buttercream">
      <header className="border-b border-buttercream/10">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 md:px-16">
          <a
            href="#/"
            className="flex items-center gap-2.5 font-display text-base font-bold uppercase tracking-[0.2em] text-buttercream sm:text-lg"
          >
            <img src="/logo.png" alt="" className="h-9 w-9 rounded-full object-cover" />
            SOCIALYZZZE
          </a>
          <a
            href="#/"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-blood-accent transition-colors hover:text-buttercream"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to home
          </a>
        </div>
      </header>

      <section className="border-b border-buttercream/10">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-28 md:px-16">
          <span className="mb-4 block font-mono text-xs font-bold uppercase tracking-[0.3em] text-whispy-light">
            Legal
          </span>
          <h1 className="font-display text-5xl font-black uppercase leading-[0.95] tracking-tight sm:text-7xl md:text-8xl">
            <span className="block text-buttercream">Privacy</span>
            <span className="block text-blood-accent">Policy</span>
          </h1>
          <p className="mt-8 max-w-2xl text-sm leading-relaxed text-buttercream/70 sm:text-base">
            How {COMPANY_NAME} collects, uses and protects your personal data when you visit our website or work with
            us. We have written it in plain language, because you should be able to understand it.
          </p>
          <p className="mt-6 font-mono text-xs uppercase tracking-widest text-buttercream/45">
            Last updated: {LAST_UPDATED}
          </p>

          <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">
            {HIGHLIGHTS.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-2xl border border-buttercream/10 bg-buttercream/[0.02] p-6"
              >
                <Icon className="mb-4 h-5 w-5 text-blood-accent" />
                <h3 className="mb-2 font-display text-sm font-extrabold uppercase tracking-wider text-buttercream">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-buttercream/60">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 md:px-16 lg:grid lg:grid-cols-[260px_1fr] lg:gap-16">
        <nav aria-label="Table of contents" className="hidden self-start lg:sticky lg:top-12 lg:block">
          <span className="mb-5 block font-mono text-xs font-bold uppercase tracking-[0.3em] text-whispy-light">
            On this page
          </span>
          <ul className="flex flex-col border-l border-buttercream/10">
            {TOC_TITLES.map((title, index) => (
              <li key={title}>
                <button
                  type="button"
                  onClick={() => scrollToSection(index)}
                  className={`-ml-px flex w-full items-baseline gap-3 border-l py-2 pl-4 text-left text-xs transition-colors ${active === index
                      ? "border-blood-accent text-buttercream"
                      : "border-transparent text-buttercream/45 hover:text-buttercream/80"
                    }`}
                >
                  <span className="font-mono text-[10px] text-blood-accent">{pad(index)}</span>
                  <span className="font-semibold uppercase tracking-wider">{title}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-5">
          {SECTIONS.map((section, index) => (
            <section
              key={section.title}
              id={sectionId(index)}
              className="scroll-mt-12 rounded-2xl border border-buttercream/10 bg-buttercream/[0.02] p-6 sm:p-9"
            >
              <div className="mb-5 flex items-center gap-4">
                <span className="rounded border border-blood-accent/30 px-2.5 py-0.5 font-mono text-xs font-bold text-blood-accent">
                  {pad(index)}
                </span>
                <h2 className="font-display text-lg font-black uppercase tracking-tight sm:text-2xl">
                  {section.title}
                </h2>
              </div>

              <div className="flex flex-col gap-4 text-sm leading-relaxed text-buttercream/70 sm:text-base">
                {section.paragraphs?.map((text) => (
                  <p key={text}>{text}</p>
                ))}

                {section.bullets && (
                  <ul className="flex list-disc flex-col gap-2.5 pl-5 marker:text-blood-accent">
                    {section.bullets.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}

                {section.after && <p>{section.after}</p>}
              </div>
            </section>
          ))}

          <section
            id={sectionId(SECTIONS.length)}
            className="scroll-mt-12 rounded-2xl border border-blood-accent/30 bg-blood-accent/[0.06] p-6 sm:p-9"
          >
            <div className="mb-5 flex items-center gap-4">
              <span className="rounded border border-blood-accent/40 px-2.5 py-0.5 font-mono text-xs font-bold text-blood-accent">
                {pad(SECTIONS.length)}
              </span>
              <h2 className="font-display text-lg font-black uppercase tracking-tight sm:text-2xl">
                {CONTACT_TITLE}
              </h2>
            </div>

            <p className="mb-8 max-w-2xl text-sm leading-relaxed text-buttercream/70 sm:text-base">
              If you have a question about this policy, want to use your rights, or wish to raise a concern about how
              we handle your data, reach us through any of the channels below. We aim to reply promptly, and within
              the time required by applicable law.
            </p>

            <div className="flex flex-col gap-5">
              <a href={`mailto:${CONTACT_EMAIL}`} className="group flex items-center gap-4">
                <Mail className="h-5 w-5 shrink-0 text-whispy-light" />
                <span className="text-base font-bold text-buttercream underline decoration-buttercream/40 underline-offset-4 transition-colors group-hover:decoration-buttercream sm:text-lg">
                  {CONTACT_EMAIL}
                </span>
              </a>

              <a href={`tel:${PHONE_LINK}`} className="group flex items-center gap-4">
                <Phone className="h-5 w-5 shrink-0 text-whispy-light" />
                <span className="text-base text-buttercream/65 transition-colors group-hover:text-buttercream sm:text-lg">
                  Phone: {PHONE_DISPLAY}
                </span>
              </a>

              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4"
              >
                <MessageSquare className="h-5 w-5 shrink-0 text-whispy-light" />
                <span className="flex items-center gap-2 text-base font-bold text-whispy-light transition-colors group-hover:text-buttercream sm:text-lg">
                  WhatsApp: {WHATSAPP_DISPLAY}
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </a>
            </div>

            <p className="mt-8 text-xs tracking-wide text-buttercream/40">{LOCATION_LINE}</p>
          </section>
        </div>
      </div>

      <footer className="border-t border-buttercream/10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-6 py-8 text-xs text-buttercream/45 sm:flex-row sm:items-center md:px-16">
          <span>
            © {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.
          </span>
          <a
            href="#/"
            className="inline-flex items-center gap-2 font-bold uppercase tracking-[0.2em] text-blood-accent transition-colors hover:text-buttercream"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to home
          </a>
        </div>
      </footer>
    </main>
  );
}

export default PrivacyPolicy;