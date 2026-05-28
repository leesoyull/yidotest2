
"use client"

import { useState } from 'react';
import { useAuth, useUser } from '@/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { collection, addDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { useFirestore, useCollection } from '@/firebase';
import { Trash2, Plus, LogOut, LayoutDashboard, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

export default function AdminPage() {
  const auth = useAuth();
  const db = useFirestore();
  const { user, loading: userLoading } = useUser();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [newPortfolio, setNewPortfolio] = useState({
    title: '',
    category: '',
    subText: '',
    imageUrl: ''
  });

  const portfolioQuery = query(collection(db, 'portfolios'), orderBy('createdAt', 'desc'));
  const { data: portfolios } = useCollection(portfolioQuery);
  const { data: inquiries } = useCollection(query(collection(db, 'inquiries'), orderBy('createdAt', 'desc')));

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => signOut(auth);

  const handleAddPortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPortfolio.title || !newPortfolio.category || !newPortfolio.imageUrl) {
      toast({ variant: "destructive", title: "입력 오류", description: "필수 항목을 입력해주세요." });
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'portfolios'), {
        ...newPortfolio,
        createdAt: serverTimestamp()
      });
      toast({ title: "등록 완료", description: "새 포트폴리오가 등록되었습니다." });
      setNewPortfolio({ title: '', category: '', subText: '', imageUrl: '' });
    } catch (error) {
      toast({ variant: "destructive", title: "오류", description: "등록에 실패했습니다." });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePortfolio = async (id: string) => {
    if (!confirm('정말로 삭제하시겠습니까?')) return;
    try {
      await deleteDoc(doc(db, 'portfolios', id));
      toast({ title: "삭제 완료", description: "포트폴리오가 삭제되었습니다." });
    } catch (error) {
      toast({ variant: "destructive", title: "오류", description: "삭제에 실패했습니다." });
    }
  };

  if (userLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!user) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-6">
        <Card className="max-w-md w-full text-center p-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">이도건설 관리자</CardTitle>
            <CardDescription>관리자 계정으로 로그인해주세요.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleLogin} className="w-full h-12">구글로 로그인하기</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg text-white">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold text-primary">관리자 대시보드</h1>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" /> 로그아웃
          </Button>
        </div>

        <Tabs defaultValue="portfolio" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mb-8">
            <TabsTrigger value="portfolio">시공사례 관리</TabsTrigger>
            <TabsTrigger value="inquiries">상담문의 목록</TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio" className="space-y-8">
            {/* Add Portfolio Form */}
            <Card>
              <CardHeader>
                <CardTitle>새 시공사례 등록</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddPortfolio} className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">제목 *</Label>
                      <Input 
                        id="title" 
                        placeholder="예: 아파트 외벽 균열 보수" 
                        value={newPortfolio.title}
                        onChange={(e) => setNewPortfolio({...newPortfolio, title: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">카테고리 *</Label>
                      <Select 
                        value={newPortfolio.category}
                        onValueChange={(value) => setNewPortfolio({...newPortfolio, category: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="카테고리 선택" />
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
                      <Label htmlFor="subText">소제목 (위치/건물유형)</Label>
                      <Input 
                        id="subText" 
                        placeholder="예: 공동주택 · 경기도" 
                        value={newPortfolio.subText}
                        onChange={(e) => setNewPortfolio({...newPortfolio, subText: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="imageUrl">이미지 URL *</Label>
                      <Input 
                        id="imageUrl" 
                        placeholder="https://..." 
                        value={newPortfolio.imageUrl}
                        onChange={(e) => setNewPortfolio({...newPortfolio, imageUrl: e.target.value})}
                      />
                    </div>
                    <div className="h-40 border-2 border-dashed rounded-xl flex items-center justify-center relative overflow-hidden bg-muted/50">
                      {newPortfolio.imageUrl ? (
                        <Image src={newPortfolio.imageUrl} alt="Preview" fill className="object-cover" />
                      ) : (
                        <div className="text-center text-muted-foreground">
                          <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-20" />
                          <p className="text-xs">이미지 미리보기</p>
                        </div>
                      )}
                    </div>
                    <Button type="submit" className="w-full gap-2" disabled={loading}>
                      <Plus className="w-4 h-4" /> {loading ? "등록 중..." : "포트폴리오 등록"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Portfolio List */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolios?.map((item) => (
                <Card key={item.id} className="overflow-hidden group">
                  <div className="relative h-48">
                    <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDeletePortfolio(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <CardContent className="p-4">
                    <div className="text-xs font-bold text-accent mb-1">{item.category}</div>
                    <h4 className="font-bold truncate">{item.title}</h4>
                    <p className="text-xs text-muted-foreground">{item.subText}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="inquiries">
            <Card>
              <CardHeader>
                <CardTitle>상담문의 관리</CardTitle>
                <CardDescription>홈페이지를 통해 접수된 문의 목록입니다.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inquiries?.map((iq) => (
                    <div key={iq.id} className="p-4 border rounded-xl hover:bg-muted/50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-bold text-lg mr-3">{iq.name}</span>
                          <span className="text-sm text-muted-foreground">{iq.phone}</span>
                        </div>
                        <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {iq.serviceType}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 whitespace-pre-line">{iq.content}</p>
                      <div className="text-[10px] text-muted-foreground flex justify-between items-center">
                        <span>{iq.email}</span>
                        <span>{iq.createdAt?.toDate?.()?.toLocaleString() || '날짜 미상'}</span>
                      </div>
                    </div>
                  ))}
                  {(!inquiries || inquiries.length === 0) && (
                    <div className="text-center py-12 text-muted-foreground">접수된 문의가 없습니다.</div>
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
