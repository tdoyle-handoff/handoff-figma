import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { LegalProgressTracker, ContractReview, TitleSearch, SettlementReview, LawyerSearch } from '../Legal';

export default function ChecklistLegalTabs() {
  return (
    <Tabs defaultValue="progress" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="progress">Progress</TabsTrigger>
        <TabsTrigger value="attorney">Attorney</TabsTrigger>
        <TabsTrigger value="contract">Contract</TabsTrigger>
        <TabsTrigger value="title">Title</TabsTrigger>
        <TabsTrigger value="settlement">Settlement</TabsTrigger>
      </TabsList>

      <TabsContent value="progress" className="space-y-6">
        <LegalProgressTracker />
      </TabsContent>

      <TabsContent value="attorney" className="space-y-6">
        <LawyerSearch />
      </TabsContent>

      <TabsContent value="contract" className="space-y-6">
        <ContractReview />
      </TabsContent>

      <TabsContent value="title" className="space-y-6">
        <TitleSearch />
      </TabsContent>

      <TabsContent value="settlement" className="space-y-6">
        <SettlementReview />
      </TabsContent>
    </Tabs>
  );
}

