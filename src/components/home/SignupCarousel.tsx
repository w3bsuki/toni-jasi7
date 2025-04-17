"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

export function SignupCarousel() {
  const handleSignUp = () => {
    window.alert("Sign up modal would open here!");
  };

  return (
    <div className="bg-black text-white py-2 overflow-hidden">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...Array(12)].map((_, index) => (
          <div key={index} className="flex items-center mx-5">
            {/* Simple cap/hat icon */}
            <svg 
              viewBox="0 0 24 24" 
              className="w-4 h-4 mr-2 fill-current" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2C6.486 2 2 5.589 2 10c0 2.908 1.898 5.516 5 6.934V22h10v-5.066c3.102-1.418 5-4.025 5-6.934 0-4.411-4.486-8-10-8zm-2 16.001h4v-4h-4v4zm6 0h2v-4h-2v4zm-2-11.736c-3.859 1.04-3.859 5.423 0 6.464 3.859-1.041 3.859-5.424 0-6.464z"/>
            </svg>
            <span className="font-medium tracking-wider uppercase text-xs mr-6">JOIN THE NOCAP CLUB</span>
            <span className="mx-2 text-xs">•</span>
            <Button 
              onClick={handleSignUp}
              variant="outline" 
              size="sm" 
              className="border-white bg-white text-black hover:bg-black hover:text-white min-w-14 text-xs h-7 px-3 font-medium"
            >
              JOIN
            </Button>
            <span className="mx-2 text-xs">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SignupCarousel; 