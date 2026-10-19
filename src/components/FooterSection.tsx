import React from "react";
import { Mail, Phone, MessageSquare, ArrowUpRight, ArrowUp } from "lucide-react";


export function FooterSection() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="contact" className="relative pt-20 sm:pt-24 pb-12 px-5 sm:px-6 md:px-16 bg-dark-bg text-buttercream border-t border-foreground/8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-16 sm:pb-20 border-b border-buttercream/15">
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            <h2 className="text-[clamp(1.75rem,7vw,3rem)] md:text-5xl font-extrabold font-display leading-[1.05] uppercase mb-6 sm:mb-8 text-center lg:text-left">
              LET'S BUILD <br />
              <span className="text-whispy">YOUR NEXT BIG STORY.</span>
            </h2>

            <div className="space-y-4 text-sm font-light text-buttercream/60 flex flex-col items-center lg:items-start">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-whispy" />
                <a
                  href="mailto:socialyzzze@gmail.com"
                  className="text-buttercream hover:text-whispy underline underline-offset-4 font-medium transition-colors"
                >
                  socialyzzze@gmail.com
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-whispy" />
                <span>Phone: +91 98104 08596</span>
              </div>

              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-whispy" />
                <a
                  href="https://wa.me/919810408596"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-whispy hover:underline flex items-center gap-1 font-semibold"
                >
                  WhatsApp: +91 98104 08596
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>

              <p className="pt-2 text-xs text-buttercream/40 text-center lg:text-left">
                Delhi NCR · India · Working Worldwide
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-8 text-center lg:text-left">
            <div className="flex flex-col items-center lg:items-start">
              <span className="text-xs uppercase tracking-widest text-whispy font-semibold block mb-4">
                Navigate
              </span>
              <ul className="space-y-3 text-sm text-buttercream/60 font-light flex flex-col items-center lg:items-start">
                <li>
                  <a href="#works" className="hover:text-buttercream transition-colors">
                    Work
                  </a>
                </li>
                <li>
                  <a href="#services" className="hover:text-buttercream transition-colors">
                    Services
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-buttercream transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-buttercream transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div className="flex flex-col items-center lg:items-start">
              <span className="text-xs uppercase tracking-widest text-whispy font-semibold block mb-4">
                Follow
              </span>
              <ul className="space-y-3 text-sm text-buttercream/60 font-light flex flex-col items-center lg:items-start">
                <li>
                  <a
                    href="https://www.instagram.com/socialyzzze?obrf=MTIyYXhvNmptZmpzcQ=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-buttercream inline-flex items-center gap-1 transition-colors"
                  >
                    Instagram <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/company/socialyzzze/about/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-buttercream inline-flex items-center gap-1 transition-colors"
                  >
                    LinkedIn <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-buttercream inline-flex items-center gap-1 transition-colors"
                  >
                    YouTube <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* SOCIALYZZZE logo */}
        <div className="relative pt-16 sm:pt-20 md:pt-28 pb-6 md:pb-8 select-none">
          <div className="flex items-center justify-center">
            <h1 className="text-[clamp(1.3rem,6.6vw,7rem)] font-black font-display text-buttercream tracking-tight sm:tracking-tighter uppercase text-center leading-[1] w-full px-2 sm:px-4 whitespace-nowrap">
              SOCIALYZZZE
            </h1>
          </div>
        </div>

        {/* Closing brand line */}
        <div className="relative z-10 flex flex-col items-center text-center pb-14 md:pb-20">
          <div className="w-12 h-[3px] bg-[#8E1D2E] mb-5" />
          <p className="max-w-3xl text-xl md:text-3xl font-bold font-display uppercase tracking-tight leading-snug text-buttercream">
            Your brand has a story.{" "}
            <span className="text-whispy">
              We know how to make people stop scrolling.
            </span>
          </p>
        </div>

        <div className="relative z-10 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-buttercream/40 gap-4">
          <p>© 2026 Socialyzzze. All rights reserved.</p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 hover:text-buttercream transition-colors cursor-pointer"
          >
            Back to top <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}

export default FooterSection;