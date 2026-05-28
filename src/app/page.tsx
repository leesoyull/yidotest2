
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Home/Hero';
import { SectionReveal, RevealItem } from '@/components/SectionReveal';
import { BusinessGrid } from '@/components/Home/BusinessGrid';
import { StatsBand } from '@/components/Home/StatsBand';
import { Footer } from '@/components/Home/Footer';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />

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

      {/* About Section */}
      <SectionReveal id="about" className="bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <RevealItem>
                <span className="text-accent font-bold text-xs tracking-widest uppercase">Company Intro</span>
                <h2 className="font-headline text-4xl md:text-5xl font-bold mt-4 leading-tight">
                  <span className="text-primary">이로운 길</span>을 <br/>
                  함께 걷겠습니다
                </h2>
              </RevealItem>
              <RevealItem delay={100}>
                <div className="space-y-6 text-muted-foreground text-lg font-light leading-relaxed">
                  <p className="font-bold text-primary">
                    이롭고 바른 길을 함께 걷겠습니다
                  </p>
                  <p>
                    이도건설의 사명 '이도(以道)'는 '이로울 이(以)'와 '길 도(道)'로, 고객과 함께 이롭고 바른 길을 걸어가겠다는 뜻을 담고 있습니다. 작은 공사 하나도 정직하고 성실하게 완수하는 것을 최우선 가치로 삼습니다.
                  </p>
                  <p>
                    건물 하자보수, 시설물 유지관리, 방수·도장 등 건물 전반의 유지보수 분야에서 고객의 신뢰를 얻기 위해 최선을 다하겠습니다.
                  </p>
                </div>
              </RevealItem>
              <RevealItem delay={200}>
                <Button asChild size="lg" className="h-14 px-8 rounded-full bg-primary hover:bg-primary/90">
                  <Link href="/inquiry" className="flex items-center gap-2">
                    상담 문의하기 <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </RevealItem>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { title: '정직한 시공', desc: '과장 없이 정확한 견적과 성실한 시공을 약속합니다.' },
                { title: '꼼꼼한 진단', desc: '근본 원인을 찾아 재발 없는 보수를 진행합니다.' },
                { title: '책임 시공 보증', desc: '시공 후에도 철저한 사후관리를 보장합니다.' },
                { title: '신속한 대응', desc: '신속하게 현장을 확인하고 방안을 제안합니다.' },
              ].map((card, i) => (
                <RevealItem key={i} delay={i * 100} className="p-8 bg-muted/30 rounded-2xl border border-muted hover:border-accent/50 transition-colors">
                  <h4 className="font-bold text-primary text-xl mb-3">{card.title}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">{card.desc}</p>
                </RevealItem>
              ))}
            </div>
          </div>
        </div>
      </SectionReveal>

      {/* Business Area Section */}
      <SectionReveal id="business" className="bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <RevealItem>
              <span className="text-accent font-bold text-xs tracking-widest uppercase">Business Areas</span>
            </RevealItem>
            <RevealItem delay={100}>
              <h2 className="font-headline text-4xl md:text-5xl font-bold">주요 사업 분야</h2>
            </RevealItem>
            <RevealItem delay={200}>
              <p className="text-muted-foreground text-lg font-light">
                건축물의 수명을 연장하고 가치를 보존하는 <br className="hidden md:block"/>
                이도건설만의 체계적인 전문 시공 서비스입니다.
              </p>
            </RevealItem>
          </div>
          <BusinessGrid />
        </div>
      </SectionReveal>

      {/* Why Yido Section */}
      <SectionReveal id="why" className="bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <RevealItem>
              <span className="text-accent font-bold text-xs tracking-widest uppercase">Why Choose Us</span>
            </RevealItem>
            <RevealItem delay={100}>
              <h2 className="font-headline text-4xl md:text-5xl font-bold">이도건설을 선택해야 하는 이유</h2>
            </RevealItem>
          </div>
          <StatsBand />
        </div>
      </SectionReveal>

      {/* CTA Band */}
      <SectionReveal id="contact" className="bg-primary text-white py-16">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="space-y-4">
            <RevealItem>
              <h3 className="font-headline text-3xl md:text-4xl font-bold">견적을 의뢰하고 싶으신가요?</h3>
              <p className="text-white/70 text-lg font-light">건물의 안전과 가치를 지키는 이도건설입니다.</p>
            </RevealItem>
          </div>
          <div className="flex flex-col items-center md:items-end gap-6">
            <RevealItem delay={100}>
              <div className="flex items-center gap-4 py-2 px-6 bg-white/5 rounded-full border border-white/10">
                <Mail className="text-accent w-5 h-5" />
                <span className="font-bold text-accent">yido610@naver.com</span>
              </div>
            </RevealItem>
            <RevealItem delay={200}>
              <Button asChild size="lg" className="bg-white text-primary hover:bg-accent hover:text-white h-16 px-10 rounded-full text-lg font-black transition-all">
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
