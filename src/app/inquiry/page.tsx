
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
import { Send, Mail, MapPin } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function InquiryPage() {
  const { toast } = useToast();
  const db = useFirestore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    serviceType: '',
    content: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
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
    const inquiriesRef = collection(db, 'inquiries');
    const data = {
      ...formData,
      createdAt: serverTimestamp()
    };

    addDoc(inquiriesRef, data)
      .then(() => {
        toast({
          title: "문의 접수 완료",
          description: "정성껏 검토 후 신속하게 연락드리겠습니다.",
        });
        setFormData({
          name: '',
          phone: '',
          email: '',
          serviceType: '',
          content: ''
        });
        setLoading(false);
      })
      .catch(async (err) => {
        const permissionError = new FirestorePermissionError({
          path: inquiriesRef.path,
          operation: 'create',
          requestResourceData: data,
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({
          variant: "destructive",
          title: "접수 실패",
          description: "잠시 후 다시 시도해주세요.",
        });
        setLoading(false);
      });
  };

  return (
    <main className="min-h-screen bg-muted/30">
      <Navbar />
      <div className="pt-24 pb-16 container mx-auto px-6">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-10">
          {/* Contact Info */}
          <div className="space-y-6">
            <div>
              <h1 className="font-headline text-3xl font-bold text-primary mb-3">문의하기</h1>
              <p className="text-muted-foreground text-sm leading-relaxed">
                건물의 안전과 가치를 지키는 이도건설입니다.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-lg text-primary">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider">이메일</h4>
                  <p className="text-muted-foreground text-sm">yido610@naver.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-lg text-primary">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider">방문 지역</h4>
                  <p className="text-muted-foreground text-sm">전국 현장 방문 가능</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="border-none shadow-xl rounded-2xl">
              <CardHeader className="bg-primary text-white rounded-t-2xl py-6">
                <CardTitle className="text-xl">견적 및 상담 신청</CardTitle>
                <CardDescription className="text-white/70 text-xs">정확한 정보를 입력해주시면 신속한 대응이 가능합니다.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="text-xs font-bold">성함/업체명 *</Label>
                      <Input 
                        id="name" 
                        placeholder="홍길동" 
                        className="h-11"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="phone" className="text-xs font-bold">연락처 *</Label>
                      <Input 
                        id="phone" 
                        placeholder="010-0000-0000" 
                        className="h-11"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-xs font-bold">이메일</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="example@email.com" 
                        className="h-11"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="serviceType" className="text-xs font-bold">문의 분야 *</Label>
                      <Select 
                        onValueChange={(value) => setFormData({...formData, serviceType: value})}
                        value={formData.serviceType}
                      >
                        <SelectTrigger id="serviceType" className="h-11">
                          <SelectValue placeholder="분야 선택" />
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

                  <div className="space-y-1.5">
                    <Label htmlFor="content" className="text-xs font-bold">문의 내용 *</Label>
                    <Textarea 
                      id="content" 
                      placeholder="공사 내용, 지역, 건물 유형 등을 자세히 적어주세요." 
                      className="min-h-[150px] text-sm"
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-accent hover:bg-accent/90 text-base font-bold rounded-xl shadow-lg shadow-accent/20"
                    disabled={loading}
                  >
                    {loading ? "전송 중..." : "문의 신청하기"}
                    {!loading && <Send className="ml-2 w-4 h-4" />}
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
