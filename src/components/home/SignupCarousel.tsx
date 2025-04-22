"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

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
  const [isPaused, setIsPaused] = React.useState(false);
  
  const handleSignUp = () => {
    window.alert("Sign up modal would open here!");
  };
  
  const carouselItems: CarouselItem[] = [
    {
      id: 1,
      icon: (
        <svg 
          viewBox="0 0 24 24" 
          className="w-5 h-5 fill-current" 
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
          className="w-5 h-5 fill-current" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="m21.426 11.095-17-8A.999.999 0 0 0 3.03 4.242L4.969 12 3.03 19.758a.998.998 0 0 0 1.396 1.147l17-8a1 1 0 0 0 0-1.81zM5.481 18.197l.839-3.357L12 12 6.32 9.16l-.839-3.357L18.651 12l-13.17 6.197z"/>
        </svg>
      ),
      text: "FREE SHIPPING OVER $50",
      cta: {
        text: "SHOP",
        action: handleSignUp
      }
    },
    {
      id: 3,
      icon: (
        <svg 
          viewBox="0 0 24 24" 
          className="w-5 h-5 fill-current" 
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
          className="w-5 h-5 fill-current" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M20 7h-1.209A4.92 4.92 0 0 0 19 5.5C19 3.57 17.43 2 15.5 2c-1.622 0-2.705 1.482-3.404 3.085C11.407 3.57 10.269 2 8.5 2 6.57 2 5 3.57 5 5.5c0 .596.079 1.089.209 1.5H4c-1.103 0-2 .897-2 2v2c0 1.103.897 2 2 2v7c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-7c1.103 0 2-.897 2-2V9c0-1.103-.897-2-2-2zm-4.5-3c.827 0 1.5.673 1.5 1.5C17 7 16.374 7 16 7h-2.478c.511-1.576 1.253-3 1.978-3zM7 5.5C7 4.673 7.673 4 8.5 4c.888 0 1.714 1.525 2.198 3H8c-.374 0-1 0-1-1.5zM4 9h7v2H4V9zm2 11v-7h5v7H6zm12 0h-5v-7h5v7zm-5-9V9h7v2h-7z"/>
        </svg>
      ),
      text: "LIMITED COLLECTION",
      cta: {
        text: "VIEW",
        action: handleSignUp
      }
    }
  ];
  
  // Duplicate items for infinite scrolling
  const repeatedItems = [];
  for (let i = 0; i < 5; i++) {
    repeatedItems.push(...carouselItems);
  }

  return (
    <div className="bg-black text-white h-16 w-full relative overflow-hidden border-y-2 border-white/25"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="h-full flex items-center justify-center">
        <div className={`carousel-track ${isPaused ? 'paused' : ''}`}>
          {repeatedItems.map((item, index) => (
            <div key={`${item.id}-${index}`} className="carousel-item">
              <div className="item-container">
                <div className="flex items-center">
                  <span className="flex items-center justify-center w-9 h-9 bg-black border-2 border-white/30 rounded-full mr-3">
                    {item.icon}
                  </span>
                  <span className="text-white text-xs font-bold tracking-wider uppercase mr-4">
                    {item.text}
                  </span>
                </div>
                
                {item.cta && (
                  <div className="button-wrap">
                    <button 
                      onClick={item.cta.action}
                      className="btn-cta flex items-center justify-center relative overflow-hidden group h-9 px-6 py-0 bg-white text-black border-2 border-white rounded-md"
                    >
                      <span className="button-text">
                        {item.cta.text}
                      </span>
                      <div className="hover-overlay"></div>
                    </button>
                  </div>
                )}
              </div>
              
              {/* Add visual separator between items */}
              <Separator orientation="vertical" className="h-12 ml-10 mr-10 bg-white/25" />
            </div>
          ))}
        </div>
      </div>
      
      {/* Edge gradients - using pure black */}
      <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-black to-transparent z-10"></div>
      <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-black to-transparent z-10"></div>
      
      <style jsx>{`
        .carousel-track {
          display: flex;
          white-space: nowrap;
          animation: scroll 30s linear infinite;
        }
        
        .carousel-track.paused {
          animation-play-state: paused;
        }
        
        .carousel-item {
          display: flex;
          align-items: center;
          padding: 0 12px;
          flex-shrink: 0;
        }
        
        .item-container {
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 0 28px;
          height: 56px;
          background-color: black;
          border-radius: 8px;
          box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.25);
          transition: all 0.3s ease;
        }
        
        .item-container:hover {
          background-color: black;
          box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.5);
        }
        
        .button-wrap {
          position: relative;
          height: 36px;
          transition: transform 0.2s ease;
        }
        
        .button-wrap:hover {
          transform: scale(1.05);
        }
        
        .button-wrap:active {
          transform: scale(0.95);
        }
        
        .btn-cta {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          height: 36px;
          padding: 0 18px;
          box-shadow: 0 3px 12px rgba(0, 0, 0, 0.25);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          z-index: 1;
        }
        
        .btn-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.35);
        }
        
        .button-text {
          position: relative;
          z-index: 2;
          transition: color 0.3s ease;
          font-weight: 900;
        }
        
        .hover-overlay {
          position: absolute;
          inset: 0;
          background-color: black;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
          z-index: 1;
        }
        
        .btn-cta:hover .button-text {
          color: white;
        }
        
        .btn-cta:hover .hover-overlay {
          transform: scaleX(1);
        }
        
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 5)); }
        }
        
        /* Add subtle pulse animation to the icons */
        @keyframes subtle-pulse {
          0%, 100% { opacity: 0.9; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        
        .carousel-item:hover span svg {
          animation: subtle-pulse 2s ease infinite;
        }
      `}</style>
    </div>
  );
}

export default SignupCarousel; 