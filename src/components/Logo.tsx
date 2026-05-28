
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
    <div className={cn("flex items-center gap-3 md:gap-4 group", className)}>
      {/* 로고 아이콘: 사용자 이미지의 비율과 디테일을 SVG로 정밀 재현 */}
      <div className="relative w-10 h-10 md:w-12 md:h-12 flex-shrink-0 transition-transform group-hover:scale-105">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* 메인 외곽 집 모양 (Pentagon) */}
          <path 
            fillRule="evenodd" 
            clipRule="evenodd" 
            d="M5 48L50 10L95 48V95H5V48ZM30 70L50 50L70 70V95H30V70Z" 
            fill={isWhite ? "white" : logoBlue} 
          />
          {/* 이미지의 핵심 디테일: 왼쪽 아래 모서리에서 내부로 이어지는 대각선 절개선 */}
          <line 
            x1="5" y1="95" x2="30" y2="70" 
            stroke={isWhite ? "#0d1f35" : "white"} 
            strokeWidth="4" 
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
