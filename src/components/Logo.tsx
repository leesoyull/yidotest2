
"use client"

import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export function Logo({ className, variant = 'dark' }: LogoProps) {
  const isWhite = variant === 'light';
  const logoBlue = "#0059ab"; 
  const logoDark = "#002d5a";
  
  return (
    <div className={cn("flex items-center gap-2 md:gap-3 group", className)}>
      <div className="relative w-8 h-10 md:w-9 md:h-12 flex-shrink-0 transition-transform group-hover:scale-105">
        <svg viewBox="0 0 100 125" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Main House Shape - Slimmer proportions for a modern look */}
          <path 
            fillRule="evenodd" 
            clipRule="evenodd" 
            d="M10 50L50 15L90 50V115H10V50ZM32 78L50 66L68 78V115H32V78Z" 
            fill={isWhite ? "white" : logoBlue} 
          />
          {/* Refined bottom detail: The signature diagonal cut line at the bottom left corner */}
          <path 
            d="M10 115L32 78" 
            stroke={isWhite ? "white" : logoBlue} 
            strokeWidth="6" 
            strokeLinecap="round"
          />
        </svg>
      </div>
      <span className={cn(
        "font-sans font-black text-2xl md:text-3xl tracking-tighter",
        isWhite ? "text-white" : logoDark
      )}>
        이도건설
      </span>
    </div>
  );
}
