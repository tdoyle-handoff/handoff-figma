import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { InspectionsProgressTracker } from '../Inspections';
import { Search, ClipboardCheck, AlertTriangle, FileText, Home } from 'lucide-react';
import ChecklistResources from './ChecklistResources';
import { useTaskContext } from '../TaskContext';

export default function ChecklistInspectionTabs() {
  const [tab, setTab] = React.useState<'progress' | 'scheduled' | 'results' | 'negotiations' | 'reports'>('progress');
  const taskContext = useTaskContext();
  const inspTasks = taskContext.getActiveTasksByCategory('inspections');
  const total = taskContext.tasks.filter(t => t.category === 'inspections').length;
  const completed = taskContext.tasks.filter(t => t.category === 'inspections' && t.status === 'completed').length;
  const progress = total > 0 ? (completed / total) * 100 : 0;

  const sections = [
    { key: 'progress', label: 'Progress', icon: Search },
    { key: 'scheduled', label: 'Scheduled', icon: ClipboardCheck },
    { key: 'results', label: 'Results', icon: AlertTriangle },
    { key: 'negotiations', label: 'Negotiations', icon: Home },
    { key: 'reports', label: 'Reports', icon: FileText },
  ] as const;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <div className="lg:col-span-3 space-y-3">
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm">Inspections Overall</CardTitle>
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

      <div className="lg:col-span-6 space-y-3">
        {tab === 'progress' && <InspectionsProgressTracker />}
        {tab !== 'progress' && (
          <Card>
            <CardContent className="p-6 text-sm text-gray-600">
              {tab.charAt(0).toUpperCase() + tab.slice(1)} view coming soon in the checklist.
            </CardContent>
          </Card>
        )}
      </div>

      <div className="lg:col-span-3">
        <ChecklistResources onNavigate={() => {}} onOpenPricing={() => {}} />
      </div>
    </div>
  );
}

