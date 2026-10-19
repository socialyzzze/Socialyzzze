import React, { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";

const STORAGE_KEY = "socialyzzze-privacy-notice";
const SHOW_DELAY_MS = 1500;
const HIDE_DURATION_MS = 500;

type BannerStatus = "hidden" | "visible" | "gone";

function hasDismissed() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "dismissed";
  } catch {
    return false;
  }
}

function saveDismissed() {
  try {
    window.localStorage.setItem(STORAGE_KEY, "dismissed");
  } catch {
    return;
  }
}

export function PrivacyBanner() {
  const [status, setStatus] = useState<BannerStatus>(hasDismissed() ? "gone" : "hidden");

  useEffect(() => {
    if (status !== "hidden") return;
    const timer = window.setTimeout(() => setStatus("visible"), SHOW_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [status]);

  const dismiss = () => {
    saveDismissed();
    setStatus("hidden");
    window.setTimeout(() => setStatus("gone"), HIDE_DURATION_MS);
  };

  if (status === "gone") return null;

  const isVisible = status === "visible";

  return (
    <div
      role="region"
      aria-label="Privacy notice"
      className={`fixed bottom-4 left-4 right-4 z-[80] transition-all duration-500 ease-out motion-reduce:transition-none sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-md ${
        isVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <div className="rounded-2xl border border-buttercream/15 bg-[#0E090B]/90 p-5 shadow-2xl backdrop-blur-md sm:p-6">
        <div className="mb-3 flex items-center gap-2.5">
          <ShieldCheck className="h-4 w-4 text-blood-accent" />
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-whispy-light">
            Your privacy
          </span>
        </div>

        <p className="text-sm leading-relaxed text-buttercream/75">
          We only collect the information you choose to send us, such as through our contact form. Read our{" "}
          <a
            href="#privacy-policy"
            className="font-semibold text-buttercream underline decoration-buttercream/40 underline-offset-4 transition-colors hover:decoration-buttercream"
          >
            Privacy Policy
          </a>{" "}
          to see how we use and protect it.
        </p>

        <div className="mt-5 flex items-center gap-3">
          <button
            type="button"
            onClick={dismiss}
            className="rounded-full bg-blood-accent px-5 py-2 text-xs font-bold uppercase tracking-[0.15em] text-buttercream transition-colors hover:bg-buttercream hover:text-[#0E090B]"
          >
            Got it
          </button>
          <a
            href="#privacy-policy"
            className="text-xs font-bold uppercase tracking-[0.15em] text-buttercream/60 transition-colors hover:text-buttercream"
          >
            Read policy
          </a>
        </div>
      </div>
    </div>
  );
}

export default PrivacyBanner;
