"use client";

import React, { useState } from "react";
import Link from "next/link";
import { X, ChevronDown, Search, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
}

export function MobileMenu({ isOpen, onClose, navItems }: MobileMenuProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const toggleItem = (label: string) => {
    setExpandedItem(expandedItem === label ? null : label);
  };

  // Animation variants
  const menuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      }
    },
    open: {
      opacity: 1,
      x: "0%",
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      }
    }
  };

  const backdrop = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const slideDown = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <motion.div
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={backdrop}
        className="absolute inset-0 bg-black/20 backdrop-blur-sm dark:bg-black/50"
        onClick={onClose}
      />
      
      <motion.div
        initial="closed"
        animate="open"
        exit="closed"
        variants={menuVariants}
        className="relative w-full max-w-sm ml-auto h-full bg-white overflow-auto flex flex-col dark:bg-black dark:text-white shadow-xl"
      >
        <div className="sticky top-0 z-20 flex justify-between items-center p-4 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-black">
          <h2 className="text-xl font-bold">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex items-center gap-4 px-4 py-3 border-b border-gray-200 dark:border-zinc-800">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full pl-10 pr-3 py-2 text-sm bg-gray-100 dark:bg-zinc-900 border-none focus:ring-1 focus:ring-black dark:focus:ring-white" 
            />
          </div>
          <ThemeToggle />
        </div>

        <nav className="flex-1 overflow-auto">
          <ul className="divide-y divide-gray-100 dark:divide-zinc-800">
            {navItems.map((item) => (
              <li key={item.label} className="px-4">
                {item.children ? (
                  <div>
                    <button
                      onClick={() => toggleItem(item.label)}
                      className="flex items-center justify-between w-full py-4 font-medium"
                    >
                      <span className="text-base uppercase tracking-wide text-sm">{item.label}</span>
                      <ChevronDown 
                        size={18} 
                        className={`transition-transform duration-300 ${expandedItem === item.label ? "rotate-180" : ""}`} 
                      />
                    </button>
                    <AnimatePresence>
                      {expandedItem === item.label && (
                        <motion.ul
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          variants={slideDown}
                          className="overflow-hidden"
                        >
                          <div className="pl-4 pb-4 border-l border-gray-100 dark:border-zinc-800 ml-2.5 space-y-3">
                            {item.children.map((child) => (
                              <li key={child.label}>
                                <Link
                                  href={child.href}
                                  className="block py-1.5 text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors"
                                  onClick={onClose}
                                >
                                  {child.label}
                                </Link>
                              </li>
                            ))}
                          </div>
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="block py-4 text-base font-medium text-gray-800 hover:text-black dark:text-gray-200 dark:hover:text-white transition-colors uppercase tracking-wide text-sm"
                    onClick={onClose}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="sticky bottom-0 p-4 pt-2 border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-black mt-auto">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Link 
              href="/cart" 
              onClick={onClose}
              className="flex items-center justify-center py-2.5 px-4 bg-gray-100 dark:bg-zinc-900 font-medium text-sm transition-colors hover:bg-gray-200 dark:hover:bg-zinc-800"
            >
              <ShoppingBag size={16} className="mr-2" />
              Cart (0)
            </Link>
            <ThemeToggle />
          </div>
          <Link 
            href="/collections" 
            onClick={onClose}
            className="block w-full"
          >
            <Button 
              variant="outline" 
              size="default"
              className="border-black bg-black text-white hover:bg-white hover:text-black w-full font-bold text-xs uppercase tracking-wider dark:bg-white dark:text-black dark:border-white dark:hover:bg-black dark:hover:text-white transition-colors rounded-none"
            >
              SHOP NOW
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default MobileMenu; 