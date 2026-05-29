
'use client';

import { useState, useEffect } from 'react';
import { db, storage } from '@/firebaseConfig';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, deleteDoc, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
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
import { Loader2, Plus, Image as ImageIcon, MessageSquare, Trash2, Calendar, MapPin, User, Phone, LayoutGrid, Edit, BarChart3 } from 'lucide-react';

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

export default function AdminPage() {
  const { toast } = useToast();
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

  // 수정용 상태
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editYear, setEditYear] = useState('');
  const [editLocation, setEditLocation] = useState('');

  // 실적 통계 상태
  const [stats2025, setStats2025] = useState(12);
  const [stats2026, setStats2026] = useState(8);
  const [statsLoading, setStatsLoading] = useState(false);

  // 실시간 데이터 상태
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (!isLoggedIn) return;

    const qInquiries = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
    const unsubscribeInquiries = onSnapshot(qInquiries, (snapshot) => {
      setInquiries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Inquiry[]);
    });

    const qProjects = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const unsubscribeProjects = onSnapshot(qProjects, (snapshot) => {
      setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Project[]);
    });

    // 실적 통계 실시간 리스너
    const unsubscribeStats = onSnapshot(doc(db, 'siteSettings', 'stats'), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setStats2025(data.count2025 || 0);
        setStats2026(data.count2026 || 0);
      }
    });

    return () => {
      unsubscribeInquiries();
      unsubscribeProjects();
      unsubscribeStats();
    };
  }, [isLoggedIn]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'yido610' && password === 'yido610!') {
      setIsLoggedIn(true);
      toast({ title: "로그인 성공" });
    } else {
      toast({ variant: "destructive", title: "로그인 실패" });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !title || !category) return toast({ variant: "destructive", title: "입력 오류" });

    setLoading(true);
    try {
      const storagePath = `projects/${Date.now()}_${image.name}`;
      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, image);
      const imageUrl = await getDownloadURL(storageRef);

      await addDoc(collection(db, 'projects'), {
        title,
        category,
        location,
        year: year.replace('년', ''),
        imageUrl,
        storagePath,
        createdAt: serverTimestamp(),
      });

      toast({ title: "등록 완료" });
      setTitle(''); setCategory(''); setLocation(''); setImage(null); setImagePreview(null);
    } catch (error) {
      toast({ variant: "destructive", title: "업로드 실패" });
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
      toast({ title: "수정 완료" });
      setEditingProject(null);
    } catch (error) {
      toast({ variant: "destructive", title: "수정 실패" });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStats = async () => {
    setStatsLoading(true);
    try {
      await setDoc(doc(db, 'siteSettings', 'stats'), {
        count2025: Number(stats2025),
        count2026: Number(stats2026),
        updatedAt: serverTimestamp()
      }, { merge: true });
      toast({ title: "통계 업데이트 완료" });
    } catch (error) {
      toast({ variant: "destructive", title: "업데이트 실패" });
    } finally {
      setStatsLoading(false);
    }
  };

  const handleDeleteProject = async (project: Project) => {
    if (!confirm(`'${project.title}' 시공 사례를 삭제하시겠습니까?`)) return;
    try {
      if (project.storagePath) {
        await deleteObject(ref(storage, project.storagePath)).catch(() => {});
      }
      await deleteDoc(doc(db, 'projects', project.id));
      toast({ title: "삭제 완료" });
    } catch (error) {
      toast({ variant: "destructive", title: "삭제 오류" });
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
          <header className="border-b border-muted pb-8">
            <h1 className="text-4xl font-black text-primary tracking-tight">관리자 대시보드</h1>
          </header>

          <Tabs defaultValue="inquiries" className="space-y-8">
            <TabsList className="bg-white border p-1 rounded-2xl h-16 shadow-sm overflow-x-auto inline-flex w-full">
              <TabsTrigger value="inquiries" className="rounded-xl flex-1 h-full font-bold">상담 문의 ({inquiries.length})</TabsTrigger>
              <TabsTrigger value="upload" className="rounded-xl flex-1 h-full font-bold">새 시공사례 등록</TabsTrigger>
              <TabsTrigger value="projects" className="rounded-xl flex-1 h-full font-bold">시공 사례 관리 ({projects.length})</TabsTrigger>
              <TabsTrigger value="stats" className="rounded-xl flex-1 h-full font-bold">실적 통계 관리</TabsTrigger>
            </TabsList>

            <TabsContent value="inquiries" className="space-y-6">
              <div className="grid gap-4">
                {inquiries.map((item) => (
                  <Card key={item.id} className="border-none shadow-sm rounded-2xl p-8">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-accent uppercase tracking-widest"><Calendar className="w-3 h-3" />{item.createdAt?.toDate().toLocaleDateString()}</div>
                        <h3 className="text-xl font-black text-primary flex items-center gap-2"><User className="w-4 h-4" />{item.name}</h3>
                        <p className="text-sm font-bold text-muted-foreground"><Phone className="w-3 h-3 inline mr-1" />{item.phone}</p>
                      </div>
                      <div className="flex-1 bg-muted/30 p-6 rounded-2xl italic font-medium">"{item.content}"</div>
                      <Button variant="ghost" className="text-red-400" onClick={() => deleteDoc(doc(db, 'inquiries', item.id))}><Trash2 /></Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="upload">
              <Card className="border-none shadow-xl rounded-[2.5rem] p-10 max-w-2xl mx-auto">
                <form onSubmit={handleUpload} className="space-y-6">
                  <div className="space-y-2">
                    <Label className="font-bold">프로젝트 제목 *</Label>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="font-bold">카테고리 *</Label>
                      <Select onValueChange={setCategory} value={category}>
                        <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="하자보수">하자보수</SelectItem>
                          <SelectItem value="방수">방수 공사</SelectItem>
                          <SelectItem value="도장">도장 공사</SelectItem>
                          <SelectItem value="기타">기타</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">시공 연도 *</Label>
                      <Select onValueChange={setYear} value={year}>
                        <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 11 }, (_, i) => 2025 + i).map(y => (
                            <SelectItem key={y} value={y.toString()}>{y}년</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold">시공 위치/유형</Label>
                    <Input value={location} onChange={(e) => setLocation(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold">사진 첨부 *</Label>
                    <Input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="file-up" />
                    <label htmlFor="file-up" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl cursor-pointer bg-muted/10 overflow-hidden">
                      {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" /> : <ImageIcon className="w-10 h-10 text-muted-foreground" />}
                    </label>
                  </div>
                  <Button type="submit" disabled={loading} className="w-full h-16 bg-accent text-xl font-black">{loading ? <Loader2 className="animate-spin" /> : "등록 완료"}</Button>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="projects">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((item) => (
                  <Card key={item.id} className="overflow-hidden group rounded-2xl shadow-sm hover:shadow-lg transition-all">
                    <div className="relative h-48">
                      <img src={item.imageUrl} className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 flex gap-1">
                        <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => {
                          setEditingProject(item);
                          setEditTitle(item.title);
                          setEditCategory(item.category);
                          setEditYear(item.year);
                          setEditLocation(item.location || '');
                        }}><Edit className="w-4 h-4" /></Button>
                        <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => handleDeleteProject(item)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                      <div className="absolute bottom-2 left-2 flex gap-1">
                        <span className="px-2 py-1 bg-primary text-white text-[9px] font-bold rounded">{item.category}</span>
                        <span className="px-2 py-1 bg-accent text-white text-[9px] font-bold rounded">{item.year}년</span>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h4 className="text-lg font-black text-primary line-clamp-1">{item.title}</h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" />{item.location || '위치 미지정'}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="stats">
              <Card className="max-w-md mx-auto p-10 rounded-[2rem] shadow-xl border-none">
                <CardHeader className="text-center p-0 mb-8">
                  <BarChart3 className="w-12 h-12 text-accent mx-auto mb-4" />
                  <CardTitle className="text-2xl font-black">실적 건수 수동 관리</CardTitle>
                  <CardDescription>홈페이지 메인에 노출되는 실적 숫자를 직접 수정합니다.</CardDescription>
                </CardHeader>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="font-bold">2025년 완수 실적 (건수)</Label>
                    <Input type="number" value={stats2025} onChange={(e) => setStats2025(Number(e.target.value))} className="h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold">2026년 완수 실적 (건수)</Label>
                    <Input type="number" value={stats2026} onChange={(e) => setStats2026(Number(e.target.value))} className="h-12" />
                  </div>
                  <Button onClick={handleUpdateStats} disabled={statsLoading} className="w-full h-14 bg-primary text-lg font-bold">
                    {statsLoading ? <Loader2 className="animate-spin" /> : "실적 정보 업데이트"}
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* 수정 다이얼로그 */}
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
