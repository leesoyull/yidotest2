
"use client"

import Link from 'next/link';
import { Mail, MapPin, Building2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#0d1f35] text-white/80 pt-20">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-white/5">
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

          <div>
            <h4 className="font-headline text-white font-bold text-sm tracking-widest mb-8 border-b border-white/10 pb-2">COMPANY</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/#about" className="hover:text-accent transition-colors">회사소개</Link></li>
              <li><Link href="/#about" className="hover:text-accent transition-colors">인사말</Link></li>
              <li><Link href="/#about" className="hover:text-accent transition-colors">회사연혁</Link></li>
              <li><Link href="/#why" className="hover:text-accent transition-colors">경영방침</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline text-white font-bold text-sm tracking-widest mb-8 border-b border-white/10 pb-2">SERVICES</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/#business" className="hover:text-accent transition-colors">건물 하자보수</Link></li>
              <li><Link href="/#business" className="hover:text-accent transition-colors">시설물 유지관리</Link></li>
              <li><Link href="/#business" className="hover:text-accent transition-colors">방수 공사</Link></li>
              <li><Link href="/#business" className="hover:text-accent transition-colors">도장 공사</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline text-white font-bold text-sm tracking-widest mb-8 border-b border-white/10 pb-2">CONTACT</h4>
            <ul className="space-y-6 text-sm">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-accent flex-shrink-0" />
                <a href="mailto:yido610@naver.com" className="hover:text-white transition-colors">yido610@naver.com</a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent flex-shrink-0" />
                <span>경기도 (현장 방문 상담 지원)</span>
              </li>
            </ul>
            <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
               <p className="text-[11px] leading-relaxed text-white/40">
                 건물의 안전과 가치를 지키는 이도건설입니다.
               </p>
            </div>
          </div>
        </div>

        <div className="py-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-white font-medium">
            건물의 안전과 가치를 지키는 이도건설입니다.
          </p>
          <div className="flex gap-6 text-xs text-white/30 uppercase tracking-widest">
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
