
"use client"

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Home/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Send, Mail, MapPin, Loader2, CheckCircle2 } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

export default function InquiryPage() {
  const { toast } = useToast();
  const db = useFirestore();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    serviceType: '',
    content: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.serviceType || !formData.content) {
      toast({
        variant: "destructive",
        title: "입력 오류",
        description: "필수 항목(*)을 모두 입력해주세요.",
      });
      return;
    }

    setLoading(true);
    
    try {
      // 1. Firestore에 저장 (관리자 대시보드에서 즉시 확인 가능)
      const inquiriesRef = collection(db, 'inquiries');
      await addDoc(inquiriesRef, {
        ...formData,
        createdAt: serverTimestamp()
      });

      setSubmitted(true);
      toast({
        title: "접수 완료",
        description: "문의 내용이 성공적으로 전달되었습니다.",
      });
    } catch (err: any) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "접수 실패",
        description: "네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-muted/30">
        <Navbar />
        <div className="pt-40 pb-32 container mx-auto px-6 text-center">
          <div className="max-w-md mx-auto bg-white p-10 rounded-3xl shadow-xl space-y-6">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-green-600">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-black text-primary">접수되었습니다!</h2>
            <p className="text-muted-foreground leading-relaxed">
              보내주신 소중한 문의 내용이 성공적으로 접수되었습니다.<br/>
              확인 후 신속하게 연락드리겠습니다.
            </p>
            <Button asChild className="w-full h-14 text-lg font-bold rounded-xl" variant="default">
              <a href="/">홈으로 돌아가기</a>
            </Button>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-muted/30">
      <Navbar />
      <div className="pt-32 pb-16 container mx-auto px-6">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-10">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="font-headline text-4xl font-bold text-primary mb-3">상담 문의</h1>
              <p className="text-muted-foreground text-sm leading-relaxed">
                건물의 안전과 가치를 지키는 이도건설입니다. <br/>
                온라인 문의 시 담당자가 내용을 확인하여 신속하게 연락드리겠습니다.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm">
                <div className="bg-primary/10 p-3 rounded-xl text-primary">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-primary/50 uppercase tracking-wider mb-1">이메일 문의</h4>
                  <p className="text-primary font-bold">yido610@naver.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm">
                <div className="bg-primary/10 p-3 rounded-xl text-primary">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-primary/50 uppercase tracking-wider mb-1">방문 상담</h4>
                  <p className="text-primary font-bold">전국 현장 방문 가능</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="border-none shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-primary text-white p-8">
                <CardTitle className="text-2xl font-bold">견적 및 상담 신청</CardTitle>
                <CardDescription className="text-white/70">정확한 정보를 입력해주시면 더욱 빠른 상담이 가능합니다.</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-bold text-primary">성함/업체명 *</Label>
                      <Input 
                        id="name" 
                        placeholder="이름을 입력해 주세요" 
                        className="h-12 rounded-xl"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-bold text-primary">연락처 *</Label>
                      <Input 
                        id="phone" 
                        placeholder="010-0000-0000" 
                        className="h-12 rounded-xl"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-bold text-primary">이메일</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="example@email.com" 
                        className="h-12 rounded-xl"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="serviceType" className="text-sm font-bold text-primary">문의 분야 *</Label>
                      <Select 
                        onValueChange={(value) => setFormData({...formData, serviceType: value})}
                        value={formData.serviceType}
                      >
                        <SelectTrigger id="serviceType" className="h-12 rounded-xl">
                          <SelectValue placeholder="분야를 선택해 주세요" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="하자보수">건물 하자보수</SelectItem>
                          <SelectItem value="방수공사">방수 공사</SelectItem>
                          <SelectItem value="도장공사">도장 공사</SelectItem>
                          <SelectItem value="시설관리">시설물 유지관리</SelectItem>
                          <SelectItem value="기타">기타 문의</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content" className="text-sm font-bold text-primary">문의 내용 *</Label>
                    <Textarea 
                      id="content" 
                      placeholder="공사 내용, 지역, 건물 유형 등을 자세히 적어주시면 정확한 상담이 가능합니다." 
                      className="min-h-[180px] rounded-xl p-4"
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-14 bg-accent hover:bg-accent/90 text-lg font-black rounded-xl shadow-xl shadow-accent/20 transition-all active:scale-[0.98]"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                        상담 요청 전송 중...
                      </>
                    ) : (
                      <>
                        상담 신청하기
                        <Send className="ml-2 w-5 h-5" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
