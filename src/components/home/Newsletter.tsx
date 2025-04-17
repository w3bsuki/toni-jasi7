"use client";

import React, { useState } from "react";

interface NewsletterProps {
  title: string;
  subtitle: string;
}

export function Newsletter({ title, subtitle }: NewsletterProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    // Simulate API call
    try {
      // In a real app, you would submit to an API here
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSuccess(true);
      setEmail("");
    } catch (err) {
      setError("Failed to subscribe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-3">{title}</h2>
          <p className="text-gray-600 mb-8">{subtitle}</p>
          
          {isSuccess ? (
            <div className="bg-green-100 text-green-800 px-4 py-3 rounded mb-4">
              Thanks for subscribing! We've sent a confirmation to your email.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              {error && (
                <div className="bg-red-100 text-red-800 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}
              
              <div className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="flex-grow px-4 py-3 focus:outline-none border border-r-0 border-gray-300"
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  className="bg-black text-white px-6 py-3 font-medium hover:bg-gray-800 transition-colors"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Subscribing..." : "Subscribe"}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                By subscribing, you agree to our Privacy Policy and to receive marketing emails.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export default Newsletter; 