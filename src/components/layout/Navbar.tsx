"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, Search, ShoppingBag, ChevronDown } from "lucide-react";
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
      className={`sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm dark:bg-[#0a0a0a] dark:border-[#171717] transition-all duration-200 ${
        scrolled ? "shadow-md" : ""
      }`}
    >
      <div className="container mx-auto px-4">
        <div className={`flex items-center justify-between transition-all duration-200 ${
          scrolled ? "h-14" : "h-16"
        }`}>
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold tracking-tight dark:text-white transition-all duration-200">
            NoCapLLC
          </Link>

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
                    className="text-gray-800 inline-flex items-center font-medium hover:text-black transition-colors py-2 dark:text-gray-200 dark:hover:text-white"
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
                      className="absolute top-full left-0 mt-1 w-56 bg-white rounded-md shadow-lg overflow-hidden dark:bg-[#171717] border border-gray-100 dark:border-[#262626]"
                    >
                      <div className="py-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            className="block px-4 py-2.5 text-sm text-gray-800 hover:bg-gray-50 font-medium dark:text-gray-200 dark:hover:bg-[#262626] transition-colors"
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
                    className="w-full pl-10 pr-4 py-1.5 rounded-full border border-gray-200 dark:border-[#262626] dark:bg-[#171717] text-sm focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
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
                  className="text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-[#171717]"
                  aria-label="Search"
                  onClick={() => setSearchOpen(true)}
                >
                  <Search size={20} />
                </button>
              )}
            </AnimatePresence>
            
            <ThemeToggle />
            
            <Link href="/collections" className="hidden md:block">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-black bg-black text-white hover:bg-white hover:text-black min-w-16 font-medium dark:bg-white dark:text-black dark:border-white dark:hover:bg-black dark:hover:text-white transition-colors"
              >
                SHOP
              </Button>
            </Link>
            
            <Link 
              href="/cart" 
              className="text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors relative p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-[#171717]"
            >
              <ShoppingBag size={20} />
              <span className="absolute -top-1 -right-1 bg-black text-white dark:bg-white dark:text-black text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                0
              </span>
            </Link>
            
            <button
              className="md:hidden text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-[#171717]"
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
            className="md:hidden overflow-hidden border-t border-gray-200 dark:border-[#171717]"
          >
            <div className="container mx-auto px-4 py-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-200 dark:border-[#262626] dark:bg-[#171717] text-sm focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
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