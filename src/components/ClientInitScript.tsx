"use client";

import { useEffect } from "react";
import { registerHooks } from "@/lib/register-hooks";

export function ClientInitScript() {
  useEffect(() => {
    registerHooks();
  }, []);
  
  return null;
} 