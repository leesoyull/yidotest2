
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
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 필수 항목 유효성 검사
    if (!formData.name || !formData.phone || !formData.serviceType || !formData.content) {
      toast({
        variant: "destructive",
        title: "입력 오류",
        description: "필수 항목(*)을 모두 입력해주세요.",
      });
      return;
    }

    setLoading(true);
    
    const inquiriesRef = collection(db, 'inquiries');
    const dataToSave = {
      ...formData,
      createdAt: serverTimestamp()
    };

    // Firestore 저장 (await 하지 않음 - 즉각적인 UI 반응을 위해)
    addDoc(inquiriesRef, dataToSave)
      .catch(async (err) => {
        const permissionError = new FirestorePermissionError({
          path: inquiriesRef.path,
          operation: 'create',
          requestResourceData: dataToSave,
        });
        errorEmitter.emit('permission-error', permissionError);
      });

    // 즉시 완료 상태로 전환 (낙관적 업데이트)
    setSubmitted(true);
    setLoading(false);
    
    toast({
      title: "상담 신청 완료",
      description: "담당자가 확인 후 신속하게 연락드리겠습니다.",
    });
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-muted/30">
        <Navbar />
        <div className="pt-48 pb-32 container mx-auto px-6 text-center">
          <div className="max-w-md mx-auto bg-white p-12 rounded-[2.5rem] shadow-2xl space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto text-green-600 shadow-inner">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-black text-primary">신청이 완료되었습니다!</h2>
              <p className="text-muted-foreground leading-relaxed font-medium">
                보내주신 상담 문의가 성공적으로 접수되었습니다.<br/>
                기재하신 연락처로 신속하게 연락드리겠습니다.
              </p>
            </div>
            <Button asChild className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg" variant="default">
              <a href="/">메인으로 돌아가기</a>
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
      <div className="pt-40 pb-20 container mx-auto px-6">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-12">
          <div className="space-y-10">
            <div className="space-y-6">
              <h1 className="font-headline text-5xl font-bold text-primary tracking-tight">상담 문의</h1>
              <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                건물의 안전과 가치를 지키는 이도건설입니다. <br/>
                온라인으로 문의를 남겨주시면 담당자가 현장 상황을 검토하여 가장 적합한 보수 방안을 제안해 드립니다.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-5 bg-white rounded-2xl shadow-sm border border-muted">
                <div className="bg-primary/10 p-3.5 rounded-xl text-primary">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-primary/40 uppercase tracking-widest mb-1">이메일 문의</h4>
                  <p className="text-primary font-black text-lg">yido610@naver.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-5 bg-white rounded-2xl shadow-sm border border-muted">
                <div className="bg-primary/10 p-3.5 rounded-xl text-primary">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-primary/40 uppercase tracking-widest mb-1">상담 지원</h4>
                  <p className="text-primary font-black text-lg">전국 현장 방문 가능</p>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2">
            <Card className="border-none shadow-2xl rounded-[2rem] overflow-hidden">
              <CardHeader className="bg-primary text-white p-10">
                <CardTitle className="text-2xl font-bold">견적 및 상담 신청</CardTitle>
                <CardDescription className="text-white/70 text-base">내용을 자세히 적어주시면 더욱 정확한 가견적이 가능합니다.</CardDescription>
              </CardHeader>
              <CardContent className="p-10">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="name" className="text-sm font-bold text-primary pl-1">성함/업체명 *</Label>
                      <Input 
                        id="name" 
                        placeholder="이름을 입력해 주세요" 
                        className="h-14 rounded-xl border-muted bg-muted/20 focus:bg-white transition-all"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="phone" className="text-sm font-bold text-primary pl-1">연락처 *</Label>
                      <Input 
                        id="phone" 
                        placeholder="010-0000-0000" 
                        className="h-14 rounded-xl border-muted bg-muted/20 focus:bg-white transition-all"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-sm font-bold text-primary pl-1">이메일</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="example@email.com" 
                        className="h-14 rounded-xl border-muted bg-muted/20 focus:bg-white transition-all"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="serviceType" className="text-sm font-bold text-primary pl-1">문의 분야 *</Label>
                      <Select 
                        onValueChange={(value) => setFormData({...formData, serviceType: value})}
                        value={formData.serviceType}
                      >
                        <SelectTrigger id="serviceType" className="h-14 rounded-xl border-muted bg-muted/20 focus:bg-white transition-all">
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
                  <div className="space-y-3">
                    <Label htmlFor="content" className="text-sm font-bold text-primary pl-1">문의 내용 *</Label>
                    <Textarea 
                      id="content" 
                      placeholder="공사 희망 내용, 지역, 건물 유형 등을 기재해 주세요." 
                      className="min-h-[200px] rounded-2xl p-5 border-muted bg-muted/20 focus:bg-white transition-all resize-none"
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-16 bg-accent hover:bg-accent/90 text-xl font-black rounded-2xl shadow-xl shadow-accent/20 transition-all active:scale-[0.98] mt-4"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-3 w-6 h-6 animate-spin" />
                        처리 중입니다...
                      </>
                    ) : (
                      <>
                        상담 신청하기
                        <Send className="ml-3 w-6 h-6" />
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
