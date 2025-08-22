import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { LegalProgressTracker, ContractReview, TitleSearch, SettlementReview, LawyerSearch } from '../Legal';
import { Scale, User, FileText, Search, CheckCircle } from 'lucide-react';
import { useTaskContext } from '../TaskContext';
import ChecklistResources from './ChecklistResources';

interface Props { onNavigate?: (page: string) => void }
export default function ChecklistLegalTabs({ onNavigate }: Props) {
  const [tab, setTab] = React.useState<'progress' | 'attorney' | 'contract' | 'title' | 'settlement'>('progress');
  const taskContext = useTaskContext();
  const legalTasks = taskContext.tasks.filter(t => ['legal','contract','offer','closing'].includes(t.category));
  const completed = legalTasks.filter(t => t.status === 'completed').length;
  const total = legalTasks.length;
  const progress = total > 0 ? (completed / total) * 100 : 0;

  const sections: { key: typeof tab; label: string; icon: any }[] = [
    { key: 'progress', label: 'Progress', icon: Scale },
    { key: 'attorney', label: 'Attorney', icon: User },
    { key: 'contract', label: 'Contract', icon: FileText },
    { key: 'title', label: 'Title', icon: Search },
    { key: 'settlement', label: 'Settlement', icon: CheckCircle },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Left Sidebar */}
      <div className="lg:col-span-3 space-y-3">
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm">Legal Overall Completion</CardTitle>
                <p className="text-xs text-muted-foreground">{completed} / {total} Completed</p>
              </div>
              <div className="text-lg font-semibold">{Math.round(progress)}%</div>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={progress} />
          </CardContent>
        </Card>

        <div className="space-y-2">
          {sections.map((s) => {
            const Icon = s.icon;
            const active = tab === s.key;
            return (
              <Button
                key={s.key}
                variant={active ? 'default' : 'outline'}
                className={`w-full justify-start h-auto py-3 ${active ? '' : 'bg-white'}`}
                onClick={() => setTab(s.key)}
              >
                <span className="flex items-center gap-3">
                  <span className="p-2 rounded-lg bg-gray-100">
                    <Icon className="w-4 h-4 text-gray-700" />
                  </span>
                  <span className="font-medium text-sm">{s.label}</span>
                </span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Center Content */}
      <div className="lg:col-span-6 space-y-3">
        {tab === 'progress' && <LegalProgressTracker />}
        {tab === 'attorney' && <LawyerSearch />}
        {tab === 'contract' && <ContractReview />}
        {tab === 'title' && <TitleSearch />}
        {tab === 'settlement' && <SettlementReview />}
      </div>

      {/* Right Resources */}
      <div className="lg:col-span-3">
        <ChecklistResources 
          onNavigate={(page) => onNavigate ? onNavigate(page) : undefined as any}
          onOpenPricing={() => {
            try { window.open('https://handoffiq.com/pricing', '_blank', 'noopener,noreferrer'); } catch (e) { onNavigate && onNavigate('resources'); }
          }}
        />
      </div>
    </div>
  );
}

