
"use client"

import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export function Logo({ className, variant = 'dark' }: LogoProps) {
  const isWhite = variant === 'light';
  const logoBlue = "#0059ab"; // 이미지와 유사한 깊은 블루
  
  return (
    <div className={cn("flex items-center gap-2 md:gap-3 group", className)}>
      <div className="relative w-8 h-12 md:w-10 md:h-14 flex-shrink-0 transition-transform group-hover:scale-105">
        <svg viewBox="0 0 70 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* 외부 집 모양과 내부 집 모양 구멍 (이미지 비율 반영) */}
          <path 
            fillRule="evenodd" 
            clipRule="evenodd" 
            d="M0 45L35 10L70 45V100H0V45ZM22 68L35 58L48 68V100H22V68Z" 
            fill={isWhite ? "white" : logoBlue} 
          />
          {/* 왼쪽 하단 특유의 대각선 절개선 */}
          <path 
            d="M0 100L22 68" 
            stroke={isWhite ? "white" : logoBlue} 
            strokeWidth="3.5" 
          />
        </svg>
      </div>
      <span className={cn(
        "font-sans font-black text-2xl md:text-3xl tracking-tighter",
        isWhite ? "text-white" : "text-[#002d5a]"
      )}>
        이도건설
      </span>
    </div>
  );
}
