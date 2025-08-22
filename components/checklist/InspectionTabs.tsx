import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { InspectionsProgressTracker } from '../Inspections';
import { Search, ClipboardCheck, AlertTriangle, FileText, Home } from 'lucide-react';
import ChecklistResources from './ChecklistResources';
import { useTaskContext } from '../TaskContext';

interface Props { onNavigate?: (page: string) => void }
export default function ChecklistInspectionTabs({ onNavigate }: Props) {
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

  // Sample data for sections (in a real app, use shared context/state)
  const inspections = React.useMemo(() => ([
    { id: 'general', title: 'General Home Inspection', type: 'general', status: 'completed', date: '2025-07-15', time: '10:00 AM', inspector: 'John Smith', company: 'Elite Home Inspections', phone: '(555) 123-4567', cost: '$450', duration: '2-3 hours', description: 'Comprehensive inspection of all major systems and structures',
      issues: [
        { id: '1', category: 'Electrical', severity: 'high', issue: 'GFCI outlets missing in bathroom', description: 'Bathroom outlets should have GFCI protection for safety', recommendation: 'Install GFCI outlets in all bathroom locations', cost: '$150-300', status: 'negotiating' },
        { id: '2', category: 'Plumbing', severity: 'medium', issue: 'Minor leak under kitchen sink', description: 'Small water stain observed under kitchen sink', recommendation: 'Have plumber inspect and repair leak', cost: '$100-200', status: 'resolved' },
      ]
    },
    { id: 'radon', title: 'Radon Testing', type: 'radon', status: 'scheduled', date: '2025-07-18', time: '9:00 AM', inspector: 'Mike Davis', company: 'Air Quality Testing', phone: '(555) 456-7890', cost: '$200', duration: '48 hours', description: 'Test for radon gas levels in the basement and living areas' }
  ]), []);

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
        {tab === 'scheduled' && (
          <Card>
            <CardContent className="p-6 space-y-4">
              {inspections.map((inspection) => (
                <div key={inspection.id} className="flex items-start justify-between">
                  <div>
                    <div className="font-medium">{inspection.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {inspection.date ? new Date(inspection.date).toLocaleDateString() : 'TBD'} {inspection.time && `at ${inspection.time}`}
                    </div>
                    <div className="text-xs text-muted-foreground">{inspection.inspector} • {inspection.company}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs">{inspection.status}</div>
                    <div className="text-xs">{inspection.cost}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
        {tab === 'results' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Inspection Results Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {inspections[0]?.issues?.map((issue: any) => (
                <div key={issue.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-medium text-sm">{issue.issue}</div>
                    <span className="text-xs text-muted-foreground">{issue.cost}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{issue.description}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
        {tab === 'negotiations' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Issue Negotiations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(inspections[0]?.issues || []).map((issue: any) => (
                <div key={issue.id} className="p-3 border rounded-lg flex items-start justify-between">
                  <div>
                    <div className="font-medium text-sm">{issue.issue}</div>
                    <div className="text-xs text-muted-foreground">{issue.recommendation}</div>
                  </div>
                  <span className="text-xs capitalize">{issue.status}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
        {tab === 'reports' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Inspection Reports</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {inspections.filter(i => i.status === 'completed').map((i) => (
                <div key={i.id} className="p-3 border rounded-lg flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">{i.title} Report</div>
                    <div className="text-xs text-muted-foreground">Completed on {new Date(i.date).toLocaleDateString()}</div>
                  </div>
                  <Button size="sm" variant="outline">Download</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      <div className="lg:col-span-3">
        <ChecklistResources 
          onNavigate={(page) => onNavigate ? onNavigate(page) : undefined as any}
          onOpenPricing={() => { try { window.open('https://handoffiq.com/pricing','_blank','noopener,noreferrer'); } catch (e) { onNavigate && onNavigate('resources'); } }}
        />
      </div>
    </div>
  );
}

