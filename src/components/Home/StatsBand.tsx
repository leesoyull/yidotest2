
"use client"

import { RevealItem } from '../SectionReveal';

const stats = [
  { label: '시공 보증', value: '책임', icon: '🎯', desc: '시공 완료 후에도 하자가 발생하면 책임지고 재보수합니다.' },
  { label: '빠른 현장 대응', value: '신속', icon: '⚡', desc: '문의 접수 후 신속하게 현장을 확인하고 일정을 안내합니다.' },
  { label: '적정 견적', value: '합리', icon: '💰', desc: '과도한 마진 없이 공정하고 합리적인 견적을 제공합니다.' },
  { label: '정직한 소통', value: '신뢰', icon: '🤝', desc: '공사 진행 상황을 투명하게 공유하고 고객과 함께 결정합니다.' },
];

export function StatsBand() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {stats.map((stat, i) => (
        <RevealItem key={i} delay={i * 100} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 border-t-4 border-primary text-center group">
          <div className="text-4xl mb-6 transform group-hover:scale-125 transition-transform duration-500">{stat.icon}</div>
          <div className="font-headline text-3xl font-black text-primary mb-2">{stat.value}</div>
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">{stat.label}</div>
          <div className="w-8 h-1 bg-accent mx-auto mb-6 group-hover:w-16 transition-all duration-500"></div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {stat.desc}
          </p>
        </RevealItem>
      ))}
    </div>
  );
}
