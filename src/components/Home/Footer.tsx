"use client"

import Link from 'next/link';
import { Mail, MapPin, Settings, Lock } from 'lucide-react';
import { Logo } from '@/components/Logo';

export function Footer() {
  return (
    <footer className="bg-[#0d1f35] text-white/80 py-10">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <Link href="/">
              <Logo variant="light" className="scale-90 origin-left" />
            </Link>
            <div className="text-[11px] font-bold text-white/40 tracking-[0.2em] pl-1 uppercase">
              대표이사 : 이소율 | 이도건설 (YIDO CONSTRUCTION)
            </div>
          </div>

          <div className="md:text-right">
            <ul className="space-y-2 text-sm flex flex-col md:items-end">
              <li className="flex items-center gap-2 justify-end">
                <Mail className="w-4 h-4 text-accent" />
                <a href="mailto:yido610@naver.com" className="hover:text-white transition-colors">yido610@naver.com</a>
              </li>
              <li className="flex items-center gap-2 justify-end">
                <MapPin className="w-4 h-4 text-accent" />
                <span>전국 현장 방문 상담 및 무료 견적 지원</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-[10px] text-white/30 uppercase tracking-widest font-medium">
            &copy; {new Date().getFullYear()} YIDO CONSTRUCTION. ALL RIGHTS RESERVED.
          </div>
          <Link 
            href="/admin" 
            className="group flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all"
          >
            <Lock className="w-3 h-3 text-white/40 group-hover:text-accent transition-colors" />
            <span className="text-[11px] font-bold text-white/40 group-hover:text-white transition-colors uppercase tracking-tight">
              관리자 로그인 (ADMIN)
            </span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
