import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { LegalProgressTracker, ContractReview, TitleSearch, SettlementReview } from '../Legal';
import { Scale, FileText, Search, CheckCircle } from 'lucide-react';
import { useTaskContext } from '../TaskContext';

interface Props { onNavigate?: (page: string) => void }
export default function ChecklistLegalTabs({ onNavigate }: Props) {
  const [tab, setTab] = React.useState<'progress' | 'contract' | 'title' | 'settlement'>('progress');
  const taskContext = useTaskContext();
  const legalTasks = taskContext.tasks.filter(t => ['legal','contract','offer','closing'].includes(t.category));
  const completed = legalTasks.filter(t => t.status === 'completed').length;
  const total = legalTasks.length;
  const progress = total > 0 ? (completed / total) * 100 : 0;

  const sections: { key: typeof tab; label: string; icon: any }[] = [
    { key: 'progress', label: 'Progress', icon: Scale },
    { key: 'contract', label: 'Contract', icon: FileText },
    { key: 'title', label: 'Title', icon: Search },
    { key: 'settlement', label: 'Settlement', icon: CheckCircle },
  ];

  return (
    <div className="space-y-4">
      {/* Progress */}
      <Card className="shadow-soft">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm">Legal Overall Completion</CardTitle>
              <CardDescription>{completed} / {total} Completed</CardDescription>
            </div>
            <div className="text-lg font-semibold">{Math.round(progress)}%</div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={progress} />
        </CardContent>
      </Card>

      {/* Horizontal Section Nav */}
      <div className="flex items-center gap-2">
        {sections.map((s) => {
          const Icon = s.icon;
          const active = tab === s.key;
          return (
            <Button key={s.key} variant={active ? 'default' : 'outline'} onClick={()=>setTab(s.key)} className="h-9">
              <Icon className="w-4 h-4 mr-2" />{s.label}
            </Button>
          );
        })}
      </div>

      {/* Content */}
      <div className="space-y-3">
        {tab === 'progress' && <LegalProgressTracker />}
        {tab === 'contract' && <ContractReview />}
        {tab === 'title' && <TitleSearch />}
        {tab === 'settlement' && <SettlementReview />}
      </div>
    </div>
  );
}

