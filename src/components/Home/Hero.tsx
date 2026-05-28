
"use client"

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/button';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      img: PlaceHolderImages.find(i => i.id === 'hero-1'),
      tag: "YIDO CONSTRUCTION",
      title: "이로운 길을 걷는\n이도건설",
      desc: "건물 하자보수부터 시설물 유지관리까지\n고객의 소중한 공간을 책임있게 관리합니다."
    },
    {
      img: PlaceHolderImages.find(i => i.id === 'hero-2'),
      tag: "WATERPROOFING & PAINTING",
      title: "방수·도장 공사\n전문 시공",
      desc: "오랜 경험과 검증된 자재로 시공하는\n고품질 방수 및 도장 전문 서비스"
    },
    {
      img: PlaceHolderImages.find(i => i.id === 'hero-3'),
      tag: "FACILITY MANAGEMENT",
      title: "시설물 유지관리\n토탈 서비스",
      desc: "공동주택, 상업시설, 공공건물의\n체계적인 시설물 유지관리를 담당합니다."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden bg-primary">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <Image
            src={slide.img?.imageUrl || ''}
            alt="Hero Background"
            fill
            priority={index === 0}
            className="object-cover opacity-40"
            data-ai-hint={slide.img?.imageHint}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent" />
          
          <div className="relative h-full container mx-auto px-6 flex flex-col justify-center items-start text-white">
            <div className="max-w-2xl space-y-6">
              <span className="inline-block py-1 px-4 border border-white/30 bg-white/10 backdrop-blur-sm text-xs tracking-[0.2em] font-bold uppercase rounded-full">
                {slide.tag}
              </span>
              <h1 className="font-headline text-5xl md:text-7xl font-bold leading-tight whitespace-pre-line">
                {slide.title.split('\n')[0]} <br/>
                <span className="text-accent">{slide.title.split('\n')[1]}</span>
              </h1>
              <p className="text-lg md:text-xl text-white/80 font-light whitespace-pre-line leading-relaxed">
                {slide.desc}
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-white px-8 h-14 rounded-full text-md font-bold transition-all transform hover:scale-105">
                  사업분야 보기
                </Button>
                <Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/10 px-8 h-14 rounded-full text-md font-medium">
                  견적 문의
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <div className="absolute bottom-10 right-10 z-20 flex gap-4">
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20"
          onClick={() => setCurrentSlide((currentSlide - 1 + slides.length) % slides.length)}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20"
          onClick={() => setCurrentSlide((currentSlide + 1) % slides.length)}
        >
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`h-1.5 transition-all duration-300 rounded-full ${
              i === currentSlide ? 'w-10 bg-accent' : 'w-2 bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
