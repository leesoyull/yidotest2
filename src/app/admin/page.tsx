
'use client';

import { useState, useEffect } from 'react';
import { db, storage } from '@/firebaseConfig';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
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
import { Loader2, Plus, Image as ImageIcon, MessageSquare, Trash2, Calendar, MapPin, User, Phone, Mail, LayoutGrid, FileText } from 'lucide-react';

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

  // 실시간 데이터 상태
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  // 데이터 실시간 리스너 (상담 문의 & 시공 사례)
  useEffect(() => {
    if (!isLoggedIn) return;

    // 상담 문의 리스너
    const qInquiries = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
    const unsubscribeInquiries = onSnapshot(qInquiries, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Inquiry[];
      setInquiries(data);
    });

    // 시공 사례 리스너
    const qProjects = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const unsubscribeProjects = onSnapshot(qProjects, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Project[];
      setProjects(data);
    });

    return () => {
      unsubscribeInquiries();
      unsubscribeProjects();
    };
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
    if (!image || !title || !category) return toast({ variant: "destructive", title: "입력 오류", description: "모든 필수 항목을 입력해 주세요." });

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

      toast({ title: "등록 완료", description: "새 시공 사례가 홈페이지에 반영되었습니다." });
      
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

  // 데이터 삭제 (상담 문의)
  const handleDeleteInquiry = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까? 삭제된 상담 내용은 복구할 수 없습니다.')) return;
    try {
      await deleteDoc(doc(db, 'inquiries', id));
      toast({ title: "삭제 완료", description: "상담 내역이 삭제되었습니다." });
    } catch (error) {
      toast({ variant: "destructive", title: "오류", description: "삭제 중 문제가 발생했습니다." });
    }
  };

  // 데이터 삭제 (시공 사례)
  const handleDeleteProject = async (project: Project) => {
    if (!confirm(`'${project.title}' 시공 사례를 삭제하시겠습니까?`)) return;
    try {
      // 1. Storage 이미지 삭제 (경로가 있는 경우)
      if (project.storagePath) {
        const imageRef = ref(storage, project.storagePath);
        await deleteObject(imageRef).catch(err => console.warn('Storage image not found', err));
      }
      // 2. Firestore 문서 삭제
      await deleteDoc(doc(db, 'projects', project.id));
      toast({ title: "삭제 완료", description: "시공 사례가 삭제되었습니다." });
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
              <p className="text-muted-foreground mt-2 font-medium">이도건설의 모든 비즈니스 데이터를 실시간으로 관리합니다.</p>
            </div>
          </header>

          <Tabs defaultValue="inquiries" className="space-y-8">
            <TabsList className="bg-white border p-1 rounded-2xl h-16 shadow-sm overflow-x-auto inline-flex w-full md:w-auto">
              <TabsTrigger value="inquiries" className="rounded-xl h-full px-6 text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all whitespace-nowrap">
                <MessageSquare className="w-4 h-4 mr-2" />
                상담 문의 관리 ({inquiries.length})
              </TabsTrigger>
              <TabsTrigger value="upload" className="rounded-xl h-full px-6 text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all whitespace-nowrap">
                <Plus className="w-4 h-4 mr-2" />
                새 시공사례 등록
              </TabsTrigger>
              <TabsTrigger value="projects" className="rounded-xl h-full px-6 text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all whitespace-nowrap">
                <LayoutGrid className="w-4 h-4 mr-2" />
                시공 사례 관리 ({projects.length})
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
                            {item.createdAt?.toDate().toLocaleDateString() || '저장 중...'}
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
                          </div>
                          <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase tracking-tighter">
                            {item.serviceType}
                          </div>
                        </div>
                        <div className="md:col-span-2 bg-muted/30 p-6 rounded-2xl">
                          <p className="text-sm text-primary leading-relaxed whitespace-pre-wrap font-medium italic">
                            "{item.content}"
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

            <TabsContent value="upload">
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
                        <div 
                          className="relative group"
                          onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-accent'); }}
                          onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('border-accent'); }}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.currentTarget.classList.remove('border-accent');
                            const file = e.dataTransfer.files?.[0];
                            if (file) {
                              setImage(file);
                              const reader = new FileReader();
                              reader.onloadend = () => setImagePreview(reader.result as string);
                              reader.readAsDataURL(file);
                            }
                          }}
                        >
                          <Input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageChange}
                            className="hidden" 
                            id="project-image"
                          />
                          <label 
                            htmlFor="project-image"
                            className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-muted rounded-2xl cursor-pointer bg-muted/10 group-hover:bg-muted/20 group-hover:border-accent transition-all overflow-hidden"
                          >
                            {imagePreview ? (
                              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                <ImageIcon className="w-10 h-10" />
                                <span className="text-sm font-bold">사진을 드래그하거나 클릭하여 업로드</span>
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
                            데이터 저장 중...
                          </>
                        ) : (
                          "시공 사례 등록 완료"
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="projects">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.length === 0 ? (
                  <div className="col-span-full text-center py-32 bg-white rounded-[2rem] border-2 border-dashed">
                    <p className="text-muted-foreground font-bold">등록된 시공 사례가 없습니다.</p>
                  </div>
                ) : (
                  projects.map((item) => (
                    <Card key={item.id} className="border-none shadow-sm hover:shadow-lg transition-all rounded-2xl overflow-hidden group">
                      <div className="relative h-48 overflow-hidden">
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <div className="absolute top-4 right-4 flex gap-2">
                           <Button 
                            variant="destructive" 
                            size="icon" 
                            className="h-10 w-10 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleDeleteProject(item)}
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </div>
                        <div className="absolute bottom-4 left-4 flex gap-1">
                          <span className="px-2 py-1 bg-primary text-white text-[9px] font-bold rounded uppercase">{item.category}</span>
                          <span className="px-2 py-1 bg-accent text-white text-[9px] font-bold rounded">{item.year}년</span>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <h4 className="text-lg font-black text-primary line-clamp-1 mb-2">{item.title}</h4>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                          <MapPin className="w-3 h-3" />
                          {item.location || '위치 미지정'}
                        </p>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </main>
  );
}
