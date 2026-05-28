
"use client"

import { useState, useEffect, useMemo, useRef } from 'react';
import { useFirestore, useCollection } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { collection, addDoc, deleteDoc, doc, serverTimestamp, query, Timestamp } from 'firebase/firestore';
import { Trash2, LayoutDashboard, Mail, Phone, Clock, User, ArrowLeft, Lock, ImageIcon, Upload, X, Loader2, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
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
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const years = Array.from({ length: 11 }, (_, i) => (2025 + i).toString());

  const [newPortfolio, setNewPortfolio] = useState({
    title: '',
    category: '',
    subText: '',
    year: '2025',
    imageUrl: ''
  });

  useEffect(() => {
    const savedLogin = sessionStorage.getItem('yido_admin_login');
    if (savedLogin === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  // 인덱스 오류를 피하기 위해 orderBy를 제거하고 메모리에서 정렬합니다.
  const inquiryQuery = useMemo(() => {
    if (!db) return null;
    return collection(db, 'inquiries');
  }, [db]);
  
  const { data: rawInquiries, loading: inquiriesLoading } = useCollection(inquiryQuery);
  const inquiries = useMemo(() => {
    if (!rawInquiries) return [];
    return [...rawInquiries].sort((a: any, b: any) => {
      const timeA = a.createdAt?.seconds || 0;
      const timeB = b.createdAt?.seconds || 0;
      return timeB - timeA;
    });
  }, [rawInquiries]);

  const portfolioQuery = useMemo(() => {
    if (!db) return null;
    return collection(db, 'portfolios');
  }, [db]);
  
  const { data: rawPortfolios } = useCollection(portfolioQuery);
  const portfolios = useMemo(() => {
    if (!rawPortfolios) return [];
    return [...rawPortfolios].sort((a: any, b: any) => {
      const timeA = a.createdAt?.seconds || 0;
      const timeB = b.createdAt?.seconds || 0;
      return timeB - timeA;
    });
  }, [rawPortfolios]);

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

  const resizeAndCompressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // 홈페이지 표시용으로 최적화된 800px로 리사이징 (Firestore 1MB 제한 대비)
          const MAX_SIZE = 800;
          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);
          }
          
          // 압축률을 0.5로 조정하여 용량 최적화 (Base64 증가분 고려)
          const dataUrl = canvas.toDataURL('image/jpeg', 0.5);
          resolve(dataUrl);
        };
        img.onerror = () => reject(new Error('이미지 로드 실패'));
      };
      reader.onerror = () => reject(new Error('파일 읽기 실패'));
    });
  };

  const processFile = async (file: File) => {
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({ variant: "destructive", title: "형식 오류", description: "이미지 파일만 업로드 가능합니다." });
        return;
      }

      setIsProcessingImage(true);
      try {
        const optimizedImage = await resizeAndCompressImage(file);
        setNewPortfolio(prev => ({ ...prev, imageUrl: optimizedImage }));
        toast({ title: "이미지 준비 완료", description: "사진이 홈페이지에 최적화되었습니다." });
      } catch (error) {
        console.error("Image processing error:", error);
        toast({ variant: "destructive", title: "오류 발생", description: "이미지 처리 중 문제가 발생했습니다." });
      } finally {
        setIsProcessingImage(false);
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleAddPortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPortfolio.title || !newPortfolio.category || !newPortfolio.imageUrl || !newPortfolio.year) {
      toast({ variant: "destructive", title: "입력 부족", description: "필수 항목(*)을 모두 채워주세요." });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const colRef = collection(db, 'portfolios');
      const data = { 
        ...newPortfolio, 
        createdAt: serverTimestamp() 
      };
      
      await addDoc(colRef, data);
      toast({ title: "등록 완료", description: "시공 사례가 홈페이지에 즉시 반영되었습니다." });
      setNewPortfolio({ title: '', category: '', subText: '', year: '2025', imageUrl: '' });
    } catch (err) {
      console.error("Firestore Save Error:", err);
      toast({ variant: "destructive", title: "저장 실패", description: "데이터베이스 연결 문제 또는 용량 오류입니다." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm('해당 문의 내역을 삭제하시겠습니까?')) return;
    try {
      await deleteDoc(doc(db, 'inquiries', id));
      toast({ title: "삭제 완료" });
    } catch (error) {
      toast({ variant: "destructive", title: "삭제 실패" });
    }
  };

  const handleDeletePortfolio = async (id: string) => {
    if (!confirm('해당 시공사례를 삭제하시겠습니까?')) return;
    try {
      await deleteDoc(doc(db, 'portfolios', id));
      toast({ title: "삭제 완료" });
    } catch (error) {
      toast({ variant: "destructive", title: "삭제 실패" });
    }
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
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10 h-10 rounded-xl font-black text-xs" onClick={() => handleDeleteInquiry(iq.id)}>
                          <Trash2 className="w-4 h-4 mr-2" /> 내역 삭제
                        </Button>
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
              </div>
            )}
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-10">
            <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
              <CardHeader className="bg-primary text-white p-10">
                <CardTitle className="text-2xl font-black">새 시공 사례 등록</CardTitle>
                <CardDescription className="text-white/60">사진을 드래그하거나 선택하세요. 자동으로 최적화되어 홈페이지에 즉시 연동됩니다.</CardDescription>
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
                        <Label className="font-bold text-primary">시공 연도 *</Label>
                        <Select value={newPortfolio.year} onValueChange={(value) => setNewPortfolio({...newPortfolio, year: value})}>
                          <SelectTrigger className="h-14 rounded-xl"><SelectValue placeholder="연도 선택" /></SelectTrigger>
                          <SelectContent>
                            {years.map(y => <SelectItem key={y} value={y}>{y}년</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="font-bold text-primary">위치/유형 (선택)</Label>
                      <Input placeholder="예: 공동주택 · 경기 시흥" className="h-14 rounded-xl" value={newPortfolio.subText} onChange={(e) => setNewPortfolio({...newPortfolio, subText: e.target.value})} />
                    </div>

                    <div className="space-y-2">
                      <Label className="font-bold text-primary">이미지 업로드 *</Label>
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files?.[0]; if(f) processFile(f); }}
                        className={`group cursor-pointer border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 transition-all ${
                          isDragging ? 'border-accent bg-accent/10' : 'border-muted hover:border-accent hover:bg-accent/5'
                        }`}
                      >
                        <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handleImageUpload} />
                        {isProcessingImage ? (
                          <>
                            <Loader2 className="w-8 h-8 text-accent animate-spin" />
                            <p className="text-sm font-bold text-accent">이미지 최적화 중...</p>
                          </>
                        ) : (
                          <>
                            <Upload className={`w-8 h-8 text-muted-foreground group-hover:text-accent`} />
                            <p className="text-sm font-bold text-muted-foreground group-hover:text-accent">클릭하거나 사진을 끌어오세요</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col justify-between gap-5">
                    <div className="flex-1 bg-muted/20 border rounded-3xl flex items-center justify-center relative overflow-hidden min-h-[350px]">
                      {newPortfolio.imageUrl ? (
                        <>
                          <Image src={newPortfolio.imageUrl} alt="Preview" fill className="object-cover" />
                          <Button 
                            type="button" 
                            variant="destructive" 
                            size="icon" 
                            className="absolute top-4 right-4 rounded-full w-10 h-10"
                            onClick={() => setNewPortfolio({...newPortfolio, imageUrl: ''})}
                          >
                            <X className="w-5 h-5" />
                          </Button>
                        </>
                      ) : (
                        <div className="text-center space-y-2">
                          <ImageIcon className="w-16 h-16 text-muted/20 mx-auto" />
                          <p className="text-xs text-muted-foreground font-bold">미리보기</p>
                        </div>
                      )}
                    </div>
                    <Button type="submit" className="h-16 text-xl font-black rounded-2xl shadow-xl bg-accent hover:bg-accent/90" disabled={isSubmitting || isProcessingImage}>
                      {isSubmitting ? "저장 중..." : "시공 사례 등록"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolios?.map((item: any) => (
                <Card key={item.id} className="overflow-hidden border-none shadow-xl rounded-3xl bg-white group">
                  <div className="relative h-60">
                    <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                      <Button variant="destructive" size="icon" className="rounded-full w-16 h-16" onClick={() => handleDeletePortfolio(item.id)}>
                        <Trash2 className="w-7 h-7" />
                      </Button>
                    </div>
                    <div className="absolute top-4 left-4 bg-primary/90 text-white text-[10px] font-black px-3 py-1 rounded-full">
                      {item.year}년
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
