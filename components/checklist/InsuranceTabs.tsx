import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { useTaskContext } from '../TaskContext';
import InsuranceQuotes from '../vendor/InsuranceQuotes';
import InsuranceProviders from '../vendor/InsuranceProviders';
import InsuranceCalculator from '../vendor/InsuranceCalculator';
import { Shield, DollarSign, Calculator as CalcIcon, FileText } from 'lucide-react';

interface Props { onNavigate?: (page: string) => void }
export default function ChecklistInsuranceTabs({ onNavigate }: Props) {
  const [tab, setTab] = React.useState<'quotes' | 'providers' | 'calculator' | 'policies'>('quotes');
  const taskContext = useTaskContext();
  const insuranceTasks = taskContext.tasks.filter(t => t.category === 'insurance' || t.subcategory === 'insurance');
  const completed = insuranceTasks.filter(t => t.status === 'completed').length;
  const total = insuranceTasks.length;
  const progress = total > 0 ? (completed / total) * 100 : 0;

  const sections = [
    { key: 'quotes', label: 'Quotes', icon: DollarSign },
    { key: 'providers', label: 'Providers', icon: Shield },
    { key: 'calculator', label: 'Calculator', icon: CalcIcon },
    { key: 'policies', label: 'Policies', icon: FileText },
  ] as const;

  return (
    <div className="space-y-4">
      <Card className="shadow-soft">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm">Insurance Overall Completion</CardTitle>
              <p className="text-xs text-muted-foreground">{completed} / {total} Completed</p>
            </div>
            <div className="text-lg font-semibold">{Math.round(progress)}%</div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={progress} />
        </CardContent>
      </Card>

      <div className="flex items-center gap-2">
        {sections.map((s) => {
          const Icon = s.icon;
          const active = tab === s.key;
          return (
            <Button key={s.key} variant={active ? 'default' : 'outline'} onClick={()=>setTab(s.key as typeof tab)} className="h-9">
              <Icon className="w-4 h-4 mr-2" />{s.label}
            </Button>
          );
        })}
      </div>

      <div className="space-y-3">
        {tab === 'quotes' && <InsuranceQuotes />}
        {tab === 'providers' && <InsuranceProviders />}
        {tab === 'calculator' && <InsuranceCalculator />}
        {tab === 'policies' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Current Policies</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              You don't have any active policies yet. Once you select and purchase insurance, your policies will appear here.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
