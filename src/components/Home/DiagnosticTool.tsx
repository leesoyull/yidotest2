
"use client"

import { useState } from 'react';
import { Search, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { aiMaintenanceDiagnostic, AiMaintenanceDiagnosticOutput } from '@/ai/flows/ai-maintenance-diagnostic-flow';
import { RevealItem } from '../SectionReveal';

export function DiagnosticTool() {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiMaintenanceDiagnosticOutput | null>(null);

  const handleDiagnostic = async () => {
    if (!description.trim()) return;
    setLoading(true);
    try {
      const data = await aiMaintenanceDiagnostic({ issueDescription: description });
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto shadow-2xl border-none bg-white rounded-2xl overflow-hidden">
      <div className="grid md:grid-cols-5 h-full">
        <div className="md:col-span-2 bg-primary p-8 text-white flex flex-col justify-between">
          <div>
            <h3 className="font-headline text-2xl font-bold mb-4">AI 하자 진단</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              발생한 문제(균열, 누수 등)를 자세히 설명해주세요. <br/>
              이도건설의 AI 전문가가 즉시 원인을 분석하고 최적의 해결 방안을 제안해 드립니다.
            </p>
          </div>
          <div className="pt-8">
             <div className="flex items-center gap-3 text-xs text-accent bg-accent/10 p-3 rounded-lg border border-accent/20">
               <AlertTriangle className="w-4 h-4 flex-shrink-0" />
               <span>정밀 진단은 반드시 현장 확인이 필요합니다.</span>
             </div>
          </div>
        </div>

        <div className="md:col-span-3 p-8">
          <div className="space-y-4">
            <Textarea
              placeholder="예: '거실 천장에서 물이 한 방울씩 떨어지고 벽지에 곰팡이가 생겼어요. 옥상 방수 공사를 한 지 5년 정도 되었습니다.'"
              className="min-h-[150px] resize-none border-muted focus:ring-accent bg-muted/30"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Button 
              className="w-full h-12 text-md font-bold bg-accent hover:bg-accent/90"
              onClick={handleDiagnostic}
              disabled={loading || !description.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  분석 중...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  진단 시작하기
                </>
              )}
            </Button>
          </div>

          {result && (
            <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom duration-500">
              <div className="p-4 bg-muted/50 rounded-xl border border-muted">
                <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-accent" />
                  예상 원인
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {result.likelyCause}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-primary flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  권장 해결 절차
                </h4>
                <ul className="space-y-2">
                  {result.suggestedRepairProcedures.map((step, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-accent/10 text-accent flex-shrink-0 flex items-center justify-center text-[10px] font-bold mt-0.5">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
