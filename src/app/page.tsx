
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
      <div className="bg-primary-foreground py-2 border-b border-muted">
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {['하자보수', '방수공사', '도장전문', '시설관리'].map((item) => (
            <div key={item} className="flex items-center justify-center gap-2 py-1">
              <CheckCircle2 className="w-3 h-3 text-accent" />
              <span className="text-[10px] font-bold text-primary tracking-tight">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* About Section - COMPANY INTRO */}
      <SectionReveal id="about" className="bg-white py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left Column: Text Content */}
            <div className="space-y-8 md:pl-20">
              <div>
                <RevealItem>
                  <span className="text-accent font-bold text-[10px] tracking-[0.3em] uppercase mb-1 block">Company Intro</span>
                </RevealItem>
                <RevealItem delay={100}>
                  <div className="flex flex-col">
                    <h2 className="font-brush text-primary leading-none tracking-tighter text-[12rem] md:text-[15rem] font-black">
                      이도
                    </h2>
                    <span className="text-4xl md:text-5xl font-bold text-primary/30 tracking-tight -mt-8 ml-2">
                      (利道)
                    </span>
                  </div>
                </RevealItem>
              </div>

              <div className="space-y-6">
                <RevealItem delay={200}>
                  <h3 className="font-bold text-primary text-3xl md:text-4xl tracking-tight leading-tight">
                    이롭고 바른 길을 <br/> 함께 걷겠습니다
                  </h3>
                </RevealItem>
                
                <RevealItem delay={300}>
                  <div className="space-y-4 text-muted-foreground text-sm font-normal max-w-xl leading-relaxed">
                    <p>
                      이도건설의 사명 <span className="text-primary font-bold">'이도(利道)'</span>는 <span className="text-accent font-bold">'이로울 이(利)'</span>와 <span className="text-accent font-bold">'길 도(道)'</span>로, 고객과 함께 이롭고 바른 길을 걸어가겠다는 진심을 담고 있습니다.
                    </p>
                    <p>
                      작은 공사 하나도 정직하게 완수하는 것을 최우선으로 하며, 건물 하자보수부터 시설물 유지관리까지 신뢰를 바탕으로 최선을 다하겠습니다.
                    </p>
                  </div>
                </RevealItem>
              </div>
            </div>
            
            {/* Right Column: Value Cards */}
            <div className="lg:pt-12">
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { title: '정직한 시공', desc: '과장 없이 정확한 견적과 성실한 시공을 약속합니다.' },
                  { title: '꼼꼼한 진단', desc: '근본 원인을 찾아 빈틈 없는 보수를 진행합니다.' },
                  { title: '책임 시공 보증', desc: '시공 후에도 하자가 발생하면 책임지고 재보수합니다.' },
                  { title: '신속한 대응', desc: '신속하게 현장을 확인하고 방안을 제안합니다.' },
                ].map((card, i) => (
                  <RevealItem key={i} delay={i * 100 + 400} className="p-8 bg-muted/20 rounded-[2rem] border border-muted/50 hover:border-accent/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
                    <h4 className="font-bold text-primary text-lg mb-3">{card.title}</h4>
                    <p className="text-muted-foreground text-xs leading-relaxed font-medium">{card.desc}</p>
                  </RevealItem>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SectionReveal>

      {/* Business Area Section */}
      <SectionReveal id="business" className="bg-background py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-1">
            <RevealItem>
              <span className="text-accent font-bold text-[10px] tracking-widest uppercase">Business Areas</span>
            </RevealItem>
            <RevealItem delay={100}>
              <h2 className="font-headline text-3xl md:text-4xl font-bold">주요 사업 분야</h2>
            </RevealItem>
            <RevealItem delay={200}>
              <p className="text-muted-foreground text-sm font-light leading-relaxed">
                건축물의 수명을 연장하고 가치를 보존하는 이도건설만의 전문 서비스입니다.
              </p>
            </RevealItem>
          </div>
          <BusinessGrid />
        </div>
      </SectionReveal>

      {/* Project Status Section */}
      <SectionReveal id="status" className="bg-white py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-1">
            <RevealItem>
              <span className="text-accent font-bold text-[10px] tracking-widest uppercase">Performance</span>
            </RevealItem>
            <RevealItem delay={100}>
              <h2 className="font-headline text-3xl md:text-4xl font-bold">시공 실적 현황</h2>
            </RevealItem>
          </div>
          <ProjectStatus />
        </div>
      </SectionReveal>

      {/* Why Yido Section */}
      <SectionReveal id="why" className="bg-background py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-2">
            <RevealItem>
              <span className="text-accent font-bold text-[10px] tracking-widest uppercase">Why Choose Us</span>
            </RevealItem>
            <RevealItem delay={100}>
              <h2 className="font-headline text-3xl md:text-4xl font-bold">이도건설을 선택해야 하는 이유</h2>
            </RevealItem>
          </div>
          <StatsBand />
        </div>
      </SectionReveal>

      {/* CTA Band */}
      <SectionReveal id="contact" className="bg-primary text-white py-32">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-2 text-center md:text-left">
            <RevealItem>
              <h3 className="font-headline text-4xl md:text-5xl font-bold leading-tight">견적을 의뢰하고 싶으신가요?</h3>
              <p className="text-white/70 text-lg md:text-xl font-light">건물의 안전과 가치를 지키는 이도건설이 함께합니다.</p>
            </RevealItem>
          </div>
          <div className="flex flex-col items-center md:items-end gap-4">
            <RevealItem delay={100}>
              <div className="flex items-center gap-3 py-2 px-8 bg-white/5 rounded-full border border-white/10 backdrop-blur-sm">
                <Mail className="text-accent w-5 h-5" />
                <span className="font-bold text-accent text-base">yido610@naver.com</span>
              </div>
            </RevealItem>
            <RevealItem delay={200}>
              <Button asChild size="lg" className="bg-white text-primary hover:bg-accent hover:text-white h-14 px-10 rounded-full text-lg font-black transition-all shadow-xl">
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
