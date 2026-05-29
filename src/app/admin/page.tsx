
'use client';

import { useState, useEffect } from 'react';
import { useFirestore, useAuth } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, onSnapshot, deleteDoc, doc, updateDoc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Home/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Loader2, Plus, Image as ImageIcon, MessageSquare, Trash2, Calendar, MapPin, User, Phone, LayoutGrid, Edit, BarChart3, X } from 'lucide-react';

interface Inquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  serviceType: string;
  content: string;
  createdAt: any;
}

interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  imageUrl: string;
  location?: string;
  storagePath?: string;
  createdAt: any;
}

interface YearlyStat {
  year: string;
  count: number;
}

export default function AdminPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // 등록 폼 상태
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [year, setYear] = useState('2026');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 수정용 상태
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editYear, setEditYear] = useState('');
  const [editLocation, setEditLocation] = useState('');

  // 실적 통계 상태
  const [yearlyStats, setYearlyStats] = useState<YearlyStat[]>([]);
  const [newStatYear, setNewStatYear] = useState('');
  const [newStatCount, setNewStatCount] = useState('');
  const [statsLoading, setStatsLoading] = useState(false);

  // 실시간 데이터 상태
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (!isLoggedIn) return;

    // 문의 내역 리스너
    const unsubscribeInquiries = onSnapshot(collection(db, 'inquiries'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Inquiry[];
      setInquiries(data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
    });

    // 프로젝트 리스너
    const unsubscribeProjects = onSnapshot(collection(db, 'projects'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Project[];
      setProjects(data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
    });

    // 실적 통계 리스너
    const unsubscribeStats = onSnapshot(doc(db, 'siteSettings', 'stats'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const statsMap = data.yearlyStats || {};
        const sortedStats = Object.entries(statsMap)
          .map(([year, count]) => ({ year, count: Number(count) }))
          .sort((a, b) => b.year.localeCompare(a.year));
        setYearlyStats(sortedStats);
      }
    });

    return () => {
      unsubscribeInquiries();
      unsubscribeProjects();
      unsubscribeStats();
    };
  }, [isLoggedIn, db]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'yido610' && password === 'yido610!') {
      setIsLoggedIn(true);
      toast({ title: "로그인 성공" });
    } else {
      toast({ variant: "destructive", title: "로그인 실패" });
    }
  };

  const resizeImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const max_size = 600;

          if (width > height) {
            if (width > max_size) {
              height *= max_size / width;
              width = max_size;
            }
          } else {
            if (height > max_size) {
              width *= max_size / height;
              height = max_size;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.5));
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const resized = await resizeImage(file);
      setImagePreview(resized);
      setImage(file);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview || !title || !category) return toast({ variant: "destructive", title: "필수 항목을 입력하세요" });

    setLoading(true);
    try {
      await addDoc(collection(db, 'projects'), {
        title,
        category,
        location,
        year: year.replace('년', ''),
        imageUrl: imagePreview,
        createdAt: serverTimestamp(),
      });

      toast({ title: "시공 사례가 등록되었습니다." });
      setTitle(''); setCategory(''); setLocation(''); setImage(null); setImagePreview(null);
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "등록 실패" });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProject = async () => {
    if (!editingProject) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, 'projects', editingProject.id), {
        title: editTitle,
        category: editCategory,
        year: editYear,
        location: editLocation,
      });
      toast({ title: "수정되었습니다." });
      setEditingProject(null);
    } catch (error) {
      toast({ variant: "destructive", title: "수정 실패" });
    } finally {
      setLoading(false);
    }
  };

  const handleAddYearlyStat = async () => {
    if (!newStatYear || !newStatCount) return;
    setStatsLoading(true);
    try {
      const updatedStats = { ...Object.fromEntries(yearlyStats.map(s => [s.year, s.count])), [newStatYear]: Number(newStatCount) };
      await setDoc(doc(db, 'siteSettings', 'stats'), {
        yearlyStats: updatedStats,
        updatedAt: serverTimestamp()
      }, { merge: true });
      setNewStatYear('');
      setNewStatCount('');
      toast({ title: "실적 데이터가 업데이트되었습니다." });
    } catch (error) {
      toast({ variant: "destructive", title: "업데이트 실패" });
    } finally {
      setStatsLoading(false);
    }
  };

  const handleRemoveYearlyStat = async (yearToRemove: string) => {
    if (!confirm(`${yearToRemove}년 실적을 삭제하시겠습니까?`)) return;
    setStatsLoading(true);
    try {
      const updatedStats = Object.fromEntries(yearlyStats.filter(s => s.year !== yearToRemove).map(s => [s.year, s.count]));
      await setDoc(doc(db, 'siteSettings', 'stats'), {
        yearlyStats: updatedStats,
        updatedAt: serverTimestamp()
      });
      toast({ title: "삭제되었습니다." });
    } catch (error) {
      toast({ variant: "destructive", title: "삭제 실패" });
    } finally {
      setStatsLoading(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await deleteDoc(doc(db, 'projects', id));
      toast({ title: "삭제 완료" });
    } catch (error) {
      toast({ variant: "destructive", title: "삭제 실패" });
    }
  };

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-muted/30 flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-2xl border-none">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-black text-primary">이도건설 관리자</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label>관리자 아이디</Label>
                <Input value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>비밀번호</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full h-14 text-lg font-bold bg-primary">로그인</Button>
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
          <header className="border-b border-muted pb-8 flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-black text-primary tracking-tight">통합 관리 대시보드</h1>
              <p className="text-muted-foreground mt-2 font-medium">홈페이지의 모든 실적과 문의를 실시간으로 관리합니다.</p>
            </div>
            <Button variant="outline" onClick={() => setIsLoggedIn(false)}>로그아웃</Button>
          </header>

          <Tabs defaultValue="inquiries" className="space-y-8">
            <TabsList className="bg-white border p-1 rounded-2xl h-16 shadow-sm overflow-x-auto inline-flex w-full">
              <TabsTrigger value="inquiries" className="rounded-xl flex-1 h-full font-bold">상담 문의 ({inquiries.length})</TabsTrigger>
              <TabsTrigger value="upload" className="rounded-xl flex-1 h-full font-bold">새 시공사례 등록</TabsTrigger>
              <TabsTrigger value="projects" className="rounded-xl flex-1 h-full font-bold">시공 사례 관리 ({projects.length})</TabsTrigger>
              <TabsTrigger value="stats" className="rounded-xl flex-1 h-full font-bold">실적 수치 관리</TabsTrigger>
            </TabsList>

            <TabsContent value="inquiries" className="space-y-6">
              <div className="grid gap-4">
                {inquiries.length === 0 ? (
                  <div className="text-center py-20 text-muted-foreground font-medium bg-white rounded-2xl border-2 border-dashed">접수된 상담 문의가 없습니다.</div>
                ) : (
                  inquiries.map((item) => (
                    <Card key={item.id} className="border-none shadow-sm rounded-2xl p-8 hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row justify-between gap-6">
                        <div className="space-y-2 min-w-[200px]">
                          <div className="flex items-center gap-2 text-xs font-bold text-accent uppercase tracking-widest">
                            <Calendar className="w-3 h-3" />
                            {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString() : '방금 전'}
                          </div>
                          <h3 className="text-xl font-black text-primary flex items-center gap-2"><User className="w-4 h-4" />{item.name}</h3>
                          <p className="text-sm font-bold text-muted-foreground"><Phone className="w-3 h-3 inline mr-1" />{item.phone}</p>
                          <p className="text-xs text-muted-foreground">{item.email}</p>
                        </div>
                        <div className="flex-1 bg-muted/30 p-6 rounded-2xl italic font-medium relative">
                          <div className="text-xs font-bold text-primary mb-2">[{item.serviceType}]</div>
                          "{item.content}"
                        </div>
                        <Button variant="ghost" className="text-red-400 self-start" onClick={() => deleteDoc(doc(db, 'inquiries', item.id))}>
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="upload">
              <Card className="border-none shadow-xl rounded-[2.5rem] p-10 max-w-2xl mx-auto">
                <form onSubmit={handleUpload} className="space-y-6">
                  <div className="space-y-2">
                    <Label className="font-bold text-primary">프로젝트 제목 *</Label>
                    <Input placeholder="예: 판교 아파트 옥상 방수 공사" value={title} onChange={(e) => setTitle(e.target.value)} required className="h-14" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="font-bold text-primary">카테고리 *</Label>
                      <Select onValueChange={setCategory} value={category}>
                        <SelectTrigger className="h-14"><SelectValue placeholder="선택" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="하자보수">하자보수</SelectItem>
                          <SelectItem value="방수">방수 공사</SelectItem>
                          <SelectItem value="도장">도장 공사</SelectItem>
                          <SelectItem value="기타">기타</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold text-primary">시공 연도 *</Label>
                      <Select onValueChange={setYear} value={year}>
                        <SelectTrigger className="h-14"><SelectValue placeholder="선택" /></SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 11 }, (_, i) => 2025 + i).map(y => (
                            <SelectItem key={y} value={y.toString()}>{y}년</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-primary">시공 위치/유형</Label>
                    <Input placeholder="예: 경기도 성남시 분당구" value={location} onChange={(e) => setLocation(e.target.value)} className="h-14" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-primary">사진 첨부 *</Label>
                    <Input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="file-up" />
                    <label htmlFor="file-up" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl cursor-pointer bg-muted/10 overflow-hidden hover:bg-muted/20 transition-all">
                      {imagePreview ? (
                        <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <ImageIcon className="w-12 h-12 text-muted-foreground" />
                          <p className="text-sm font-bold text-muted-foreground">클릭하여 사진 업로드</p>
                        </div>
                      )}
                    </label>
                  </div>
                  <Button type="submit" disabled={loading} className="w-full h-16 bg-accent text-xl font-black shadow-lg shadow-accent/20">
                    {loading ? <Loader2 className="animate-spin" /> : "시공 사례 등록하기"}
                  </Button>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="projects">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((item) => (
                  <Card key={item.id} className="overflow-hidden group rounded-2xl shadow-sm hover:shadow-lg transition-all border-none">
                    <div className="relative h-56">
                      <img src={item.imageUrl} className="w-full h-full object-cover" alt={item.title} />
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="icon" variant="secondary" className="h-9 w-9 shadow-md" onClick={() => {
                          setEditingProject(item);
                          setEditTitle(item.title);
                          setEditCategory(item.category);
                          setEditYear(item.year);
                          setEditLocation(item.location || '');
                        }}><Edit className="w-4 h-4" /></Button>
                        <Button size="icon" variant="destructive" className="h-9 w-9 shadow-md" onClick={() => handleDeleteProject(item.id)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                      <div className="absolute bottom-2 left-2 flex gap-1">
                        <span className="px-3 py-1 bg-primary/90 backdrop-blur-sm text-white text-[10px] font-bold rounded-full">{item.category}</span>
                        <span className="px-3 py-1 bg-accent/90 backdrop-blur-sm text-white text-[10px] font-bold rounded-full">{item.year}년</span>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h4 className="text-lg font-black text-primary line-clamp-1">{item.title}</h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-2"><MapPin className="w-3 h-3" />{item.location || '위치 미지정'}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="stats">
              <div className="grid lg:grid-cols-2 gap-8">
                <Card className="p-10 rounded-[2.5rem] shadow-xl border-none">
                  <CardHeader className="p-0 mb-8">
                    <div className="bg-accent/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                      <Plus className="w-8 h-8 text-accent" />
                    </div>
                    <CardTitle className="text-2xl font-black">실적 연도 추가</CardTitle>
                    <CardDescription>홈페이지 메인에 표시될 연도별 실적 수치를 추가합니다.</CardDescription>
                  </CardHeader>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="font-bold">연도 (예: 2027)</Label>
                      <Input type="number" placeholder="2027" value={newStatYear} onChange={(e) => setNewStatYear(e.target.value)} className="h-14" />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">완수 건수 (건)</Label>
                      <Input type="number" placeholder="10" value={newStatCount} onChange={(e) => setNewStatCount(e.target.value)} className="h-14" />
                    </div>
                    <Button onClick={handleAddYearlyStat} disabled={statsLoading} className="w-full h-16 bg-primary text-lg font-bold">
                      {statsLoading ? <Loader2 className="animate-spin" /> : "실적 데이터 저장"}
                    </Button>
                  </div>
                </Card>

                <Card className="p-10 rounded-[2.5rem] shadow-xl border-none">
                  <CardHeader className="p-0 mb-8">
                    <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                      <BarChart3 className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-black">노출 중인 실적 목록</CardTitle>
                    <CardDescription>현재 홈페이지 메인 '시공 실적 현황'에 표시되는 데이터입니다.</CardDescription>
                  </CardHeader>
                  <div className="space-y-4">
                    {yearlyStats.length === 0 ? (
                      <p className="text-center py-10 text-muted-foreground">데이터가 없습니다.</p>
                    ) : (
                      yearlyStats.map((stat) => (
                        <div key={stat.year} className="flex items-center justify-between p-5 bg-muted/20 rounded-2xl border border-muted/50 group hover:bg-white hover:shadow-lg transition-all">
                          <div>
                            <span className="text-sm font-bold text-muted-foreground block uppercase tracking-widest">{stat.year}년 실적</span>
                            <span className="text-2xl font-black text-primary">{stat.count}건</span>
                          </div>
                          <Button variant="ghost" size="icon" className="text-red-400" onClick={() => handleRemoveYearlyStat(stat.year)}>
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* 시공 사례 수정 모달 */}
      <Dialog open={!!editingProject} onOpenChange={() => setEditingProject(null)}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader><DialogTitle className="font-black text-2xl">시공 사례 수정</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>제목</Label>
              <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>카테고리</Label>
                <Select onValueChange={setEditCategory} value={editCategory}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="하자보수">하자보수</SelectItem>
                    <SelectItem value="방수">방수 공사</SelectItem>
                    <SelectItem value="도장">도장 공사</SelectItem>
                    <SelectItem value="기타">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>연도</Label>
                <Input value={editYear} onChange={(e) => setEditYear(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>위치</Label>
              <Input value={editLocation} onChange={(e) => setEditLocation(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingProject(null)}>취소</Button>
            <Button onClick={handleUpdateProject} disabled={loading}>{loading ? <Loader2 className="animate-spin" /> : "변경 내용 저장"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Footer />
    </main>
  );
}
