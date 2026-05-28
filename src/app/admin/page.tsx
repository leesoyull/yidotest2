
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
import { Trash2, LayoutDashboard, Mail, Phone, Clock, User, ArrowLeft, Lock, ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import Image from 'next/image';
import Link from 'next/link';

export default function AdminPage() {
  const db = useFirestore();
  const { toast } = useToast();
  
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

  useEffect(() => {
    const savedLogin = sessionStorage.getItem('yido_admin_login');
    if (savedLogin === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const inquiryQuery = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
  const { data: inquiries, loading: inquiriesLoading } = useCollection(inquiryQuery);

  const portfolioQuery = query(collection(db, 'portfolios'), orderBy('createdAt', 'desc'));
  const { data: portfolios } = useCollection(portfolioQuery);

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminId === 'yido610' && adminPassword === 'yido610!') {
      setIsLoggedIn(true);
      sessionStorage.setItem('yido_admin_login', 'true');
      toast({ title: "로그인 성공", description: "이도건설 관리자 모드입니다." });
    } else {
      toast({ 
        variant: "destructive", 
        title: "로그인 실패", 
        description: "아이디 또는 비밀번호를 확인해 주세요." 
      });
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('yido_admin_login');
    toast({ title: "로그아웃 완료" });
  };

  const handleDeleteInquiry = (id: string) => {
    if (!confirm('해당 문의 내역을 삭제하시겠습니까?')) return;
    const docRef = doc(db, 'inquiries', id);
    deleteDoc(docRef)
      .catch(async () => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: docRef.path,
          operation: 'delete'
        }));
      });
    toast({ title: "삭제 요청됨" });
  };

  const handleAddPortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPortfolio.title || !newPortfolio.category || !newPortfolio.imageUrl) {
      toast({ variant: "destructive", title: "입력 부족", description: "필수 항목을 입력해 주세요." });
      return;
    }
    setIsSubmitting(true);
    const colRef = collection(db, 'portfolios');
    const data = { ...newPortfolio, createdAt: serverTimestamp() };
    
    addDoc(colRef, data)
      .catch(async () => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: colRef.path,
          operation: 'create',
          requestResourceData: data
        }));
      });
    
    toast({ title: "시공사례 등록 완료" });
    setNewPortfolio({ title: '', category: '', subText: '', imageUrl: '' });
    setIsSubmitting(false);
  };

  const handleDeletePortfolio = (id: string) => {
    if (!confirm('삭제하시겠습니까?')) return;
    const docRef = doc(db, 'portfolios', id);
    deleteDoc(docRef)
      .catch(async () => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: docRef.path,
          operation: 'delete'
        }));
      });
    toast({ title: "삭제 완료" });
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-6">
        <Card className="max-w-md w-full shadow-2xl border-none rounded-[2.5rem] overflow-hidden">
          <CardHeader className="text-center space-y-4 pt-12">
            <div className="bg-primary/10 w-20 h-20 rounded-[2rem] flex items-center justify-center text-primary mx-auto mb-2">
              <Lock className="w-10 h-10" />
            </div>
            <CardTitle className="text-3xl font-black">Admin Access</CardTitle>
            <CardDescription className="text-base font-medium">관리자 계정 정보를 입력하세요.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pb-12 px-10">
            <form onSubmit={handleManualLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="adminId">ID</Label>
                <Input 
                  id="adminId" 
                  value={adminId} 
                  onChange={(e) => setAdminId(e.target.value)}
                  placeholder="yido610"
                  className="h-14 rounded-2xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminPassword">Password</Label>
                <Input 
                  id="adminPassword" 
                  type="password"
                  value={adminPassword} 
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-14 rounded-2xl"
                />
              </div>
              <Button type="submit" className="w-full h-16 text-xl font-black rounded-2xl shadow-xl mt-4">
                LOGIN
              </Button>
            </form>
            <Button asChild variant="ghost" className="w-full text-muted-foreground hover:bg-transparent">
              <Link href="/"><ArrowLeft className="w-4 h-4 mr-2" /> 홈페이지로 돌아가기</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-5">
            <div className="bg-primary p-4 rounded-2xl text-white shadow-xl shadow-primary/20">
              <LayoutDashboard className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-primary uppercase tracking-tight">Dashboard</h1>
              <p className="text-sm text-muted-foreground font-bold flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                관리자 모드 활성화됨
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout} className="rounded-xl font-bold border-muted-foreground/20">
            로그아웃
          </Button>
        </div>

        <Tabs defaultValue="inquiries" className="w-full">
          <TabsList className="bg-white rounded-2xl shadow-sm border mb-10 h-14 p-1.5 inline-flex w-full sm:w-auto">
            <TabsTrigger value="inquiries" className="rounded-xl px-10 font-black text-base data-[state=active]:bg-primary data-[state=active]:text-white">
              상담문의 내역 ({inquiries?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="rounded-xl px-10 font-black text-base data-[state=active]:bg-primary data-[state=active]:text-white">
              시공사례 관리
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inquiries" className="space-y-6">
            <div className="grid gap-6">
              {inquiriesLoading ? (
                <div className="text-center py-32 flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                  <p className="text-muted-foreground font-bold">내역을 불러오고 있습니다...</p>
                </div>
              ) : inquiries && inquiries.length > 0 ? (
                inquiries.map((iq) => (
                  <Card key={iq.id} className="border-none shadow-xl rounded-3xl overflow-hidden hover:translate-y-[-4px] transition-all duration-300">
                    <div className="p-8">
                      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
                        <div className="flex items-center gap-5">
                          <div className="bg-primary/5 w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-primary border border-primary/10">
                            <User className="w-8 h-8" />
                          </div>
                          <div>
                            <div className="flex items-center gap-3">
                              <h3 className="text-2xl font-black text-primary">{iq.name}</h3>
                              <span className="bg-accent/10 text-accent text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-tighter">
                                {iq.serviceType}
                              </span>
                            </div>
                            <div className="flex items-center gap-5 mt-2 text-sm font-bold text-muted-foreground/70">
                              <span className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-accent" /> {iq.phone}</span>
                              {iq.email && <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-accent" /> {iq.email}</span>}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                          <div className="flex items-center gap-2 text-xs font-black text-muted-foreground/50 bg-muted/50 px-4 py-2 rounded-full">
                            <Clock className="w-4 h-4" />
                            {iq.createdAt?.toDate?.()?.toLocaleString('ko-KR') || '접수 시간 정보 없음'}
                          </div>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10 h-10 rounded-xl font-black text-xs" onClick={() => handleDeleteInquiry(iq.id)}>
                            <Trash2 className="w-4 h-4 mr-2" /> 내역 삭제
                          </Button>
                        </div>
                      </div>
                      <div className="bg-muted/30 p-8 rounded-2xl border border-muted/50 relative">
                        <p className="text-lg leading-relaxed whitespace-pre-line text-primary/80 font-semibold italic">
                          "{iq.content}"
                        </p>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="bg-white rounded-[2.5rem] p-32 text-center border-2 border-dashed border-muted">
                  <div className="bg-muted/50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Mail className="w-10 h-10 text-muted-foreground/20" />
                  </div>
                  <h3 className="text-2xl font-black text-primary mb-3">접수된 상담 문의가 없습니다.</h3>
                  <p className="text-muted-foreground font-medium">고객이 상담 신청을 완료하면 이곳에 실시간으로 표시됩니다.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-10">
            <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
              <CardHeader className="bg-primary text-white p-10">
                <CardTitle className="text-2xl font-black">시공 사례 등록</CardTitle>
                <CardDescription className="text-white/60">포트폴리오 페이지에 노출될 새로운 실적을 추가합니다.</CardDescription>
              </CardHeader>
              <CardContent className="p-10">
                <form onSubmit={handleAddPortfolio} className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label className="font-bold text-primary">시공 제목 *</Label>
                      <Input placeholder="예: 시흥시 아파트 옥상 방수 공사" className="h-14 rounded-xl" value={newPortfolio.title} onChange={(e) => setNewPortfolio({...newPortfolio, title: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label className="font-bold text-primary">카테고리 *</Label>
                        <Select value={newPortfolio.category} onValueChange={(value) => setNewPortfolio({...newPortfolio, category: value})}>
                          <SelectTrigger className="h-14 rounded-xl"><SelectValue placeholder="선택" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="하자보수">하자보수</SelectItem>
                            <SelectItem value="방수">방수</SelectItem>
                            <SelectItem value="도장">도장</SelectItem>
                            <SelectItem value="기타">기타</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold text-primary">위치/유형</Label>
                        <Input placeholder="예: 공동주택 · 경기 시흥" className="h-14 rounded-xl" value={newPortfolio.subText} onChange={(e) => setNewPortfolio({...newPortfolio, subText: e.target.value})} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold text-primary">이미지 URL *</Label>
                      <Input placeholder="https://..." className="h-14 rounded-xl" value={newPortfolio.imageUrl} onChange={(e) => setNewPortfolio({...newPortfolio, imageUrl: e.target.value})} />
                    </div>
                  </div>
                  <div className="flex flex-col justify-between gap-5">
                    <div className="flex-1 bg-muted/20 border-2 border-dashed rounded-3xl flex items-center justify-center relative overflow-hidden min-h-[200px]">
                      {newPortfolio.imageUrl ? (
                        <Image src={newPortfolio.imageUrl} alt="Preview" fill className="object-cover" />
                      ) : (
                        <div className="text-center space-y-2">
                          <ImageIcon className="w-16 h-16 text-muted/20 mx-auto" />
                          <p className="text-xs text-muted-foreground font-bold">이미지 미리보기</p>
                        </div>
                      )}
                    </div>
                    <Button type="submit" className="h-16 text-xl font-black rounded-2xl shadow-xl" disabled={isSubmitting}>
                      {isSubmitting ? "등록 중..." : "실적 등록 완료"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolios?.map((item) => (
                <Card key={item.id} className="overflow-hidden border-none shadow-xl rounded-3xl bg-white group">
                  <div className="relative h-60">
                    <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-sm">
                      <Button variant="destructive" size="icon" className="rounded-full w-16 h-16 shadow-2xl" onClick={() => handleDeletePortfolio(item.id)}>
                        <Trash2 className="w-7 h-7" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <span className="text-accent text-[10px] font-black uppercase mb-1 block">{item.category}</span>
                    <h4 className="font-black text-primary text-xl truncate">{item.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1 font-bold">{item.subText}</p>
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
