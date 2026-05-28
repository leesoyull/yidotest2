
"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: '회사소개', href: '#about', sub: ['인사말', '연혁', '경영방침'] },
    { name: '사업분야', href: '#business', sub: ['하자보수', '방수공사', '도장공사', '시설관리'] },
    { name: '시공사례', href: '#portfolio', sub: ['전체보기', '방수', '도장'] },
    { name: '문의하기', href: '#contact', sub: ['견적요청', '상담신청'] },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled ? "bg-white/90 backdrop-blur-md shadow-md py-3" : "bg-transparent py-5"
    )}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-1 rounded-sm">
             <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3zM12 8.5L16.5 13H15v5h-2v-5h-2v5H9v-5H7.5L12 8.5z" />
             </svg>
          </div>
          <span className="font-headline font-bold text-2xl tracking-tight text-primary">
            이도건설
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <div key={link.name} className="group relative">
              <Link 
                href={link.href} 
                className={cn(
                  "font-medium text-sm transition-colors flex items-center gap-1",
                  scrolled ? "text-primary hover:text-accent" : "text-white hover:text-accent"
                )}
              >
                {link.name}
                <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
              </Link>
              <div className="absolute top-full left-0 pt-4 hidden group-hover:block">
                <div className="bg-white shadow-xl rounded-xl border p-4 w-48 flex flex-col gap-2">
                  {link.sub.map((s) => (
                    <Link key={s} href={link.href} className="text-xs hover:text-accent font-medium py-1 px-2 hover:bg-muted rounded-md transition-all text-primary">
                      {s}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
          <Button asChild className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-full px-6">
            <Link href="http://www.kumyoungenc.com/pc/customer/customer04.php">무료 견적 받기</Link>
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button className={cn("md:hidden", scrolled ? "text-primary" : "text-white")} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b shadow-xl p-6 flex flex-col gap-4 animate-in slide-in-from-top duration-300">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              onClick={() => setIsOpen(false)}
              className="text-lg font-semibold border-b pb-2 text-primary"
            >
              {link.name}
            </Link>
          ))}
          <Button className="w-full rounded-full" asChild onClick={() => setIsOpen(false)}>
            <Link href="http://www.kumyoungenc.com/pc/customer/customer04.php">무료 견적 받기</Link>
          </Button>
        </div>
      )}
    </nav>
  );
}
