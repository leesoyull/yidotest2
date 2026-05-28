
"use client"

import { useState, useEffect, useMemo, useRef } from 'react';
import { useFirestore, useCollection } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { collection, addDoc, deleteDoc, doc, serverTimestamp, query, orderBy, Timestamp } from 'firebase/firestore';
import { Trash2, LayoutDashboard, Mail, Phone, Clock, User, ArrowLeft, Lock, ImageIcon, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import Image from 'next/image';
import Link from 'next/link';

export default function AdminPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminId, setAdminId] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
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

  const inquiryQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
  }, [db]);
  
  const { data: inquiries, loading: inquiriesLoading } = useCollection(inquiryQuery);

  const portfolioQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'portfolios'), orderBy('createdAt', 'desc'));
  }, [db]);
  
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

  const processFile = (file: File) => {
    if (file) {
      if (file.size > 800 * 1024) { 
        toast({ variant: "destructive", title: "용량 초과", description: "800KB 이하의 이미지만 업로드 가능합니다." });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPortfolio({ ...newPortfolio, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleAddPortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPortfolio.title || !newPortfolio.category || !newPortfolio.imageUrl) {
      toast({ variant: "destructive", title: "입력 부족", description: "필수 항목(제목, 카테고리, 이미지)을 입력해 주세요." });
      return;
    }
    setIsSubmitting(true);
    const colRef = collection(db, 'portfolios');
    const data = { ...newPortfolio, createdAt: serverTimestamp() };
    
    addDoc(colRef, data)
      .then(() => {
        toast({ title: "시공사례 등록 완료", description: "홈페이지에 즉시 반영되었습니다." });
        setNewPortfolio({ title: '', category: '', subText: '', imageUrl: '' });
      })
      .catch(async () => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: colRef.path,
          operation: 'create',
          requestResourceData: data
        }));
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleDeleteInquiry = (id: string) => {
    if (!confirm('해당 문의 내역을 삭제하시겠습니까? (삭제 시 복구가 불가능합니다)')) return;
    const docRef = doc(db, 'inquiries', id);
    deleteDoc(docRef).catch(() => {});
    toast({ title: "삭제 완료" });
  };

  const handleDeletePortfolio = (id: string) => {
    if (!confirm('해당 시공사례를 삭제하시겠습니까?')) return;
    const docRef = doc(db, 'portfolios', id);
    deleteDoc(docRef).catch(() => {});
    toast({ title: "삭제 완료" });
  };

  const formatTimestamp = (ts: any) => {
    if (!ts) return '방금 전';
    if (ts instanceof Timestamp) return ts.toDate().toLocaleString('ko-KR');
    if (ts.toDate) return ts.toDate().toLocaleString('ko-KR');
    return new Date(ts).toLocaleString('ko-KR');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-6">
        <Card className="max-w-md w-full shadow-2xl border-none rounded-[2.5rem] overflow-hidden">
          <CardHeader className="text-center space-y-4 pt-12">
            <div className="bg-primary/10 w-20 h-20 rounded-[2rem] flex items-center justify-center text-primary mx-auto mb-2">
              <Lock className="w-10 h-10" />
            </div>
            <CardTitle className="text-3xl font-black text-primary">Admin Login</CardTitle>
            <CardDescription className="text-base font-medium">관리자 계정 정보를 입력하세요.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pb-12 px-10">
            <form onSubmit={handleManualLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="adminId">ID</Label>
                <Input id="adminId" value={adminId} onChange={(e) => setAdminId(e.target.value)} placeholder="yido610" className="h-14 rounded-2xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminPassword">Password</Label>
                <Input id="adminPassword" type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} placeholder="••••••••" className="h-14 rounded-2xl" />
              </div>
              <Button type="submit" className="w-full h-16 text-xl font-black rounded-2xl shadow-xl mt-4">로그인하기</Button>
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
              <h1 className="text-3xl font-black text-primary uppercase tracking-tight">Admin Console</h1>
              <p className="text-sm text-muted-foreground font-bold flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                실시간 데이터 동기화 활성화
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout} className="rounded-xl font-bold border-muted-foreground/20">로그아웃</Button>
        </div>

        <Tabs defaultValue="inquiries" className="w-full">
          <TabsList className="bg-white rounded-2xl shadow-sm border mb-10 h-16 p-2 flex w-full sm:w-fit gap-2">
            <TabsTrigger value="inquiries" className="rounded-xl px-10 flex-1 font-black text-base data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
              상담 문의 ({inquiries?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="rounded-xl px-10 flex-1 font-black text-base data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
              시공 사례 관리 ({portfolios?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inquiries" className="space-y-6">
            {inquiriesLoading ? (
              <div className="text-center py-32 flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                <p className="text-muted-foreground font-bold">내역을 불러오고 있습니다...</p>
              </div>
            ) : inquiries && inquiries.length > 0 ? (
              <div className="grid gap-6">
                {inquiries.map((iq: any) => (
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
                            {formatTimestamp(iq.createdAt)}
                          </div>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10 h-10 rounded-xl font-black text-xs" onClick={() => handleDeleteInquiry(iq.id)}>
                            <Trash2 className="w-4 h-4 mr-2" /> 내역 삭제
                          </Button>
                        </div>
                      </div>
                      <div className="bg-muted/30 p-8 rounded-2xl border border-muted/50">
                        <p className="text-lg leading-relaxed whitespace-pre-line text-primary/80 font-semibold italic">"{iq.content}"</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[2.5rem] p-32 text-center border-2 border-dashed border-muted">
                <div className="bg-muted/50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Mail className="w-10 h-10 text-muted-foreground/20" />
                </div>
                <h3 className="text-2xl font-black text-primary mb-3">접수된 상담 문의가 없습니다.</h3>
                <p className="text-muted-foreground font-medium">상담 신청 내용은 영구히 보관됩니다.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-10">
            <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
              <CardHeader className="bg-primary text-white p-10">
                <CardTitle className="text-2xl font-black">새 시공 사례 등록</CardTitle>
                <CardDescription className="text-white/60">사진을 드래그하거나 선택하여 업로드하세요. 홈페이지에 즉시 반영됩니다.</CardDescription>
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
                      <Label className="font-bold text-primary">이미지 업로드 *</Label>
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                        className={`group cursor-pointer border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 transition-all ${
                          isDragging ? 'border-accent bg-accent/10' : 'border-muted hover:border-accent hover:bg-accent/5'
                        }`}
                      >
                        <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handleImageUpload} />
                        <Upload className={`w-8 h-8 transition-all ${isDragging ? 'text-accent scale-110' : 'text-muted-foreground group-hover:text-accent group-hover:scale-110'}`} />
                        <p className={`text-sm font-bold transition-all ${isDragging ? 'text-accent' : 'text-muted-foreground group-hover:text-accent'}`}>
                          {isDragging ? "여기에 놓으세요!" : "사진을 끌어오거나 클릭하세요"}
                        </p>
                        <p className="text-[10px] text-muted-foreground/50">800KB 이하의 이미지만 권장합니다.</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between gap-5">
                    <div className="flex-1 bg-muted/20 border rounded-3xl flex items-center justify-center relative overflow-hidden min-h-[300px] border-muted">
                      {newPortfolio.imageUrl ? (
                        <>
                          <Image src={newPortfolio.imageUrl} alt="Preview" fill className="object-cover" />
                          <Button 
                            type="button" 
                            variant="destructive" 
                            size="icon" 
                            className="absolute top-4 right-4 rounded-full w-10 h-10 shadow-lg"
                            onClick={() => setNewPortfolio({...newPortfolio, imageUrl: ''})}
                          >
                            <X className="w-5 h-5" />
                          </Button>
                        </>
                      ) : (
                        <div className="text-center space-y-2">
                          <ImageIcon className="w-16 h-16 text-muted/20 mx-auto" />
                          <p className="text-xs text-muted-foreground font-bold">이미지 미리보기</p>
                        </div>
                      )}
                    </div>
                    <Button type="submit" className="h-16 text-xl font-black rounded-2xl shadow-xl bg-accent hover:bg-accent/90" disabled={isSubmitting}>
                      {isSubmitting ? "처리 중..." : "새 시공 사례 등록"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolios?.map((item: any) => (
                <Card key={item.id} className="overflow-hidden border-none shadow-xl rounded-3xl bg-white group animate-in fade-in zoom-in duration-300">
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
