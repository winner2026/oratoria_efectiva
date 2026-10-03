"use client";

import React from "react";

// Extend Window to include gtag
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

interface CtaButtonProps {
  href: string;
  className?: string;
  children: React.ReactNode;
  /** Label to identify which button was clicked in GA4 reports */
  location: "hero" | "mid_page" | "pricing";
}

export default function CtaButton({
  href,
  className,
  children,
  location,
}: CtaButtonProps) {
  const handleClick = () => {
    // GA4 event
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "comprar_ahora_click", {
        event_category: "conversion",
        event_label: location,
        link_url: href,
      });
    }
  };

  return (
    <a
      href={href}
      className={className}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
