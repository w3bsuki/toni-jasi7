"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, Search, ShoppingBag, ChevronDown, Instagram, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MobileMenu from "./MobileMenu";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";

interface NavItem {
  label: string;
  href: string;
  children?: Array<{
    label: string;
    href: string;
  }>;
}

const navItems: NavItem[] = [
  {
    label: "New",
    href: "/new",
    children: [
      { label: "New Arrivals", href: "/new/arrivals" },
      { label: "Best Sellers", href: "/new/best-sellers" },
    ],
  },
  {
    label: "Collections",
    href: "/collections",
    children: [
      { label: "Summer Collection", href: "/collections/summer" },
      { label: "Winter Collection", href: "/collections/winter" },
      { label: "Limited Edition", href: "/collections/limited-edition" },
    ],
  },
  {
    label: "Styles",
    href: "/styles",
    children: [
      { label: "Snapback", href: "/styles/snapback" },
      { label: "Fitted", href: "/styles/fitted" },
      { label: "Dad Hats", href: "/styles/dad-hats" },
      { label: "Beanies", href: "/styles/beanies" },
    ],
  },
  { label: "Sale", href: "/sale" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  // Enhanced hover intent logic with delay
  const handleMouseEnter = (label: string) => {
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  return (
    <header 
      className={`sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm dark:bg-black dark:border-zinc-800 transition-all duration-200 ${
        scrolled ? "shadow-md" : ""
      }`}
    >
      <div className="w-full px-6 md:px-8">
        <div className={`flex items-center justify-between transition-all duration-200 ${
          scrolled ? "h-14" : "h-16"
        }`}>
          {/* Logo and Social Media */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold tracking-tight dark:text-white transition-all duration-200 mr-4">
              NoCapLLC
            </Link>
            
            {/* Social Media Links */}
            <div className="hidden md:flex items-center space-x-4">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-700 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors p-1.5 rounded-sm hover:bg-gray-100 dark:hover:bg-zinc-900"
                aria-label="Instagram"
              >
                <Instagram size={16} strokeWidth={2} />
              </a>
              <a 
                href="https://tiktok.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-700 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors p-1.5 rounded-sm hover:bg-gray-100 dark:hover:bg-zinc-900"
                aria-label="TikTok"
              >
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="fill-current"
                >
                  <path d="M19.321 5.562a5.122 5.122 0 0 1-3.664-1.514 5.12 5.12 0 0 1-1.514-3.664h-3.844v12.926c0 1.614-1.312 2.926-2.926 2.926a2.927 2.927 0 0 1-2.927-2.926 2.927 2.927 0 0 1 2.927-2.927c.323 0 .634.052.926.149V6.488a6.963 6.963 0 0 0-.926-.062C3.736 6.426 0 10.163 0 14.8c0 4.636 3.736 8.373 8.373 8.373 4.638 0 8.374-3.737 8.374-8.373V9.146a9.064 9.064 0 0 0 5.316 1.703v-3.844c-.94 0-1.84-.149-2.742-.443z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative flex items-center"
                onMouseEnter={() => handleMouseEnter(item.label)}
                onMouseLeave={handleMouseLeave}
              >
                <div className="group inline-flex items-center">
                  <Link
                    href={item.href}
                    className="text-gray-800 inline-flex items-center font-medium hover:text-black transition-colors py-2 dark:text-gray-200 dark:hover:text-white uppercase tracking-wide text-sm"
                  >
                    {item.label}
                    {item.children && (
                      <ChevronDown 
                        className={`ml-1 h-4 w-4 transition-transform duration-200 ${activeDropdown === item.label ? "rotate-180" : ""}`} 
                      />
                    )}
                  </Link>
                  {item.children && (
                    <div 
                      className={`absolute bottom-0 left-0 h-0.5 bg-black dark:bg-white transition-all duration-200 ${
                        activeDropdown === item.label ? "w-full" : "w-0"
                      }`}
                    />
                  )}
                </div>
                
                <AnimatePresence>
                  {item.children && activeDropdown === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-1 w-56 bg-white shadow-lg overflow-hidden dark:bg-black border border-gray-100 dark:border-zinc-800"
                    >
                      <div className="py-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            className="block px-4 py-2.5 text-sm text-gray-800 hover:bg-gray-50 font-medium dark:text-gray-200 dark:hover:bg-zinc-900 transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Search, Theme Toggle, Shop Button and Cart */}
          <div className="flex items-center space-x-5">
            <AnimatePresence>
              {searchOpen ? (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "240px", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative hidden md:block"
                >
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-1.5 border border-gray-200 dark:border-zinc-800 dark:bg-black text-sm focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white rounded"
                    autoFocus
                    onBlur={() => setSearchOpen(false)}
                  />
                  <Search 
                    size={16} 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                </motion.div>
              ) : (
                <button
                  className="text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded"
                  aria-label="Search"
                  onClick={() => setSearchOpen(true)}
                >
                  <Search size={20} />
                </button>
              )}
            </AnimatePresence>
            
            <ThemeToggle />
            
            {/* SHOP Button with hero animation - Desktop */}
            <div className="hidden md:block">
              <Link href="/collections">
                <div 
                  className="relative h-9 w-24 overflow-hidden group border border-black dark:border-white rounded"
                >
                  {/* Base state */}
                  <div className="absolute inset-0 bg-black dark:bg-white flex items-center justify-center transition-transform duration-300 group-hover:translate-y-full">
                    <span className="text-white dark:text-black uppercase font-bold tracking-wider text-xs">
                      SHOP
                    </span>
                  </div>
                  
                  {/* Hover state */}
                  <div className="absolute inset-0 bg-white dark:bg-black flex items-center justify-center transform -translate-y-full transition-transform duration-300 group-hover:translate-y-0">
                    <span className="text-black dark:text-white uppercase font-bold tracking-wider text-xs flex items-center">
                      SHOP <ArrowRight className="ml-1 h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
            </div>
            
            {/* SHOP Button for mobile */}
            <Link href="/collections" className="md:hidden">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-black bg-black text-white hover:bg-white hover:text-black h-8 px-3 font-bold tracking-wider text-xs uppercase dark:bg-white dark:text-black dark:border-white dark:hover:bg-black dark:hover:text-white transition-colors rounded"
              >
                SHOP
              </Button>
            </Link>
            
            {/* Cart button */}
            <Link 
              href="/cart" 
              className="text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors relative p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded"
            >
              <ShoppingBag size={20} />
              <span className="absolute -top-1 -right-1 bg-black text-white dark:bg-white dark:text-black text-xs font-bold h-4 w-4 flex items-center justify-center rounded-full">
                0
              </span>
            </Link>
            
            {/* Mobile menu button */}
            <button
              className="md:hidden text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search (shown when search button clicked on mobile) */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-gray-200 dark:border-zinc-800"
          >
            <div className="w-full px-6">
              <div className="relative py-3">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-zinc-800 dark:bg-black text-sm focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white rounded"
                  autoFocus
                  onBlur={() => setSearchOpen(false)}
                />
                <Search 
                  size={16} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu with AnimatePresence for exit animations */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <MobileMenu
            isOpen={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
            navItems={navItems}
          />
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar; 