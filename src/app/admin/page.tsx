
"use client"

import { useState, useEffect } from 'react';
import { useFirestore, useCollection } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { collection, addDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { Trash2, Plus, LogOut, LayoutDashboard, Image as ImageIcon, Mail, Phone, Clock, User, ArrowLeft, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import Link from 'next/link';

export default function AdminPage() {
  const db = useFirestore();
  const { toast } = useToast();
  
  // 로그인 상태 관리
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminId, setAdminId] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newPortfolio, setNewPortfolio] = useState({
    title: '',
    category: '',
    subText: '',
    imageUrl: ''
  });

  // 세션 유지를 위해 로컬 스토리지 확인
  useEffect(() => {
    const savedLogin = sessionStorage.getItem('yido_admin_login');
    if (savedLogin === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  // 실시간 데이터 바인딩
  const portfolioQuery = query(collection(db, 'portfolios'), orderBy('createdAt', 'desc'));
  const { data: portfolios } = useCollection(portfolioQuery);
  
  const inquiryQuery = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
  const { data: inquiries, loading: inquiriesLoading } = useCollection(inquiryQuery);

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminId === 'yido610' && adminPassword === 'yido610!') {
      setIsLoggedIn(true);
      sessionStorage.setItem('yido_admin_login', 'true');
      toast({ title: "로그인 성공", description: "관리자 모드로 접속되었습니다." });
    } else {
      toast({ 
        variant: "destructive", 
        title: "로그인 실패", 
        description: "아이디 또는 비밀번호가 일치하지 않습니다." 
      });
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('yido_admin_login');
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

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-6">
        <Card className="max-w-md w-full shadow-2xl border-none rounded-3xl overflow-hidden">
          <CardHeader className="text-center space-y-4 pt-10">
            <div className="bg-primary/10 w-16 h-16 rounded-3xl flex items-center justify-center text-primary mx-auto mb-2">
              <Lock className="w-8 h-8" />
            </div>
            <CardTitle className="text-2xl font-black">이도건설 관리자</CardTitle>
            <CardDescription>아이디와 비밀번호를 입력해 주세요.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pb-10">
            <form onSubmit={handleManualLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adminId">아이디</Label>
                <Input 
                  id="adminId" 
                  value={adminId} 
                  onChange={(e) => setAdminId(e.target.value)}
                  placeholder="아이디 입력"
                  className="h-12 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminPassword">비밀번호</Label>
                <Input 
                  id="adminPassword" 
                  type="password"
                  value={adminPassword} 
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="비밀번호 입력"
                  className="h-12 rounded-xl"
                />
              </div>
              <Button type="submit" className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg shadow-primary/20 mt-4">
                관리자 로그인
              </Button>
            </form>
            <Button asChild variant="ghost" className="w-full text-muted-foreground">
              <Link href="/"><ArrowLeft className="w-4 h-4 mr-2" /> 홈페이지로 돌아가기</Link>
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
            <div className="bg-primary p-3 rounded-2xl text-white shadow-lg shadow-primary/20">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-primary uppercase tracking-tight">Management</h1>
              <p className="text-xs text-muted-foreground font-medium">관리자 계정 접속 중</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild variant="outline" size="sm" className="hidden sm:flex rounded-xl">
              <Link href="/">홈페이지 보기</Link>
            </Button>
            <Button variant="destructive" size="sm" onClick={handleLogout} className="gap-2 rounded-xl">
              <LogOut className="w-4 h-4" /> 로그아웃
            </Button>
          </div>
        </div>

        <Tabs defaultValue="inquiries" className="w-full">
          <TabsList className="inline-flex w-full sm:w-auto bg-white rounded-xl shadow-sm border mb-8 h-12 p-1">
            <TabsTrigger value="inquiries" className="rounded-lg px-8 font-bold">상담문의 내역 ({inquiries?.length || 0})</TabsTrigger>
            <TabsTrigger value="portfolio" className="rounded-lg px-8 font-bold">시공사례 관리</TabsTrigger>
          </TabsList>

          <TabsContent value="inquiries" className="space-y-6">
            <div className="grid gap-6">
              {inquiriesLoading ? (
                <div className="text-center py-20 flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="text-muted-foreground font-medium">내역을 불러오는 중입니다...</p>
                </div>
              ) : inquiries && inquiries.length > 0 ? (
                inquiries.map((iq) => (
                  <Card key={iq.id} className="border-none shadow-xl rounded-2xl overflow-hidden hover:scale-[1.01] transition-transform">
                    <div className="p-6 md:p-8">
                      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                        <div className="flex items-center gap-4">
                          <div className="bg-primary/10 w-14 h-14 rounded-2xl flex items-center justify-center text-primary">
                            <User className="w-7 h-7" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-xl font-black text-primary">{iq.name}</h3>
                              <span className="bg-accent/10 text-accent text-[11px] font-bold px-3 py-1 rounded-full uppercase">
                                {iq.serviceType}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-sm font-medium text-muted-foreground">
                              <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {iq.phone}</span>
                              {iq.email && <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {iq.email}</span>}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
                            <Clock className="w-3.5 h-3.5" />
                            {iq.createdAt?.toDate?.()?.toLocaleString('ko-KR') || '시간 정보 없음'}
                          </div>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10 h-9 rounded-xl font-bold" onClick={() => handleDeleteInquiry(iq.id)}>
                            <Trash2 className="w-4 h-4 mr-1.5" /> 삭제하기
                          </Button>
                        </div>
                      </div>
                      
                      <div className="bg-muted/30 p-6 rounded-2xl border border-muted/50">
                        <p className="text-base leading-relaxed whitespace-pre-line text-primary/80 font-medium">
                          {iq.content}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="bg-white rounded-3xl p-24 text-center border-2 border-dashed border-muted">
                  <div className="bg-muted/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mail className="w-8 h-8 text-muted-foreground/30" />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-2">접수된 문의 내역이 없습니다.</h3>
                  <p className="text-muted-foreground">고객이 상담 문의를 남기면 이곳에 실시간으로 표시됩니다.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-8">
            <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="bg-primary text-white p-8">
                <CardTitle className="text-xl font-bold">새 시공사례 등록</CardTitle>
                <CardDescription className="text-white/70">웹사이트의 '시공사례' 페이지에 노출될 내용을 추가합니다.</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleAddPortfolio} className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="font-bold text-primary">시공 제목 *</Label>
                      <Input id="title" placeholder="예: 시흥시 아파트 옥상 방수 공사" className="h-12 rounded-xl" value={newPortfolio.title} onChange={(e) => setNewPortfolio({...newPortfolio, title: e.target.value})} />
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
                        <Input id="subText" placeholder="예: 공동주택 · 경기 시흥" className="h-12 rounded-xl" value={newPortfolio.subText} onChange={(e) => setNewPortfolio({...newPortfolio, subText: e.target.value})} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="imageUrl" className="font-bold text-primary">이미지 URL *</Label>
                      <Input id="imageUrl" placeholder="https://..." className="h-12 rounded-xl" value={newPortfolio.imageUrl} onChange={(e) => setNewPortfolio({...newPortfolio, imageUrl: e.target.value})} />
                    </div>
                  </div>
                  <div className="flex flex-col justify-between gap-4">
                    <div className="flex-1 bg-muted/20 border-2 border-dashed rounded-2xl flex items-center justify-center relative overflow-hidden min-h-[200px]">
                      {newPortfolio.imageUrl ? (
                        <Image src={newPortfolio.imageUrl} alt="Preview" fill className="object-cover" />
                      ) : (
                        <div className="text-center space-y-2">
                          <ImageIcon className="w-12 h-12 text-muted/30 mx-auto" />
                          <p className="text-xs text-muted-foreground">이미지 미리보기</p>
                        </div>
                      )}
                    </div>
                    <Button type="submit" className="h-14 text-lg font-bold rounded-xl shadow-lg" disabled={isSubmitting}>
                      {isSubmitting ? "등록 중..." : "시공사례 등록 완료"}
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
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-sm">
                      <Button variant="destructive" size="icon" className="rounded-full w-14 h-14 shadow-2xl" onClick={() => handleDeletePortfolio(item.id)}>
                        <Trash2 className="w-6 h-6" />
                      </Button>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary/90 text-white text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-md">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h4 className="font-bold text-primary text-lg truncate mb-1">{item.title}</h4>
                    <p className="text-xs text-muted-foreground font-medium">{item.subText}</p>
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
