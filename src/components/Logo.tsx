
"use client"

import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export function Logo({ className, variant = 'dark' }: LogoProps) {
  const isWhite = variant === 'light';
  const logoBlue = "#0062df"; // 이미지의 선명한 블루 컬러 반영
  
  return (
    <div className={cn("flex items-center gap-3 md:gap-4 group", className)}>
      <div className="relative w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* 외부 집 모양 (Pentagon) */}
          <path 
            fillRule="evenodd" 
            clipRule="evenodd" 
            d="M0 45L50 5L100 45V95H0V45ZM38 65L50 55L62 65V88H38V65ZM0 95L38 88V90L3 95H0Z" 
            fill={isWhite ? "white" : logoBlue} 
          />
        </svg>
      </div>
      <span className={cn(
        "font-sans font-black text-2xl md:text-3xl tracking-tighter",
        isWhite ? "text-white" : "text-[#002d5a]" // 텍스트는 이미지처럼 아주 짙은 블루/블랙 계열
      )}>
        이도건설
      </span>
    </div>
  );
}
