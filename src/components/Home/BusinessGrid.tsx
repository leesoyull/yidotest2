
"use client"

import { Hammer, Droplets, Paintbrush, Building2, Layers, Settings } from 'lucide-react';
import { RevealItem } from '../SectionReveal';

const services = [
  {
    icon: <Hammer className="w-10 h-10" />,
    title: "건물 하자보수",
    desc: "균열, 누수, 결로, 박리 등 다양한 하자 유형을 정확히 진단하고 근본적인 원인을 제거하는 체계적인 보수 시공을 합니다.",
    num: "01"
  },
  {
    icon: <Building2 className="w-10 h-10" />,
    title: "시설물 유지관리",
    desc: "공동주택, 상업시설, 공공건물의 시설물을 정기적으로 점검하고 관리하여 건물의 수명을 연장하고 가치를 유지합니다.",
    num: "02"
  },
  {
    icon: <Droplets className="w-10 h-10" />,
    title: "방수 공사",
    desc: "옥상, 지하, 외벽, 욕실 등 부위별 특성에 맞는 공법을 적용하여 누수를 원천 차단하는 방수 전문 시공을 합니다.",
    num: "03"
  },
  {
    icon: <Paintbrush className="w-10 h-10" />,
    title: "도장 공사",
    desc: "내부 인테리어 도장부터 외벽 보호도장까지, 건물 환경에 적합한 도료를 선정하여 내구성 높은 도장 시공을 제공합니다.",
    num: "04"
  },
  {
    icon: <Layers className="w-10 h-10" />,
    title: "외벽·줄눈 보수",
    desc: "타일 탈락, 줄눈 손상, 외벽 오염 등을 전문적으로 보수하여 건물 외관을 새롭게 정비합니다.",
    num: "05"
  },
  {
    icon: <Settings className="w-10 h-10" />,
    title: "기타 건축 공사",
    desc: "건물의 다양한 유지보수·리모델링 공사에 대해 고객 맞춤형 상담과 시공을 지원합니다.",
    num: "06"
  }
];

export function BusinessGrid() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-muted overflow-hidden rounded-2xl border">
      {services.map((service, i) => (
        <RevealItem key={i} delay={i * 100} className="bg-white p-10 group hover:bg-primary transition-all duration-500 relative h-full">
          <span className="absolute top-6 right-8 font-headline text-5xl font-black text-muted/30 group-hover:text-white/5 transition-colors">
            {service.num}
          </span>
          <div className="text-accent mb-8 transform group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500">
            {service.icon}
          </div>
          <h4 className="text-xl font-bold mb-4 group-hover:text-white transition-colors">{service.title}</h4>
          <p className="text-muted-foreground text-sm leading-relaxed group-hover:text-white/70 transition-colors">
            {service.desc}
          </p>
          <div className="mt-8 pt-6 border-t border-muted group-hover:border-white/10">
            <button className="text-primary group-hover:text-accent font-bold text-xs tracking-widest flex items-center gap-2 uppercase transition-all">
              상담 문의 <span className="text-lg">→</span>
            </button>
          </div>
        </RevealItem>
      ))}
    </div>
  );
}
