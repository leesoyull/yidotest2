
'use client';

import { useState, useEffect, useMemo } from 'react';
import { db, storage } from '@/firebaseConfig';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Home/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Image as ImageIcon, MessageSquare, Trash2, Calendar, MapPin, User, Phone, Mail } from 'lucide-react';

interface Inquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  serviceType: string;
  content: string;
  createdAt: any;
}

export default function AdminPage() {
  const { toast } = useToast();
  // 로그인 보안용 상태
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 등록 폼 상태
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [year, setYear] = useState('2026');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 상담 내역 상태
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  // 상담 내역 실시간 리스너
  useEffect(() => {
    if (!isLoggedIn) return;
    const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Inquiry[];
      setInquiries(data);
    });
    return () => unsubscribe();
  }, [isLoggedIn]);

  // 로그인 체크
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'yido610' && password === 'yido610!') {
      setIsLoggedIn(true);
      toast({ title: "로그인 성공", description: "관리자 시스템에 접속했습니다." });
    } else {
      toast({ variant: "destructive", title: "로그인 실패", description: "아이디 또는 비밀번호가 잘못되었습니다." });
    }
  };

  // 이미지 선택 시 미리보기 생성
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 시공사례 등록
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !title || !category) return toast({ variant: "destructive", title: "입력 오류", description: "모든 항목을 입력해 주세요." });

    setLoading(true);
    try {
      // 1. 이미지 저장 (Firebase Storage)
      const storageRef = ref(storage, `projects/${Date.now()}_${image.name}`);
      await uploadBytes(storageRef, image);
      const imageUrl = await getDownloadURL(storageRef);

      // 2. Firestore 저장
      await addDoc(collection(db, 'projects'), {
        title,
        category,
        location,
        year: year.replace('년', ''),
        imageUrl,
        createdAt: serverTimestamp(),
      });

      toast({ title: "등록 완료", description: "새 시공 사례가 홈페이지에 반영되었습니다." });
      
      // 초기화
      setTitle('');
      setCategory('');
      setLocation('');
      setImage(null);
      setImagePreview(null);
      
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "업로드 실패", description: "시스템 오류가 발생했습니다." });
    } finally {
      setLoading(false);
    }
  };

  // 문의 내역 삭제
  const handleDeleteInquiry = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await deleteDoc(doc(db, 'inquiries', id));
      toast({ title: "삭제 완료", description: "상담 내역이 삭제되었습니다." });
    } catch (error) {
      toast({ variant: "destructive", title: "오류", description: "삭제 중 문제가 발생했습니다." });
    }
  };

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-muted/30 flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-2xl border-none">
          <CardHeader className="text-center space-y-2 pb-8">
            <CardTitle className="text-3xl font-black text-primary">이도건설 관리자</CardTitle>
            <CardDescription>시스템 접속을 위해 인증이 필요합니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="id">관리자 아이디</Label>
                <Input id="id" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="아이디 입력" className="h-12" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pw">비밀번호</Label>
                <Input id="pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호 입력" className="h-12" required />
              </div>
              <Button type="submit" className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 rounded-xl transition-all">
                로그인하기
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-muted/20">
      <Navbar />
      <div className="pt-32 pb-24 container mx-auto px-6">
        <div className="max-w-6xl mx-auto space-y-10">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-muted pb-8">
            <div>
              <h1 className="text-4xl font-black text-primary tracking-tight">관리자 대시보드</h1>
              <p className="text-muted-foreground mt-2 font-medium">이도건설의 모든 데이터와 현황을 한눈에 관리합니다.</p>
            </div>
            <div className="flex gap-2">
              <div className="bg-white px-4 py-2 rounded-xl border border-muted shadow-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-accent" />
                <span className="text-sm font-bold text-primary">미확인 문의: {inquiries.length}건</span>
              </div>
            </div>
          </header>

          <Tabs defaultValue="inquiries" className="space-y-8">
            <TabsList className="bg-white border p-1 rounded-2xl h-16 shadow-sm">
              <TabsTrigger value="inquiries" className="rounded-xl h-full px-8 text-base font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                <MessageSquare className="w-4 h-4 mr-2" />
                상담 문의 관리
              </TabsTrigger>
              <TabsTrigger value="projects" className="rounded-xl h-full px-8 text-base font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                <Plus className="w-4 h-4 mr-2" />
                새 시공사례 등록
              </TabsTrigger>
            </TabsList>

            <TabsContent value="inquiries" className="space-y-6">
              <div className="grid gap-4">
                {inquiries.length === 0 ? (
                  <div className="text-center py-32 bg-white rounded-[2rem] border-2 border-dashed">
                    <p className="text-muted-foreground font-bold">접수된 상담 문의가 아직 없습니다.</p>
                  </div>
                ) : (
                  inquiries.map((item) => (
                    <Card key={item.id} className="border-none shadow-sm hover:shadow-md transition-all rounded-2xl overflow-hidden">
                      <div className="p-8 grid md:grid-cols-4 gap-8">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-xs font-bold text-accent uppercase tracking-widest">
                            <Calendar className="w-3 h-3" />
                            {item.createdAt?.toDate().toLocaleDateString() || '방금 전'}
                          </div>
                          <div className="space-y-1">
                            <h3 className="text-xl font-black text-primary flex items-center gap-2">
                              <User className="w-4 h-4 text-muted-foreground" />
                              {item.name}
                            </h3>
                            <p className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                              <Phone className="w-3 h-3" />
                              {item.phone}
                            </p>
                            {item.email && (
                              <p className="text-xs text-muted-foreground flex items-center gap-2">
                                <Mail className="w-3 h-3" />
                                {item.email}
                              </p>
                            )}
                          </div>
                          <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-full">
                            {item.serviceType}
                          </div>
                        </div>
                        <div className="md:col-span-2 bg-muted/30 p-6 rounded-2xl">
                          <p className="text-sm text-primary leading-relaxed whitespace-pre-wrap font-medium">
                            {item.content}
                          </p>
                        </div>
                        <div className="flex items-center justify-end">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl w-12 h-12"
                            onClick={() => handleDeleteInquiry(item.id)}
                          >
                            <Trash2 className="w-6 h-6" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="projects">
              <div className="grid lg:grid-cols-2 gap-10">
                <Card className="border-none shadow-xl rounded-[2.5rem]">
                  <CardHeader className="p-10 pb-0">
                    <CardTitle className="text-2xl font-black text-primary">시공 사례 등록</CardTitle>
                    <CardDescription>홈페이지 시공 사례 섹션에 실시간으로 반영됩니다.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-10 space-y-8">
                    <form onSubmit={handleUpload} className="space-y-6">
                      <div className="space-y-4">
                        <Label className="text-sm font-bold text-primary pl-1">프로젝트 제목 *</Label>
                        <Input 
                          value={title} 
                          onChange={(e) => setTitle(e.target.value)} 
                          placeholder="예: 김포 한강신도시 아파트 외벽 균열 보수" 
                          className="h-12 rounded-xl"
                          required 
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <Label className="text-sm font-bold text-primary pl-1">카테고리 *</Label>
                          <Select onValueChange={setCategory} value={category}>
                            <SelectTrigger className="h-12 rounded-xl">
                              <SelectValue placeholder="카테고리 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="하자보수">하자보수</SelectItem>
                              <SelectItem value="방수">방수 공사</SelectItem>
                              <SelectItem value="도장">도장 공사</SelectItem>
                              <SelectItem value="기타">기타</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-4">
                          <Label className="text-sm font-bold text-primary pl-1">시공 연도 *</Label>
                          <Select onValueChange={setYear} value={year}>
                            <SelectTrigger className="h-12 rounded-xl">
                              <SelectValue placeholder="연도 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 11 }, (_, i) => 2025 + i).map(y => (
                                <SelectItem key={y} value={y.toString()}>{y}년</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Label className="text-sm font-bold text-primary pl-1">시공 위치/유형</Label>
                        <Input 
                          value={location} 
                          onChange={(e) => setLocation(e.target.value)} 
                          placeholder="예: 경기도 김포시 / 공동주택" 
                          className="h-12 rounded-xl"
                        />
                      </div>

                      <div className="space-y-4">
                        <Label className="text-sm font-bold text-primary pl-1">시공 사진 첨부 *</Label>
                        <div className="relative group">
                          <Input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageChange}
                            className="hidden" 
                            id="project-image"
                            required={!image}
                          />
                          <label 
                            htmlFor="project-image"
                            className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-muted rounded-2xl cursor-pointer bg-muted/10 group-hover:bg-muted/20 group-hover:border-accent transition-all overflow-hidden"
                          >
                            {imagePreview ? (
                              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                <ImageIcon className="w-8 h-8" />
                                <span className="text-sm font-bold">사진 클릭하여 업로드</span>
                              </div>
                            )}
                          </label>
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        disabled={loading}
                        className="w-full h-16 bg-accent hover:bg-accent/90 text-xl font-black rounded-2xl shadow-xl shadow-accent/20 mt-4 transition-all"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-3 w-6 h-6 animate-spin" />
                            업로드 중...
                          </>
                        ) : (
                          "시공 사례 등록하기"
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <div className="hidden lg:block">
                  <div className="sticky top-40 bg-primary p-12 rounded-[3rem] text-white space-y-8">
                    <h3 className="text-3xl font-black leading-tight">관리자님,<br/>반갑습니다.</h3>
                    <p className="text-white/70 font-medium leading-relaxed">
                      이곳에서 등록하시는 시공 사례는 홈페이지의 '시공사례' 메뉴에 즉시 자동으로 분류되어 나타납니다.
                      <br/><br/>
                      상담 문의 탭에서는 고객들이 남긴 소중한 정보를 실시간으로 확인하고 관리하실 수 있습니다.
                    </p>
                    <div className="pt-8 grid grid-cols-2 gap-4">
                      <div className="p-6 bg-white/10 rounded-3xl border border-white/10">
                        <div className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Total Inquiries</div>
                        <div className="text-3xl font-black">{inquiries.length}</div>
                      </div>
                      <div className="p-6 bg-white/10 rounded-3xl border border-white/10">
                        <div className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Latest Action</div>
                        <div className="text-sm font-black">Just Now</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </main>
  );
}
