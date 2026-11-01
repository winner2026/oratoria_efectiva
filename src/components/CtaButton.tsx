"use client";

import React from "react";
import { trackBeginCheckout } from "@/lib/analytics/gtag";

interface CtaButtonProps {
  href: string;
  className?: string;
  children: React.ReactNode;
  /** Label to identify which button was clicked in GA4 reports */
  location: "hero" | "mid_page" | "pricing" | "navbar" | "checkout";
  productId?: string;
  productName?: string;
  price?: number;
  category?: string;
  target?: string;
  rel?: string;
}

export default function CtaButton({
  href,
  className,
  children,
  location,
  productId = "sin-miedo-a-hablar",
  productName = "Sin Miedo a Hablar",
  price = 29.0,
  category = "Curso Online",
  target,
  rel,
}: CtaButtonProps) {
  const handleClick = () => {
    trackBeginCheckout({
      itemId: productId,
      itemName: productName,
      price,
      category,
      currency: "USD",
      location,
    });
  };

  return (
    <a
      href={href}
      className={className}
      onClick={handleClick}
      target={target}
      rel={rel}
    >
      {children}
    </a>
  );
}
