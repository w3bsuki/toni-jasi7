"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

interface HeroProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  imageSrc: string;
}

export function Hero({
  title,
  subtitle,
  ctaText,
  ctaLink,
  imageSrc,
}: HeroProps) {
  return (
    <div className="relative h-[70vh] min-h-[500px] bg-gray-900">
      {/* Hero Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={imageSrc}
          alt="Hero image"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
        {/* Darker overlay for more dramatic effect */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
        <div className="max-w-2xl text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-md">
            {title}
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-100 drop-shadow">{subtitle}</p>
          <Link
            href={ctaLink}
            className="inline-block bg-white text-black px-8 py-3 text-lg font-medium hover:bg-gray-200 transition-colors shadow-md"
          >
            {ctaText}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Hero; 