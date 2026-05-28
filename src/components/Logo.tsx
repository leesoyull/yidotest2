
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
          {/* 지붕 부분 - 더 날렵하고 세련된 각도 */}
          <path 
            d="M50 15L10 48V58L50 25L90 58V48L50 15Z" 
            fill={isWhite ? "white" : "hsl(var(--primary))"} 
          />
          {/* 본체 부분 - 안정감 있는 구조 */}
          <path 
            d="M20 55V85H80V55H70V75H30V55H20Z" 
            fill={isWhite ? "white" : "hsl(var(--primary))"} 
          />
          {/* 중앙 포인트 - 건축적 디테일 */}
          <rect 
            x="44" y="60" width="12" height="25" 
            fill={isWhite ? "white" : "hsl(var(--primary))"} 
          />
          {/* 하단 기단 - 견고함 상징 */}
          <rect 
            x="15" y="88" width="70" height="4" 
            fill={isWhite ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.1)"} 
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
