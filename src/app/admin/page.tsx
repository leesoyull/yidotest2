
"use client"

import { useState } from 'react';
import { useAuth, useUser, useFirestore, useCollection } from '@/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { collection, addDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { Trash2, Plus, LogOut, LayoutDashboard, Image as ImageIcon, ExternalLink, Mail, Phone, Clock, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import Link from 'next/link';

export default function AdminPage() {
  const auth = useAuth();
  const db = useFirestore();
  const { user, loading: userLoading } = useUser();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newPortfolio, setNewPortfolio] = useState({
    title: '',
    category: '',
    subText: '',
    imageUrl: ''
  });

  // 실시간 데이터 바인딩
  const portfolioQuery = query(collection(db, 'portfolios'), orderBy('createdAt', 'desc'));
  const { data: portfolios } = useCollection(portfolioQuery);
  
  const inquiryQuery = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
  const { data: inquiries, loading: inquiriesLoading } = useCollection(inquiryQuery);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({ title: "로그인 성공", description: "관리자 모드로 전환되었습니다." });
    } catch (error: any) {
      console.error(error);
      toast({ 
        variant: "destructive", 
        title: "로그인 실패", 
        description: "Google 로그인을 사용할 수 없습니다." 
      });
    }
  };

  const handleLogout = () => {
    signOut(auth);
    toast({ title: "로그아웃", description: "안전하게 로그아웃되었습니다." });
  };

  const handleAddPortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPortfolio.title || !newPortfolio.category || !newPortfolio.imageUrl) {
      toast({ variant: "destructive", title: "입력 오류", description: "필수 항목(*)을 입력해주세요." });
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'portfolios'), {
        ...newPortfolio,
        createdAt: serverTimestamp()
      });
      toast({ title: "등록 완료", description: "새 시공사례가 등록되었습니다." });
      setNewPortfolio({ title: '', category: '', subText: '', imageUrl: '' });
    } catch (error) {
      toast({ variant: "destructive", title: "오류", description: "등록에 실패했습니다." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePortfolio = async (id: string) => {
    if (!confirm('삭제하시겠습니까?')) return;
    try {
      await deleteDoc(doc(db, 'portfolios', id));
      toast({ title: "삭제 완료" });
    } catch (error) {
      toast({ variant: "destructive", title: "오류" });
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm('문의 내역을 삭제하시겠습니까?')) return;
    try {
      await deleteDoc(doc(db, 'inquiries', id));
      toast({ title: "문의 삭제 완료" });
    } catch (error) {
      toast({ variant: "destructive", title: "오류" });
    }
  };

  if (userLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-6">
        <Card className="max-w-md w-full shadow-2xl border-none">
          <CardHeader className="text-center space-y-2">
            <LayoutDashboard className="w-12 h-12 text-primary mx-auto mb-2" />
            <CardTitle className="text-2xl font-black">이도건설 관리자</CardTitle>
            <CardDescription>관리자 계정으로 로그인해 주세요.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleLogin} className="w-full h-12 text-lg font-bold rounded-xl">
              구글 로그인
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-primary p-3 rounded-2xl text-white">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-primary uppercase">Management</h1>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2 rounded-xl">
            <LogOut className="w-4 h-4" /> 로그아웃
          </Button>
        </div>

        <Tabs defaultValue="inquiries" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md bg-white rounded-xl shadow-sm border mb-8 h-12 p-1">
            <TabsTrigger value="inquiries" className="rounded-lg">상담문의 내역</TabsTrigger>
            <TabsTrigger value="portfolio" className="rounded-lg">시공사례 관리</TabsTrigger>
          </TabsList>

          <TabsContent value="inquiries" className="space-y-6">
            <div className="grid gap-6">
              {inquiriesLoading ? (
                <div className="text-center py-20">로딩 중...</div>
              ) : inquiries && inquiries.length > 0 ? (
                inquiries.map((iq) => (
                  <Card key={iq.id} className="border-none shadow-lg rounded-2xl overflow-hidden">
                    <div className="p-6 md:p-8">
                      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                        <div className="flex items-center gap-4">
                          <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center text-primary">
                            <User className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-xl font-black text-primary">{iq.name}</h3>
                              <span className="bg-accent/10 text-accent text-[10px] font-bold px-2 py-0.5 rounded-full">
                                {iq.serviceType}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {iq.phone}</span>
                              {iq.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {iq.email}</span>}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {iq.createdAt?.toDate?.()?.toLocaleString('ko-KR') || '시간 정보 없음'}
                          </div>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 rounded-lg" onClick={() => handleDeleteInquiry(iq.id)}>
                            <Trash2 className="w-4 h-4 mr-1" /> 삭제
                          </Button>
                        </div>
                      </div>
                      
                      <div className="bg-muted/50 p-6 rounded-2xl border border-muted">
                        <p className="text-sm leading-relaxed whitespace-pre-line text-primary/80 font-medium">
                          {iq.content}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="bg-white rounded-3xl p-20 text-center text-muted-foreground border border-dashed">
                  접수된 문의 내역이 없습니다.
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-8">
            <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="bg-primary text-white p-8">
                <CardTitle className="text-xl font-bold">새 시공사례 등록</CardTitle>
                <CardDescription className="text-white/70">웹사이트에 노출될 시공 사례를 추가합니다.</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleAddPortfolio} className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="font-bold text-primary">시공 제목 *</Label>
                      <Input id="title" className="h-12 rounded-xl" value={newPortfolio.title} onChange={(e) => setNewPortfolio({...newPortfolio, title: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="font-bold text-primary">카테고리 *</Label>
                        <Select value={newPortfolio.category} onValueChange={(value) => setNewPortfolio({...newPortfolio, category: value})}>
                          <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="선택" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="하자보수">하자보수</SelectItem>
                            <SelectItem value="방수">방수</SelectItem>
                            <SelectItem value="도장">도장</SelectItem>
                            <SelectItem value="기타">기타</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subText" className="font-bold text-primary">위치/유형</Label>
                        <Input id="subText" className="h-12 rounded-xl" value={newPortfolio.subText} onChange={(e) => setNewPortfolio({...newPortfolio, subText: e.target.value})} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="imageUrl" className="font-bold text-primary">이미지 URL *</Label>
                      <Input id="imageUrl" className="h-12 rounded-xl" value={newPortfolio.imageUrl} onChange={(e) => setNewPortfolio({...newPortfolio, imageUrl: e.target.value})} />
                    </div>
                  </div>
                  <div className="flex flex-col justify-between gap-4">
                    <div className="flex-1 bg-muted/20 border-2 border-dashed rounded-2xl flex items-center justify-center relative overflow-hidden min-h-[200px]">
                      {newPortfolio.imageUrl ? (
                        <Image src={newPortfolio.imageUrl} alt="Preview" fill className="object-cover" />
                      ) : (
                        <ImageIcon className="w-12 h-12 text-muted/30" />
                      )}
                    </div>
                    <Button type="submit" className="h-14 text-lg font-bold rounded-xl" disabled={isSubmitting}>
                      {isSubmitting ? "등록 중..." : "시공사례 등록"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolios?.map((item) => (
                <Card key={item.id} className="overflow-hidden border-none shadow-lg rounded-2xl bg-white group">
                  <div className="relative h-56">
                    <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                      <Button variant="destructive" size="icon" className="rounded-full w-12 h-12" onClick={() => handleDeletePortfolio(item.id)}>
                        <Trash2 className="w-6 h-6" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h4 className="font-bold text-primary truncate">{item.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{item.subText}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
