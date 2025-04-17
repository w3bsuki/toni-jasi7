"use client";

import {
  ArrowRight,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const navigation = [
  {
    title: "Shop",
    links: [
      { name: "All Products", href: "/collections" },
      { name: "New Arrivals", href: "/new/arrivals" },
      { name: "Best Sellers", href: "/new/best-sellers" },
      { name: "On Sale", href: "/sale" },
    ],
  },
  {
    title: "Collections",
    links: [
      { name: "Snapback", href: "/styles/snapback" },
      { name: "Fitted", href: "/styles/fitted" },
      { name: "Dad Hats", href: "/styles/dad-hats" },
      { name: "Beanies", href: "/styles/beanies" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Us", href: "/about" },
      { name: "Contact", href: "/contact" },
      { name: "Stores", href: "/stores" },
    ],
  },
  {
    title: "Help",
    links: [
      { name: "Shipping & Returns", href: "/shipping" },
      { name: "FAQ", href: "/faq" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
    ],
  },
];

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
];

export function Footer() {
  return (
    <section className="bg-black py-16 text-white md:py-20">
      <div className="container mx-auto px-4">
        <footer className="flex flex-col items-center">
          <div className="mb-12 rounded-sm bg-white/5 p-8 backdrop-blur-sm md:p-12 w-full max-w-6xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <h2 className="max-w-[800px] text-3xl leading-tight font-bold tracking-wider uppercase text-balance md:text-4xl">
                Join the NoCAP Club
                <span className="text-white relative inline-block ml-2">
                  Today
                  <span className="bg-white/30 absolute bottom-1 left-0 h-1 w-full"></span>
                </span>
              </h2>
              <p className="mt-4 max-w-[600px] text-lg text-white/80">
                Get exclusive access to limited edition drops, early releases, and member-only perks.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Button asChild variant="outline" size="lg" className="group border-white bg-white text-black hover:bg-black hover:text-white">
                  <Link href="/membership" className="flex items-center gap-2">
                    Join the Club
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="border-white/20 mb-12 border-b pb-12 w-full max-w-6xl mx-auto">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
              <div>
                <h3 className="mb-2 text-2xl font-medium">Stay Updated</h3>
                <p className="max-w-md text-white/70">
                  Subscribe to our newsletter for new drops, exclusive offers, and style inspiration.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-grow">
                  <Input
                    type="email"
                    placeholder="Your email address"
                    className="h-12 border-white/20 bg-white/10 text-white placeholder:text-white/50"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="h-12 px-6 bg-white text-black border border-white hover:bg-black hover:text-white hover:border-white"
                >
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          {/* Navigation Section */}
          <nav className="border-white/20 grid grid-cols-2 gap-x-6 gap-y-10 border-b py-10 sm:grid-cols-4 lg:py-12 w-full max-w-6xl mx-auto">
            {navigation.map((section) => (
              <div key={section.title}>
                <h3 className="mb-5 text-lg font-semibold uppercase tracking-wider">{section.title}</h3>
                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="inline-block text-white/80 transition-colors duration-200 hover:text-white"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          {/* Bottom Section */}
          <div className="mx-auto mt-8 py-6 w-full max-w-6xl">
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
              <p className="font-medium text-white/80">
                © {new Date().getFullYear()} NoCapLLC - All Rights Reserved
              </p>
              <div className="flex items-center gap-6">
                {socialLinks.map((link) => (
                  <a
                    aria-label={link.label}
                    key={link.href}
                    href={link.href}
                    className="text-white/70 transition-colors hover:text-white"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <link.icon
                      size={20}
                      className="transition-transform hover:scale-110"
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
}

export default Footer; 