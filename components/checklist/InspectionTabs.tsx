import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { InspectionsProgressTracker } from '../Inspections';

export default function ChecklistInspectionTabs() {
  return (
    <Tabs defaultValue="progress" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="progress">Progress</TabsTrigger>
        <TabsTrigger value="scheduled" disabled>Scheduled</TabsTrigger>
        <TabsTrigger value="results" disabled>Results</TabsTrigger>
        <TabsTrigger value="reports" disabled>Reports</TabsTrigger>
      </TabsList>

      <TabsContent value="progress" className="space-y-6">
        <InspectionsProgressTracker />
      </TabsContent>
    </Tabs>
  );
}

