import React from "react";
import Navbar from "./Navbar";

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Navbar />
    </header>
  );
};

export default Header; 