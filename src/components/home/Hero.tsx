"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface HeroProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  imageSrc: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
}

export function Hero({
  title,
  subtitle,
  ctaText,
  ctaLink,
  imageSrc,
  secondaryCtaText = "Explore Collection",
  secondaryCtaLink = "/collections",
}: HeroProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Split the title into an array of words
  const titleWords = title.split(" ");

  return (
    <section className="relative overflow-hidden bg-white dark:bg-[#0a0a0a]">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[90vh]">
        {/* Left Content Area */}
        <div className="relative z-10 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto w-full max-w-xl lg:mx-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <p className="text-sm font-medium uppercase tracking-widest text-black dark:text-white mb-6 before:content-[''] before:inline-block before:h-px before:w-8 before:bg-black dark:before:bg-white before:mr-4 before:align-middle">
                Premium Quality Hats
              </p>
            </motion.div>

            <motion.h1 
              className="text-5xl font-bold tracking-tight text-black dark:text-white sm:text-6xl lg:text-7xl"
            >
              {titleWords.map((word, index) => (
                <motion.span
                  key={index}
                  className="inline-block mr-4"
                  initial={{ opacity: 0, y: 40 }}
                  animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                  transition={{ 
                    duration: 0.7, 
                    delay: 0.3 + (index * 0.1),
                    ease: [0.22, 1, 0.36, 1]
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </motion.h1>

            <motion.p
              className="mt-6 text-lg leading-8 text-gray-700 dark:text-gray-300 max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.6 }}
            >
              {subtitle}
            </motion.p>

            <motion.div 
              className="mt-10 flex flex-col sm:flex-row gap-4 sm:gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.8 }}
            >
              <Link
                href={ctaLink}
                className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-black px-8 font-medium text-white transition-all hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-200"
              >
                <span>{ctaText}</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              
              <Link
                href={secondaryCtaLink}
                className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md border border-black px-8 font-medium text-black transition-all hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black"
              >
                <span>{secondaryCtaText}</span>
              </Link>
            </motion.div>

            <motion.div 
              className="mt-12 flex items-center gap-6"
              initial={{ opacity: 0 }}
              animate={isLoaded ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 1 }}
            >
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="inline-block h-8 w-8 rounded-full border-2 border-white bg-gray-800 dark:border-black dark:bg-gray-300">
                    {/* Placeholder for user avatars/testimonials */}
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Trusted by <span className="font-medium text-black dark:text-white">2,000+</span> customers
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Image Area */}
        <div className="relative lg:h-auto">
          <motion.div
            className="absolute inset-0 z-0 bg-gray-100 dark:bg-[#171717]"
            initial={{ scaleX: 1 }}
            animate={isLoaded ? { scaleX: 0 } : {}}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{ originX: 0 }}
          />
          
          <motion.div
            className="h-80 sm:h-96 lg:absolute lg:inset-0 lg:h-full"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.2 }}
          >
            <div className="relative h-full overflow-hidden">
              <Image
                src={imageSrc}
                alt="Hero image"
                fill
                className="h-full w-full object-cover object-center"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 lg:bg-gradient-to-r" />
            </div>
          </motion.div>
          
          <motion.div
            className="absolute bottom-0 right-0 z-10 p-6 md:p-10 lg:p-12"
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 1 }}
          >
            <div className="rounded-lg bg-white/90 p-4 shadow-lg backdrop-blur-sm dark:bg-black/90">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">New arrival</p>
              <p className="mt-1 font-medium text-black dark:text-white">Premium collection for 2023</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Hero; 