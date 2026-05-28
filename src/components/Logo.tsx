
"use client"

import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export function Logo({ className, variant = 'dark' }: LogoProps) {
  const isWhite = variant === 'light';
  
  return (
    <div className={cn("flex items-center gap-2 md:gap-3 group", className)}>
      <div className="relative w-8 h-8 md:w-10 md:h-10 flex-shrink-0 transition-transform group-hover:scale-105">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* 바깥쪽 집 모양 (파란색 또는 흰색) */}
          <path 
            d="M50 10L10 42V90H90V42L50 10Z" 
            fill={isWhite ? "white" : "hsl(var(--primary))"} 
          />
          {/* 안쪽 작은 집 모양 (배경색 또는 파란색) */}
          <path 
            d="M50 52L32 66V82H68V66L50 52Z" 
            fill={isWhite ? "hsl(var(--primary))" : "white"} 
          />
          {/* 왼쪽 하단 대각선 디테일 */}
          <path 
            d="M10 90L32 68" 
            stroke={isWhite ? "hsl(var(--primary))" : "white"} 
            strokeWidth="4"
          />
        </svg>
      </div>
      <span className={cn(
        "font-headline font-bold text-xl md:text-2xl tracking-tighter transition-colors",
        isWhite ? "text-white" : "text-primary"
      )}>
        이도건설
      </span>
    </div>
  );
}
