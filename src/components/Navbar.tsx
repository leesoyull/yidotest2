
"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Hammer, Menu, X, ChevronDown } from 'lucide-react';
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
    { name: '문의하기', href: '#contact', sub: ['AI진단', '견적요청'] },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled ? "bg-white/90 backdrop-blur-md shadow-md py-3" : "bg-transparent py-5"
    )}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-lg">
            <Hammer className="text-white w-6 h-6" />
          </div>
          <span className="font-headline font-bold text-xl tracking-tight text-primary">
            BuildFlow YIDO
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <div key={link.name} className="group relative">
              <Link 
                href={link.href} 
                className="font-medium text-sm hover:text-accent transition-colors flex items-center gap-1"
              >
                {link.name}
                <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
              </Link>
              <div className="absolute top-full left-0 pt-4 hidden group-hover:block">
                <div className="bg-white shadow-xl rounded-xl border p-4 w-48 flex flex-col gap-2">
                  {link.sub.map((s) => (
                    <Link key={s} href={link.href} className="text-xs hover:text-accent font-medium py-1 px-2 hover:bg-muted rounded-md transition-all">
                      {s}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
          <Button asChild className="bg-primary hover:bg-primary/90 text-white font-semibold">
            <Link href="#contact">무료 견적 받기</Link>
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-primary" onClick={() => setIsOpen(!isOpen)}>
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
              className="text-lg font-semibold border-b pb-2"
            >
              {link.name}
            </Link>
          ))}
          <Button className="w-full" asChild onClick={() => setIsOpen(false)}>
            <Link href="#contact">무료 견적 받기</Link>
          </Button>
        </div>
      )}
    </nav>
  );
}
