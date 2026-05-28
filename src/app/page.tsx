
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Home/Hero';
import { SectionReveal, RevealItem } from '@/components/SectionReveal';
import { BusinessGrid } from '@/components/Home/BusinessGrid';
import { StatsBand } from '@/components/Home/StatsBand';
import { ProjectStatus } from '@/components/Home/ProjectStatus';
import { Footer } from '@/components/Home/Footer';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="relative">
        <Hero />
      </div>

      {/* Quick Access Band */}
      <div className="bg-primary-foreground py-4 border-b border-muted">
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {['하자보수', '방수공사', '도장전문', '시설관리'].map((item) => (
            <div key={item} className="flex items-center justify-center gap-2 py-2">
              <CheckCircle2 className="w-4 h-4 text-accent" />
              <span className="text-xs font-bold text-primary tracking-tight">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* About Section - COMPANY INTRO */}
      <SectionReveal id="about" className="bg-white py-64 md:py-80">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24 items-start">
            <div className="space-y-40">
              <div>
                <RevealItem>
                  <span className="text-accent font-bold text-xs tracking-[0.3em] uppercase mb-16 block">Company Intro</span>
                </RevealItem>
                <RevealItem delay={100}>
                  {/* 요청에 따라 '이도' 텍스트 크기를 압도적으로 키움 */}
                  <h2 className="font-brush text-primary leading-none flex flex-row items-baseline gap-12 mt-12">
                    <span className="text-[22rem] md:text-[26rem] font-black tracking-tighter">이도</span>
                    <span className="text-6xl md:text-7xl font-bold opacity-30 tracking-tight">(利道)</span>
                  </h2>
                </RevealItem>
              </div>

              <RevealItem delay={200}>
                <div className="space-y-24 text-muted-foreground text-lg leading-relaxed pt-12">
                  <p className="font-bold text-primary text-5xl md:text-6xl tracking-tight">
                    이롭고 바른 길을 <br/> 함께 걷겠습니다
                  </p>
                  <div className="space-y-10 text-lg font-normal max-w-xl">
                    <p>
                      이도건설의 사명 <span className="text-primary font-bold">'이도(利道)'</span>는 <span className="text-accent font-bold">'이로울 이(利)'</span>와 <span className="text-accent font-bold">'길 도(道)'</span>로, 고객과 함께 이롭고 바른 길을 걸어가겠다는 진심을 담고 있습니다.
                    </p>
                    <p>
                      작은 공사 하나도 정직하게 완수하는 것을 최우선으로 하며, 건물 하자보수부터 시설물 유지관리까지 신뢰를 바탕으로 최선을 다하겠습니다.
                    </p>
                  </div>
                </div>
              </RevealItem>

              <RevealItem delay={300} className="pt-48">
                {/* 버튼을 더 아래로 배치 */}
                <Button asChild size="lg" className="h-24 px-24 rounded-full bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/20 text-3xl font-black transition-all hover:scale-105">
                  <Link href="/inquiry" className="flex items-center gap-4">
                    상담 문의하기 <ArrowRight className="w-10 h-10" />
                  </Link>
                </Button>
              </RevealItem>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-10 lg:mt-80">
              {[
                { title: '정직한 시공', desc: '과장 없이 정확한 견적과 성실한 시공을 약속합니다.' },
                { title: '꼼꼼한 진단', desc: '근본 원인을 찾아 재발 없는 보수를 진행합니다.' },
                { title: '책임 시공 보증', desc: '시공 후에도 철저한 사후관리를 보장합니다.' },
                { title: '신속한 대응', desc: '신속하게 현장을 확인하고 방안을 제안합니다.' },
              ].map((card, i) => (
                <RevealItem key={i} delay={i * 150} className="p-14 bg-muted/30 rounded-[3rem] border border-muted hover:border-accent/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5">
                  <h4 className="font-bold text-primary text-2xl mb-8">{card.title}</h4>
                  <p className="text-muted-foreground text-base leading-relaxed">{card.desc}</p>
                </RevealItem>
              ))}
            </div>
          </div>
        </div>
      </SectionReveal>

      {/* Business Area Section */}
      <SectionReveal id="business" className="bg-background py-64 md:py-80">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-40 space-y-8">
            <RevealItem>
              <span className="text-accent font-bold text-xs tracking-widest uppercase">Business Areas</span>
            </RevealItem>
            <RevealItem delay={100}>
              <h2 className="font-headline text-5xl md:text-7xl font-bold">주요 사업 분야</h2>
            </RevealItem>
            <RevealItem delay={200}>
              <p className="text-muted-foreground text-2xl font-light leading-relaxed">
                건축물의 수명을 연장하고 가치를 보존하는 <br className="hidden md:block"/>
                이도건설만의 체계적인 전문 시공 서비스입니다.
              </p>
            </RevealItem>
          </div>
          <BusinessGrid />
        </div>
      </SectionReveal>

      {/* Project Status Section */}
      <SectionReveal id="status" className="bg-white py-64 md:py-80">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-32 space-y-8">
            <RevealItem>
              <span className="text-accent font-bold text-xs tracking-widest uppercase">Performance</span>
            </RevealItem>
            <RevealItem delay={100}>
              <h2 className="font-headline text-5xl md:text-7xl font-bold">시공 실적 현황</h2>
            </RevealItem>
            <RevealItem delay={200}>
              <p className="text-muted-foreground text-2xl font-light">
                매년 성장하며 신뢰를 쌓아가고 있습니다.
              </p>
            </RevealItem>
          </div>
          <ProjectStatus />
        </div>
      </SectionReveal>

      {/* Why Yido Section */}
      <SectionReveal id="why" className="bg-background py-80 md:py-[24rem]">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-56 space-y-12">
            <RevealItem>
              <span className="text-accent font-bold text-xs tracking-widest uppercase">Why Choose Us</span>
            </RevealItem>
            <RevealItem delay={100}>
              <h2 className="font-headline text-5xl md:text-7xl font-bold">이도건설을 선택해야 하는 이유</h2>
            </RevealItem>
          </div>
          <StatsBand />
        </div>
      </SectionReveal>

      {/* CTA Band */}
      <SectionReveal id="contact" className="bg-primary text-white py-64">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-20">
          <div className="space-y-10">
            <RevealItem>
              <h3 className="font-headline text-5xl md:text-7xl font-bold leading-tight">견적을 의뢰하고 싶으신가요?</h3>
              <p className="text-white/70 text-3xl font-light">건물의 안전과 가치를 지키는 이도건설이 함께합니다.</p>
            </RevealItem>
          </div>
          <div className="flex flex-col items-center md:items-end gap-12">
            <RevealItem delay={100}>
              <div className="flex items-center gap-8 py-6 px-12 bg-white/5 rounded-full border border-white/10 backdrop-blur-sm">
                <Mail className="text-accent w-10 h-10" />
                <span className="font-bold text-accent text-2xl">yido610@naver.com</span>
              </div>
            </RevealItem>
            <RevealItem delay={200}>
              <Button asChild size="lg" className="bg-white text-primary hover:bg-accent hover:text-white h-24 px-20 rounded-full text-3xl font-black transition-all shadow-2xl">
                <Link href="/inquiry">지금 바로 문의하기</Link>
              </Button>
            </RevealItem>
          </div>
        </div>
      </SectionReveal>

      <Footer />
    </main>
  );
}
