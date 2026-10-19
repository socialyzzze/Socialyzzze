import React from "react";
import ImmersiveFullscreenNav from "@/components/ui/immersive-full-screen-nav";

export function Navigation() {
  return (
    <ImmersiveFullscreenNav
      headerClosedColor="#F4E8D7"
      headerOpenColor="#F4E8D7"
      overlayBg="#0E090B"
      navConfig={{
        brand: "SOCIALYZZZE",
        brandLogo: "/logo.png",
        brandHref: "#",
        overlayBg: "#0E090B",
        headerClosedColor: "#F4E8D7",
        headerOpenColor: "#F4E8D7",
        clipOrigin: "top",
      }}
      navContent={{
        agencyName: "SOCIALYZZZE MEDIA",
        tagline: "High-impact visual narratives & video production.",
        location: "Delhi NCR · India · Working Worldwide",
        links: [
          { label: "Works", href: "#works" },
          { label: "Services", href: "#services" },
          { label: "About", href: "#about" },
          { label: "Process", href: "#process" },
          { label: "Contact", href: "#contact" },
        ],
        images: [
          "/works/nav-production-1.jpg",
          "/works/nav-production-2.jpg",
        ],
        socials: [
          {
            type: "instagram",
            href: "https://www.instagram.com/socialyzzze?obrf=MTIyYXhvNmptZmpzcQ==",
          },
          {
            type: "linkedin",
            href: "https://www.linkedin.com/company/socialyzzze/about/",
          },
        ],
      }}
    />
  );
}

export default Navigation;
