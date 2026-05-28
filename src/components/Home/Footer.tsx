
"use client"

import Link from 'next/link';
import { Mail, MapPin, Building2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#0d1f35] text-white/80 pt-20">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 pb-16 border-b border-white/5">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-white">
              <div className="bg-primary p-1.5 rounded-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="font-headline font-bold text-2xl tracking-tight">이도건설</span>
            </div>
            <p className="text-sm leading-relaxed text-white/70">
              건물의 안전과 가치를 지키는 이도건설입니다.
            </p>
            <div className="text-sm font-medium text-white/60">
              대표이사: 이소율
            </div>
          </div>

          <div className="md:text-right">
            <h4 className="font-headline text-white font-bold text-sm tracking-widest mb-8 border-b border-white/10 pb-2 md:inline-block">CONTACT</h4>
            <ul className="space-y-6 text-sm flex flex-col md:items-end">
              <li className="flex items-start gap-3 justify-end">
                <Mail className="w-5 h-5 text-accent flex-shrink-0" />
                <a href="mailto:yido610@naver.com" className="hover:text-white transition-colors">yido610@naver.com</a>
              </li>
              <li className="flex items-start gap-3 justify-end">
                <MapPin className="w-5 h-5 text-accent flex-shrink-0" />
                <span>전국 (현장 방문 상담 지원)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="py-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-6 text-xs text-white/30 uppercase tracking-widest">
            <span>&copy; {new Date().getFullYear()} YIDO CONSTRUCTION. ALL RIGHTS RESERVED.</span>
          </div>
          <div className="flex gap-6 text-xs text-white/30 uppercase tracking-widest">
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
