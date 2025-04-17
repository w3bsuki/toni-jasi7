"use client";

import React, { useState } from "react";
import Link from "next/link";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white">
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold">Menu</h2>
        <button
          onClick={onClose}
          className="text-gray-700 hover:text-black"
          aria-label="Close menu"
        >
          <X size={24} />
        </button>
      </div>

      <nav className="p-4">
        <ul className="space-y-4">
          {navItems.map((item) => (
            <li key={item.label} className="border-b border-gray-100 pb-2">
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleItem(item.label)}
                    className="flex items-center justify-between w-full py-2"
                  >
                    <span className="text-lg">{item.label}</span>
                    {expandedItem === item.label ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </button>
                  {expandedItem === item.label && (
                    <ul className="ml-4 mt-2 space-y-2">
                      {item.children.map((child) => (
                        <li key={child.label}>
                          <Link
                            href={child.href}
                            className="block py-2 text-gray-700 hover:text-black"
                            onClick={onClose}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className="block py-2 text-lg text-gray-700 hover:text-black"
                  onClick={onClose}
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
          
          <li className="pt-4">
            <Link 
              href="/collections" 
              onClick={onClose}
              className="block w-full"
            >
              <Button 
                variant="outline" 
                size="sm"
                className="border-black bg-black text-white hover:bg-white hover:text-black w-full font-medium py-2 text-base rounded-none"
              >
                SHOP NOW
              </Button>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default MobileMenu; 