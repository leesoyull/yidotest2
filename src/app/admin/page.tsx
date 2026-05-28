
"use client"

import { useState, useEffect } from 'react';
import { useAuth, useUser, useFirestore, useCollection } from '@/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { collection, addDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { Trash2, Plus, LogOut, LayoutDashboard, Image as ImageIcon, ExternalLink } from 'lucide-react';
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
  const { data: inquiries } = useCollection(query(collection(db, 'inquiries'), orderBy('createdAt', 'desc')));

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    // 팝업 차단 방지를 위해 직접 실행
    try {
      await signInWithPopup(auth, provider);
      toast({ title: "로그인 성공", description: "관리자 모드로 전환되었습니다." });
    } catch (error: any) {
      console.error(error);
      toast({ 
        variant: "destructive", 
        title: "로그인 실패", 
        description: "Firebase 콘솔에서 Google 로그인을 활성화했는지 확인해주세요." 
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
      toast({ title: "등록 완료", description: "새 시공사례가 성공적으로 등록되었습니다." });
      setNewPortfolio({ title: '', category: '', subText: '', imageUrl: '' });
    } catch (error) {
      toast({ variant: "destructive", title: "오류", description: "데이터 등록에 실패했습니다." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePortfolio = async (id: string) => {
    if (!confirm('이 시공사례를 삭제하시겠습니까? 홈페이지에서도 즉시 삭제됩니다.')) return;
    try {
      await deleteDoc(doc(db, 'portfolios', id));
      toast({ title: "삭제 완료", description: "포트폴리오가 삭제되었습니다." });
    } catch (error) {
      toast({ variant: "destructive", title: "오류", description: "삭제에 실패했습니다." });
    }
  };

  if (userLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 font-body">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground">관리자 권한 확인 중...</p>
      </div>
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-6 font-body">
        <Card className="max-w-md w-full shadow-2xl border-none">
          <CardHeader className="text-center space-y-2">
            <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <LayoutDashboard className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-black text-primary">이도건설 관리자</CardTitle>
            <CardDescription>시공사례 관리 및 문의 확인을 위해 로그인하세요.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleLogin} className="w-full h-14 text-lg font-bold gap-3 rounded-xl shadow-lg shadow-primary/20">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              구글로 계속하기
            </Button>
            <div className="mt-8 pt-6 border-t text-center">
              <Link href="/" className="text-sm text-muted-foreground hover:text-primary flex items-center justify-center gap-1">
                <ExternalLink className="w-3 h-3" /> 홈페이지로 돌아가기
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 p-6 md:p-12 font-body">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-primary p-3 rounded-2xl text-white shadow-lg shadow-primary/20">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-primary">ADMIN DASHBOARD</h1>
              <p className="text-sm text-muted-foreground">{user.email} 계정으로 접속 중</p>
            </div>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="gap-2 text-muted-foreground hover:text-destructive">
            <LogOut className="w-4 h-4" /> 로그아웃
          </Button>
        </div>

        <Tabs defaultValue="portfolio" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md bg-white p-1 rounded-xl shadow-sm border mb-8">
            <TabsTrigger value="portfolio" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white transition-all">시공사례 관리</TabsTrigger>
            <TabsTrigger value="inquiries" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white transition-all">상담문의 내역</TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="border-none shadow-xl overflow-hidden rounded-2xl">
              <CardHeader className="bg-primary text-white">
                <CardTitle className="text-xl">새 시공사례 등록</CardTitle>
                <CardDescription className="text-white/70">홈페이지 메인 및 시공사례 페이지에 즉시 노출됩니다.</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleAddPortfolio} className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="font-bold">시공 제목 *</Label>
                      <Input 
                        id="title" 
                        placeholder="예: 강남구 OO아파트 옥상 방수 공사" 
                        className="h-12 border-muted"
                        value={newPortfolio.title}
                        onChange={(e) => setNewPortfolio({...newPortfolio, title: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category" className="font-bold">카테고리 *</Label>
                        <Select 
                          value={newPortfolio.category}
                          onValueChange={(value) => setNewPortfolio({...newPortfolio, category: value})}
                        >
                          <SelectTrigger className="h-12 border-muted">
                            <SelectValue placeholder="선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="하자보수">하자보수</SelectItem>
                            <SelectItem value="방수">방수</SelectItem>
                            <SelectItem value="도장">도장</SelectItem>
                            <SelectItem value="기타">기타</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subText" className="font-bold">위치/유형</Label>
                        <Input 
                          id="subText" 
                          placeholder="예: 경기 · 공동주택" 
                          className="h-12 border-muted"
                          value={newPortfolio.subText}
                          onChange={(e) => setNewPortfolio({...newPortfolio, subText: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="imageUrl" className="font-bold">이미지 URL *</Label>
                      <Input 
                        id="imageUrl" 
                        placeholder="https://..." 
                        className="h-12 border-muted"
                        value={newPortfolio.imageUrl}
                        onChange={(e) => setNewPortfolio({...newPortfolio, imageUrl: e.target.value})}
                      />
                      <p className="text-[10px] text-muted-foreground">unsplash 또는 picsum 등의 이미지 주소를 입력하세요.</p>
                    </div>
                  </div>
                  <div className="space-y-4 flex flex-col justify-between">
                    <div className="flex-1 min-h-[200px] border-2 border-dashed border-muted rounded-2xl flex items-center justify-center relative overflow-hidden bg-muted/20">
                      {newPortfolio.imageUrl ? (
                        <Image src={newPortfolio.imageUrl} alt="Preview" fill className="object-cover" />
                      ) : (
                        <div className="text-center text-muted-foreground p-4">
                          <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                          <p className="text-sm font-medium">이미지 미리보기</p>
                          <p className="text-xs opacity-50">URL을 입력하면 여기에 나타납니다.</p>
                        </div>
                      )}
                    </div>
                    <Button type="submit" className="w-full h-14 text-lg font-bold gap-2 rounded-xl" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          처리 중...
                        </div>
                      ) : (
                        <>
                          <Plus className="w-5 h-5" /> 시공사례 등록하기
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolios?.map((item) => (
                <Card key={item.id} className="overflow-hidden group border-none shadow-lg rounded-2xl bg-white transition-all hover:-translate-y-1">
                  <div className="relative h-56">
                    <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        className="rounded-full h-12 w-12"
                        onClick={() => handleDeletePortfolio(item.id)}
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                    <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full">
                      {item.category}
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h4 className="font-bold text-primary text-lg truncate mb-1">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.subText}</p>
                    <div className="mt-4 pt-4 border-t text-[10px] text-muted-foreground">
                      등록일: {item.createdAt?.toDate?.()?.toLocaleDateString() || '-'}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {(!portfolios || portfolios.length === 0) && (
                <div className="col-span-full py-20 text-center bg-white rounded-2xl border-2 border-dashed border-muted">
                   <p className="text-muted-foreground">등록된 시공사례가 없습니다.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="inquiries" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="bg-primary text-white">
                <CardTitle className="text-xl">고객 상담문의 내역</CardTitle>
                <CardDescription className="text-white/70">홈페이지를 통해 접수된 실시간 문의 목록입니다.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {inquiries?.map((iq) => (
                    <div key={iq.id} className="p-6 bg-white border rounded-2xl hover:border-primary/30 transition-all shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                          <div className="bg-accent/10 p-3 rounded-xl">
                            <span className="font-black text-accent text-xl">{iq.name?.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-black text-lg text-primary">{iq.name}</span>
                              <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
                                {iq.serviceType}
                              </span>
                            </div>
                            <span className="text-sm font-medium text-muted-foreground">{iq.phone}</span>
                          </div>
                        </div>
                        <div className="text-right">
                           <span className="text-[10px] text-muted-foreground block mb-1">접수 일시</span>
                           <span className="text-xs font-bold text-primary">
                             {iq.createdAt?.toDate?.()?.toLocaleString('ko-KR') || '-'}
                           </span>
                        </div>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-xl mb-4">
                        <p className="text-sm text-primary/80 leading-relaxed whitespace-pre-line font-medium">
                          {iq.content}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground border-t pt-4">
                        <span className="flex items-center gap-1"><ExternalLink className="w-3 h-3" /> {iq.email || '이메일 미입력'}</span>
                      </div>
                    </div>
                  ))}
                  {(!inquiries || inquiries.length === 0) && (
                    <div className="text-center py-20 text-muted-foreground bg-muted/20 rounded-2xl border-2 border-dashed border-muted">
                      접수된 상담 문의가 아직 없습니다.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
