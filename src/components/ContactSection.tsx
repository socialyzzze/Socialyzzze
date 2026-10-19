import React, { useState } from "react";
import { ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

interface FormData {
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
}

const SERVICES = [
  "Social Media Management",
  "Video Production",
  "Brand Strategy",
  "Performance Marketing",
  "Web Development",
];

const INITIAL_FORM_DATA: FormData = {
  name: "",
  phone: "",
  email: "",
  service: "Social Media Management",
  message: "",
};

export function ContactSection() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [botcheck, setBotcheck] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Your name is required";
    }

    const cleanPhone = formData.phone.trim().replace(/[\s\-()]/g, "");
    if (!cleanPhone) {
      newErrors.phone = "WhatsApp / phone is required";
    } else if (!/^(?:\+?91|0)?[6-9]\d{9}$/.test(cleanPhone)) {
      newErrors.phone = "Enter a valid 10-digit Indian number (+91)";
    }

    const cleanEmail = formData.email.trim();
    if (!cleanEmail) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(cleanEmail)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Brief message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (serverError) {
      setServerError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (botcheck) {
      return;
    }

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setServerError(null);

    const rawKey = import.meta.env.VITE_WEB3FORMS_KEY;
    const accessKey = (rawKey || "").trim().replace(/^["']|["']$/g, "");

    if (!accessKey) {
      setServerError("Contact form key is not configured. Please add VITE_WEB3FORMS_KEY to your deployment environment variables.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          subject: `New enquiry: ${formData.service} from ${formData.name.trim()}`,
          from_name: "Socialyzzze Website",
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          service: formData.service,
          message: formData.message.trim(),
        }),
      });

      const data = await response.json();

      if (data && data.success === true) {
        setIsSuccess(true);
      } else {
        setServerError(
          data?.message || "Failed to send enquiry. Please try again or reach out on WhatsApp."
        );
      }
    } catch {
      setServerError("Network error. Please check your connection and retry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappMessage = `Hi, I'm ${formData.name.trim() || "Visitor"}. I'm reaching out regarding ${formData.service}.${
    formData.message.trim() ? `\n\nMessage: ${formData.message.trim()}` : ""
  }`;
  const whatsappUrl = `https://wa.me/919810408596?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <section id="contact" className="py-20 sm:py-32 px-5 sm:px-6 md:px-16 bg-[#0E090B] border-t border-buttercream/10 text-buttercream">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-12 items-start">
        
        {/* Left Column - Text Content */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-6 sm:mb-8">
            <div className="w-12 h-[1px] bg-blood-accent"></div>
            <span className="text-xs uppercase font-mono tracking-[0.3em] text-blood-accent font-bold">
              Let's Build Together
            </span>
          </div>
          
          <h2 className="text-[clamp(2.5rem,10vw,6rem)] font-black font-display uppercase leading-[0.88] tracking-tight text-buttercream mb-6 sm:mb-8">
            READY TO <br />
            MAKE SOME <br />
            <span className="text-blood-accent">NOISE?</span>
          </h2>
          
          <p className="text-buttercream/75 text-sm sm:text-lg font-normal leading-relaxed max-w-md mb-8 sm:mb-12">
            Whether you are a scaling startup founder, an ambitious creator, or an enterprise executive — we design viral content, brand stories, and compounding marketing systems that command unmistakable attention.
          </p>
        </div>

        {/* Right Column - Form */}
        <div className="bg-[#160E12] border border-buttercream/15 p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl relative overflow-hidden">
          {/* Subtle gradient background element */}
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-blood-accent/5 to-transparent pointer-events-none" />

          {/* Accessibility status announcer */}
          <div className="sr-only" aria-live="polite">
            {isSubmitting && "Sending your enquiry, please wait."}
            {isSuccess && "Enquiry received successfully."}
            {serverError && `Submission error: ${serverError}`}
          </div>

          {isSuccess ? (
            <div className="relative z-10 flex flex-col items-center text-center py-8 sm:py-12 px-2">
              <div className="w-14 h-14 rounded-full bg-blood-accent/15 border border-blood-accent/30 flex items-center justify-center mb-6 text-blood-accent">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black font-display uppercase text-buttercream mb-3">
                Enquiry received.
              </h3>
              <p className="text-buttercream/75 text-sm sm:text-base max-w-md leading-relaxed mb-8">
                We'll reply via WhatsApp or email within 2 hours.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blood-accent text-buttercream font-black font-display tracking-widest uppercase py-4 px-8 rounded-full shadow-[0_0_20px_rgba(200,16,46,0.3)] hover:shadow-[0_0_30px_rgba(200,16,46,0.5)] hover:scale-[1.02] transition-all duration-300 inline-flex items-center justify-center gap-3 text-sm"
              >
                Continue on WhatsApp <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ) : (
            <form className="relative z-10 flex flex-col gap-5 sm:gap-6" onSubmit={handleSubmit} noValidate>
              
              {/* Honeypot */}
              <input
                type="checkbox"
                name="botcheck"
                className="hidden"
                style={{ display: "none" }}
                tabIndex={-1}
                autoComplete="off"
                checked={botcheck}
                onChange={(e) => setBotcheck(e.target.checked)}
              />

              {/* Server error alert if submission failed */}
              {serverError && (
                <div
                  role="alert"
                  className="bg-blood-accent/15 border border-blood-accent/40 rounded-xl p-3.5 flex items-start gap-3 text-buttercream text-xs font-mono"
                >
                  <AlertCircle className="w-4 h-4 text-blood-accent shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p>{serverError}</p>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="underline text-blood-accent hover:text-buttercream mt-1 font-bold inline-block"
                    >
                      Click here to retry
                    </button>
                  </div>
                </div>
              )}

              {/* Name & Phone (Side by side on desktop, stacked on mobile) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="contact-name"
                    className="text-[10px] font-mono tracking-widest text-whispy-light uppercase font-bold"
                  >
                    Your Name <span className="text-blood-accent">*</span>
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    placeholder="e.g. John Doe"
                    className={`bg-[#0E090B] border rounded-xl px-4 py-3 text-sm text-buttercream placeholder:text-buttercream/30 focus:outline-none transition-all ${
                      errors.name
                        ? "border-blood-accent focus:border-blood-accent focus:ring-1 focus:ring-blood-accent/50"
                        : "border-buttercream/10 focus:border-blood-accent/50 focus:ring-1 focus:ring-blood-accent/50"
                    }`}
                  />
                  {errors.name && (
                    <span id="name-error" className="text-[10px] font-mono tracking-wider text-blood-accent mt-0.5">
                      {errors.name}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="contact-phone"
                    className="text-[10px] font-mono tracking-widest text-whispy-light uppercase font-bold"
                  >
                    WhatsApp / Phone <span className="text-blood-accent">*</span>
                  </label>
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? "phone-error" : undefined}
                    placeholder="+91 98104 08596"
                    className={`bg-[#0E090B] border rounded-xl px-4 py-3 text-sm text-buttercream placeholder:text-buttercream/30 focus:outline-none transition-all ${
                      errors.phone
                        ? "border-blood-accent focus:border-blood-accent focus:ring-1 focus:ring-blood-accent/50"
                        : "border-buttercream/10 focus:border-blood-accent/50 focus:ring-1 focus:ring-blood-accent/50"
                    }`}
                  />
                  {errors.phone && (
                    <span id="phone-error" className="text-[10px] font-mono tracking-wider text-blood-accent mt-0.5">
                      {errors.phone}
                    </span>
                  )}
                </div>
              </div>

              {/* Email Address (Full width below Name & Phone) */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="contact-email"
                  className="text-[10px] font-mono tracking-widest text-whispy-light uppercase font-bold"
                >
                  Email Address <span className="text-blood-accent">*</span>
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  placeholder="e.g. hello@brand.com"
                  className={`bg-[#0E090B] border rounded-xl px-4 py-3 text-sm text-buttercream placeholder:text-buttercream/30 focus:outline-none transition-all ${
                    errors.email
                      ? "border-blood-accent focus:border-blood-accent focus:ring-1 focus:ring-blood-accent/50"
                      : "border-buttercream/10 focus:border-blood-accent/50 focus:ring-1 focus:ring-blood-accent/50"
                  }`}
                />
                {errors.email && (
                  <span id="email-error" className="text-[10px] font-mono tracking-wider text-blood-accent mt-0.5">
                    {errors.email}
                  </span>
                )}
              </div>

              {/* Service Needed */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="contact-service"
                  className="text-[10px] font-mono tracking-widest text-whispy-light uppercase font-bold"
                >
                  Service Needed
                </label>
                <div className="relative">
                  <select
                    id="contact-service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full appearance-none bg-[#0E090B] border border-buttercream/10 rounded-xl px-4 py-3 text-sm text-buttercream focus:outline-none focus:border-blood-accent/50 focus:ring-1 focus:ring-blood-accent/50 transition-all cursor-pointer"
                  >
                    {SERVICES.map((s) => (
                      <option key={s} value={s} className="bg-[#0E090B] text-buttercream">
                        {s}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-buttercream/50">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Brief Message */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="contact-message"
                  className="text-[10px] font-mono tracking-widest text-whispy-light uppercase font-bold"
                >
                  Brief Message <span className="text-blood-accent">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "message-error" : undefined}
                  placeholder="Tell us briefly about your goals, current stage, and timeline."
                  className={`bg-[#0E090B] border rounded-xl px-4 py-3 text-sm text-buttercream placeholder:text-buttercream/30 focus:outline-none transition-all resize-none ${
                    errors.message
                      ? "border-blood-accent focus:border-blood-accent focus:ring-1 focus:ring-blood-accent/50"
                      : "border-buttercream/10 focus:border-blood-accent/50 focus:ring-1 focus:ring-blood-accent/50"
                  }`}
                ></textarea>
                {errors.message && (
                  <span id="message-error" className="text-[10px] font-mono tracking-wider text-blood-accent mt-0.5">
                    {errors.message}
                  </span>
                )}
              </div>

              {/* Submit Button & Note */}
              <div className="mt-1 text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blood-accent text-buttercream font-black font-display text-sm sm:text-base tracking-wider sm:tracking-widest uppercase py-3.5 sm:py-4 px-6 rounded-full shadow-[0_0_20px_rgba(200,16,46,0.3)] hover:shadow-[0_0_30px_rgba(200,16,46,0.5)] hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2.5 sm:gap-3 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting ? (
                    "SENDING..."
                  ) : (
                    <span className="inline-flex items-center justify-center gap-2.5 sm:gap-3 whitespace-nowrap">
                      <span>Send Enquiry</span>
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                    </span>
                  )}
                </button>
                <p className="text-[10px] text-buttercream/40 mt-3">
                  Direct response via WhatsApp or email within 2 hours.
                </p>
              </div>

            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
