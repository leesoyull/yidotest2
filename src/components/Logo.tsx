
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
    <div className={cn("flex items-center gap-2 md:gap-3 group", className)}>
      <div className="relative w-7 h-10 md:w-9 md:h-12 flex-shrink-0">
        <svg viewBox="0 0 70 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* 가로 폭을 70으로 줄여 슬림하고 날렵한 집 모양 구현 */}
          <path 
            fillRule="evenodd" 
            clipRule="evenodd" 
            d="M0 42L35 5L70 42V95H0V42ZM25 65L35 55L45 65V88H25V65ZM0 95L25 88V90L2 95H0Z" 
            fill={isWhite ? "white" : logoBlue} 
          />
        </svg>
      </div>
      <span className={cn(
        "font-sans font-black text-xl md:text-2xl tracking-tighter",
        isWhite ? "text-white" : "text-[#002d5a]"
      )}>
        이도건설
      </span>
    </div>
  );
}
