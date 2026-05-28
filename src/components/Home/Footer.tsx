"use client"

import Link from 'next/link';
import { Mail, MapPin } from 'lucide-react';
import { Logo } from '@/components/Logo';

export function Footer() {
  return (
    <footer className="bg-[#0d1f35] text-white/80 py-6">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-2">
            <Link href="/">
              <Logo variant="light" className="scale-90 origin-left" />
            </Link>
            <div className="text-[11px] font-bold text-white/40 tracking-[0.2em] pl-1 uppercase">
              CEO : LEE SOYUL
            </div>
          </div>

          <div className="md:text-right">
            <ul className="space-y-1.5 text-xs flex flex-col md:items-end">
              <li className="flex items-center gap-2 justify-end">
                <Mail className="w-3.5 h-3.5 text-accent" />
                <a href="mailto:yido610@naver.com" className="hover:text-white transition-colors">yido610@naver.com</a>
              </li>
              <li className="flex items-center gap-2 justify-end">
                <MapPin className="w-3.5 h-3.5 text-accent" />
                <span>전국 현장 방문 상담 지원</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="text-[9px] text-white/30 uppercase tracking-widest">
            &copy; {new Date().getFullYear()} YIDO CONSTRUCTION. ALL RIGHTS RESERVED.
          </div>
        </div>
      </div>
    </footer>
  );
}