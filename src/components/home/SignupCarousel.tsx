"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface CarouselItem {
  id: number;
  icon: React.ReactNode;
  text: string;
  cta?: {
    text: string;
    action: () => void;
  };
}

export function SignupCarousel() {
  const handleSignUp = () => {
    window.alert("Sign up modal would open here!");
  };
  
  const carouselItems: CarouselItem[] = [
    {
      id: 1,
      icon: (
        <svg 
          viewBox="0 0 24 24" 
          className="w-4 h-4 mr-2 fill-current" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2C6.486 2 2 5.589 2 10c0 2.908 1.898 5.516 5 6.934V22h10v-5.066c3.102-1.418 5-4.025 5-6.934 0-4.411-4.486-8-10-8zm-2 16.001h4v-4h-4v4zm6 0h2v-4h-2v4zm-2-11.736c-3.859 1.04-3.859 5.423 0 6.464 3.859-1.041 3.859-5.424 0-6.464z"/>
        </svg>
      ),
      text: "JOIN THE NOCAP CLUB",
      cta: {
        text: "JOIN",
        action: handleSignUp
      }
    },
    {
      id: 2,
      icon: (
        <svg 
          viewBox="0 0 24 24" 
          className="w-4 h-4 mr-2 fill-current" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="m21.426 11.095-17-8A.999.999 0 0 0 3.03 4.242L4.969 12 3.03 19.758a.998.998 0 0 0 1.396 1.147l17-8a1 1 0 0 0 0-1.81zM5.481 18.197l.839-3.357L12 12 6.32 9.16l-.839-3.357L18.651 12l-13.17 6.197z"/>
        </svg>
      ),
      text: "FREE SHIPPING ON ORDERS $50+",
    },
    {
      id: 3,
      icon: (
        <svg 
          viewBox="0 0 24 24" 
          className="w-4 h-4 mr-2 fill-current" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 22c5.514 0 10-4.486 10-10S17.514 2 12 2 2 6.486 2 12s4.486 10 10 10zm0-18c4.411 0 8 3.589 8 8s-3.589 8-8 8-8-3.589-8-8 3.589-8 8-8zm3.707 11.707a.999.999 0 1 1-1.414 1.414L11 13.828V8a1 1 0 1 1 2 0v4.586l2.707 2.707z"/>
        </svg>
      ),
      text: "GET 10% OFF YOUR FIRST ORDER",
      cta: {
        text: "CLAIM",
        action: handleSignUp
      }
    },
    {
      id: 4,
      icon: (
        <svg 
          viewBox="0 0 24 24" 
          className="w-4 h-4 mr-2 fill-current" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M20 7h-1.209A4.92 4.92 0 0 0 19 5.5C19 3.57 17.43 2 15.5 2c-1.622 0-2.705 1.482-3.404 3.085C11.407 3.57 10.269 2 8.5 2 6.57 2 5 3.57 5 5.5c0 .596.079 1.089.209 1.5H4c-1.103 0-2 .897-2 2v2c0 1.103.897 2 2 2v7c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-7c1.103 0 2-.897 2-2V9c0-1.103-.897-2-2-2zm-4.5-3c.827 0 1.5.673 1.5 1.5C17 7 16.374 7 16 7h-2.478c.511-1.576 1.253-3 1.978-3zM7 5.5C7 4.673 7.673 4 8.5 4c.888 0 1.714 1.525 2.198 3H8c-.374 0-1 0-1-1.5zM4 9h7v2H4V9zm2 11v-7h5v7H6zm12 0h-5v-7h5v7zm-5-9V9h7v2h-7z"/>
        </svg>
      ),
      text: "LIMITED COLLECTION AVAILABLE NOW",
    }
  ];
  
  // Double the items to create a seamless loop
  const items = [...carouselItems, ...carouselItems, ...carouselItems];

  return (
    <div className="bg-black text-white py-3 overflow-hidden relative dark:bg-[#171717]">
      <div 
        className="flex whitespace-nowrap animate-marquee" 
        style={{ 
          animationDuration: '30s', 
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite'
        }}
      >
        {items.map((item, index) => (
          <div key={`${item.id}-${index}`} className="flex items-center mx-5">
            <div className="flex items-center">
              <motion.div 
                initial={{ opacity: 0.8 }}
                whileHover={{ opacity: 1, scale: 1.05 }}
                className="flex items-center"
              >
                {item.icon}
                <span className="font-medium tracking-wider uppercase text-xs mr-6">
                  {item.text}
                </span>
              </motion.div>
              {item.cta && (
                <>
                  <span className="mx-2 text-xs">•</span>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      onClick={item.cta.action}
                      variant="outline" 
                      size="sm" 
                      className="border-white bg-white text-black hover:bg-black hover:text-white min-w-14 text-xs h-7 px-3 font-medium rounded-full dark:bg-white dark:text-black dark:hover:bg-[#171717] dark:hover:text-white dark:hover:border-white"
                    >
                      {item.cta.text}
                    </Button>
                  </motion.div>
                </>
              )}
            </div>
            <span className="mx-4 text-xs opacity-40">•</span>
          </div>
        ))}
      </div>
      
      {/* Gradient fade effect on edges */}
      <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-black via-black to-transparent dark:from-[#171717] dark:via-[#171717]"></div>
      <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-black via-black to-transparent dark:from-[#171717] dark:via-[#171717]"></div>
    </div>
  );
}

export default SignupCarousel; 