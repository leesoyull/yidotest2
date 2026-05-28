
"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown, Building2 } from 'lucide-react';
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
    { name: '회사소개', href: '/#about', sub: [] },
    { name: '사업분야', href: '/#business', sub: [] },
    { 
      name: '시공사례', 
      href: '/portfolio', 
      sub: [
        { name: '전체보기', href: '/portfolio' },
        { name: '하자보수', href: '/portfolio?category=하자보수' },
        { name: '방수', href: '/portfolio?category=방수' },
        { name: '도장', href: '/portfolio?category=도장' },
        { name: '기타', href: '/portfolio?category=기타' }
      ] 
    },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled ? "bg-white/90 backdrop-blur-md shadow-md py-3" : "bg-transparent py-5"
    )}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-1.5 rounded-lg text-white">
            <Building2 className="w-6 h-6" />
          </div>
          <span className={cn(
            "font-headline font-bold text-2xl tracking-tight transition-colors",
            scrolled ? "text-primary" : "text-white"
          )}>
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
                {link.sub.length > 0 && <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />}
              </Link>
              {link.sub.length > 0 && (
                <div className="absolute top-full left-0 pt-4 hidden group-hover:block">
                  <div className="bg-white shadow-xl rounded-xl border p-4 w-48 flex flex-col gap-2">
                    {link.sub.map((s) => (
                      <Link 
                        key={s.name} 
                        href={s.href} 
                        className="text-xs hover:text-accent font-medium py-1 px-2 hover:bg-muted rounded-md transition-all text-primary"
                      >
                        {s.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          <Button asChild className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-full px-6 border-none">
            <Link href="/inquiry">무료 견적 받기</Link>
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
            <div key={link.name} className="flex flex-col gap-2">
              <Link 
                href={link.href} 
                onClick={() => setIsOpen(false)}
                className="text-lg font-semibold text-primary"
              >
                {link.name}
              </Link>
              {link.sub.map((s) => (
                <Link 
                  key={s.name} 
                  href={s.href} 
                  onClick={() => setIsOpen(false)}
                  className="text-sm pl-4 text-muted-foreground"
                >
                  - {s.name}
                </Link>
              ))}
            </div>
          ))}
          <Button className="w-full rounded-full" asChild onClick={() => setIsOpen(false)}>
            <Link href="/inquiry">무료 견적 받기</Link>
          </Button>
        </div>
      )}
    </nav>
  );
}
