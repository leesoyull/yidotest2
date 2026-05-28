
"use client"

import Link from 'next/link';
import { Mail, MapPin } from 'lucide-react';
import { Logo } from '@/components/Logo';

export function Footer() {
  return (
    <footer className="bg-[#0d1f35] text-white/80 pt-6">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-6 pb-4 border-b border-white/5 items-center">
          <div className="space-y-3">
            <Link href="/">
              <Logo variant="light" />
            </Link>
            <div className="text-xs font-bold text-white/40 tracking-widest pl-1 uppercase">
              CEO : LEE SOYUL
            </div>
          </div>

          <div className="md:text-right">
            <ul className="space-y-1.5 text-xs flex flex-col md:items-end">
              <li className="flex items-start gap-3 justify-end">
                <Mail className="w-3.5 h-3.5 text-accent flex-shrink-0 mt-0.5" />
                <a href="mailto:yido610@naver.com" className="hover:text-white transition-colors">yido610@naver.com</a>
              </li>
              <li className="flex items-start gap-3 justify-end">
                <MapPin className="w-3.5 h-3.5 text-accent flex-shrink-0 mt-0.5" />
                <span>전국 (현장 방문 상담 지원)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="py-3 flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex gap-4 text-[9px] text-white/30 uppercase tracking-widest">
            <span>&copy; {new Date().getFullYear()} YIDO CONSTRUCTION. ALL RIGHTS RESERVED.</span>
          </div>
          <div className="flex gap-4 text-[9px] text-white/30 uppercase tracking-widest">
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
