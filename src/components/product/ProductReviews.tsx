"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star, ThumbsUp, Flag, Filter, Star as StarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface ProductReviewsProps {
  product: Product;
}

export function ProductReviews({ product }: ProductReviewsProps) {
  const [activeFilter, setActiveFilter] = useState<"all" | 1 | 2 | 3 | 4 | 5>("all");
  
  // Mock data - in a real app, these would come from an API
  const mockReviews = [
    {
      id: "1",
      author: "Sarah Johnson",
      rating: 5,
      title: "Absolutely Perfect!",
      content: "I've been searching for the perfect hat for months, and I finally found it. The quality is exceptional, the fit is perfect, and it looks exactly like the pictures. I've already received numerous compliments!",
      date: "3 weeks ago",
      verified: true,
      helpful: 12,
      avatar: "/avatars/avatar-1.jpg",
    },
    {
      id: "2",
      author: "Michael Chen",
      rating: 4,
      title: "Great Hat, Slightly Large",
      content: "The quality and design are excellent, but I found it ran slightly large on me despite ordering my usual size. I was able to adjust it though, and now it fits perfectly. The material is breathable and comfortable for all-day wear.",
      date: "1 month ago",
      verified: true,
      helpful: 8,
      avatar: "/avatars/avatar-2.jpg",
    },
    {
      id: "3", 
      author: "Alex Thompson",
      rating: 5,
      title: "Premium Quality, Worth Every Penny",
      content: "This hat exceeded my expectations in every way. The craftsmanship is evident in every stitch, and the materials feel luxurious. I've worn it in light rain, and it still looks brand new. Highly recommend!",
      date: "2 months ago",
      verified: true,
      helpful: 15,
      avatar: "/avatars/avatar-3.jpg",
    },
    {
      id: "4",
      author: "Jamie Reynolds",
      rating: 3,
      title: "Good, But Not Great",
      content: "The hat is decent quality and looks nice, but I expected more at this price point. The color was slightly different than pictured, and the stitching had a small flaw. Customer service was helpful though and offered a partial refund.",
      date: "1 month ago",
      verified: true,
      helpful: 4,
      avatar: "/avatars/avatar-4.jpg",
    }
  ];

  // Filter reviews based on activeFilter
  const filteredReviews = activeFilter === "all" 
    ? mockReviews 
    : mockReviews.filter(review => review.rating === activeFilter);

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => {
    const count = mockReviews.filter(review => review.rating === rating).length;
    const percentage = (count / mockReviews.length) * 100;
    return { rating, count, percentage };
  });

  // Animation variants
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const staggerContainer = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
    >
      <div className="flex items-center justify-between mb-6">
        <motion.h3 variants={fadeIn} className="text-xl font-bold">
          Customer Reviews
        </motion.h3>
        <motion.div variants={fadeIn}>
          <Button variant="primary" className="gap-2">
            <Star className="w-4 h-4" fill="currentColor" />
            Write a Review
          </Button>
        </motion.div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Review Summary */}
        <motion.div variants={fadeIn} className="lg:w-1/3">
          <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center">
                <motion.p 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="text-5xl font-bold mr-3 dark:text-white"
                >
                  {product.rating || 4.5}
                </motion.p>
                <div className="flex flex-col items-start">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star}
                        className={cn(
                          "h-5 w-5",
                          star <= Math.round(product.rating || 4.5)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300 dark:text-gray-600"
                        )}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Based on {product.reviewCount || mockReviews.length} reviews
                  </p>
                </div>
              </div>
            </div>
            
            {/* Rating Breakdown */}
            <div className="space-y-3">
              {ratingDistribution.map((item) => (
                <div key={item.rating} className="flex items-center">
                  <button
                    onClick={() => setActiveFilter(item.rating as 1|2|3|4|5)}
                    className={cn(
                      "flex items-center w-16 text-sm hover:text-primary transition-colors",
                      activeFilter === item.rating ? "font-medium text-primary" : "text-gray-600 dark:text-gray-400"
                    )}
                  >
                    {item.rating} <Star className="h-3.5 w-3.5 ml-1 fill-current" />
                  </button>
                  <div className="flex-grow mx-3">
                    <Progress 
                      value={item.percentage} 
                      className={cn(
                        "h-2 bg-gray-200 dark:bg-gray-700",
                        activeFilter === item.rating ? "bg-primary" : ""
                      )}
                    />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-9 text-right">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Filter buttons */}
            <div className="mt-6 space-y-3">
              <h4 className="font-medium text-sm mb-2 dark:text-white">Filter Reviews</h4>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={activeFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter("all")}
                  className={activeFilter === "all" ? "bg-primary hover:bg-primary/90" : ""}
                >
                  All Reviews
                </Button>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <Button
                    key={`filter-${rating}`}
                    variant={activeFilter === rating ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveFilter(rating as 1|2|3|4|5)}
                    className={cn(
                      "gap-1",
                      activeFilter === rating ? "bg-primary hover:bg-primary/90" : ""
                    )}
                  >
                    {rating} <Star className="h-3 w-3 fill-current" />
                  </Button>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-medium text-sm mb-2 dark:text-white">People Like You Found These Reviews Helpful</h4>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800">
                  <div className="flex items-center text-sm">
                    <ThumbsUp className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
                    <p className="text-blue-800 dark:text-blue-300">
                      <span className="font-medium">{mockReviews[0].helpful} people</span> found the top review helpful
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Review List */}
        <motion.div 
          variants={staggerContainer}
          className="lg:w-2/3 space-y-6"
        >
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review, index) => (
              <motion.div
                key={review.id}
                variants={{
                  initial: { opacity: 0, y: 20 },
                  animate: { 
                    opacity: 1, 
                    y: 0, 
                    transition: { duration: 0.3, delay: 0.1 * index } 
                  }
                }}
                className="border border-gray-200 dark:border-gray-800 rounded-lg p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={review.avatar} alt={review.author} />
                      <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium dark:text-white">{review.author}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star}
                              className={cn(
                                "h-4 w-4",
                                star <= review.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300 dark:text-gray-600"
                              )}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {review.date}
                        </span>
                      </div>
                    </div>
                  </div>
                  {review.verified && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                      Verified Purchase
                    </Badge>
                  )}
                </div>
                
                <h5 className="font-semibold mb-2 dark:text-white">{review.title}</h5>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{review.content}</p>
                
                <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white gap-1 h-8">
                      <ThumbsUp className="h-4 w-4" />
                      Helpful ({review.helpful})
                    </Button>
                    <div className="text-gray-300 dark:text-gray-700">|</div>
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white gap-1 h-8">
                      <Flag className="h-4 w-4" />
                      Report
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              variants={fadeIn}
              className="text-center py-10 border border-gray-200 dark:border-gray-800 rounded-lg"
            >
              <p className="text-gray-500 dark:text-gray-400">No reviews matching your filter.</p>
              <Button 
                variant="link" 
                onClick={() => setActiveFilter("all")}
                className="mt-2"
              >
                View all reviews instead
              </Button>
            </motion.div>
          )}
          
          {filteredReviews.length > 0 && (
            <motion.div variants={fadeIn} className="mt-6 flex justify-center">
              <Button variant="outline" className="gap-2">
                Load More Reviews
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
} 