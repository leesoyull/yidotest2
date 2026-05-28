
"use client"

import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export function Logo({ className, variant = 'dark' }: LogoProps) {
  const isWhite = variant === 'light';
  const logoBlue = "#0062df"; // 선명한 이도 블루
  
  return (
    <div className={cn("flex items-center gap-2 md:gap-3 group", className)}>
      <div className="relative w-6 h-10 md:w-8 md:h-12 flex-shrink-0">
        <svg viewBox="0 0 60 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* 외곽 집 모양 (슬림하게 조정) */}
          <path 
            fillRule="evenodd" 
            clipRule="evenodd" 
            d="M0 40L30 5L60 40V95H0V40Z" 
            fill={isWhite ? "white" : logoBlue} 
          />
          {/* 내부 비어있는 공간 (시원하게 크기 확대) */}
          <path 
            d="M18 62L30 50L42 62V95H18V62Z" 
            fill={isWhite ? "#0d1f35" : "white"} 
          />
          {/* 하단 왼쪽 특유의 대각선 절개 디테일 */}
          <path 
            d="M0 95L18 88V91L2 95H0Z" 
            fill={isWhite ? "white" : logoBlue} 
            className="opacity-50"
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
