import React from 'react'
import { AppLayout } from '../layout/AppLayout'
import { TopNav } from '../layout/TopNav'
import { LeftSidebar } from '../layout/LeftSidebar'
import { RightSidebar } from '../layout/RightSidebar'
import { SearchPanel } from '../modules/property-search/SearchPanel'

export default function Dashboard() {
  const Progress = () => (
    <div className="w-full h-2 bg-muted rounded">
      <div className="h-2 bg-primary rounded" style={{ width: '30%' }} />
    </div>
  )

  const Actions = () => (
    <div className="flex gap-2">
      <button className="px-3 py-2 border rounded">Make Offer</button>
      <button className="px-3 py-2 border rounded">Add Vendor</button>
      <button className="px-3 py-2 border rounded">Upload Document</button>
    </div>
  )

  return (
    AppLayout
      topNav={TopNav /}
      leftSidebar={LeftSidebar /}
      rightSidebar={RightSidebar /}
      progressTracker={Progress /}
      actions={Actions /}
    >
      div className="grid gap-4"
        {/* KPI Row */}
        div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          {
            // Inline import to avoid changing project structure; at top of file we keep imports minimal
          }
          {/* eslint-disable-next-line @typescript-eslint/no-var-requires */}
          {(() => {
            // dynamic require to avoid circular imports warnings in some bundlers
            const { KpiTile } = require('../../components/ui/kpi');
            return (
              React.Fragment
                KpiTile title="Current MRR" value="$12.4k" tone="maroon" /
                KpiTile title="Current Customers" value="16,601" tone="gold" /
                KpiTile title="Active Customers" value="33%" tone="sand" /
                KpiTile title="Churn Rate" value="2%" tone="taupe" /
              /React.Fragment
            );
          })()}
        /div
        section id="transactions" className="bg-card border rounded-xl p-6 shadow-soft"
          h2 className="font-semibold mb-2"Guided Transaction Workflow/h2
          p className="text-sm text-muted-foreground"Interactive checklist with color-coded milestones./p
        /section

        section id="search" className="bg-card border rounded-xl p-6 shadow-soft"
          h2 className="font-semibold mb-2"Property Search  Selection/h2
          p className="text-sm text-muted-foreground"MLS integration, filters, save favorites, alerts./p
          div className="mt-4"
            SearchPanel /
          /div
        /section

        section id="vendors" className="bg-card border rounded-xl p-6 shadow-soft"
          h2 className="font-semibold mb-2"Vendor Marketplace/h2
          p className="text-sm text-muted-foreground"Find and book inspectors, appraisers, attorneys, lenders, title, insurance./p
        /section

        section id="documents" className="bg-card border rounded-xl p-6 shadow-soft"
          h2 className="font-semibold mb-2"Offer  Document Automation/h2
          p className="text-sm text-muted-foreground"Smart Offer Builder, templates, contingencies, e-sign./p
        /section

        section id="messages" className="bg-card border rounded-xl p-6 shadow-soft"
          h2 className="font-semibold mb-2"Communication Suite/h2
          p className="text-sm text-muted-foreground"Secure chat, file sharing, group chats, summaries./p
        /section

        section id="guides" className="bg-card border rounded-xl p-6 shadow-soft"
          h2 className="font-semibold mb-2"Education Hub/h2
          p className="text-sm text-muted-foreground"Stage-based guides, videos, glossary, calculators./p
        /section
      /div
    </AppLayout>
  )
}

