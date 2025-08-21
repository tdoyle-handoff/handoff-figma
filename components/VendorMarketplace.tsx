import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import AttorneySearch from './vendor/AttorneySearch';
import InspectorSearch from './vendor/InspectorSearch';
import InsuranceProviders from './vendor/InsuranceProviders';
import InsuranceQuotes from './vendor/InsuranceQuotes';
import InsuranceCalculator from './vendor/InsuranceCalculator';

type TabKey = 'attorneys' | 'inspectors' | 'insurance-providers' | 'insurance-quotes' | 'insurance-calculator';

interface VendorMarketplaceProps {
  defaultTab?: TabKey;
}

export default function VendorMarketplace({ defaultTab = 'attorneys' }: VendorMarketplaceProps) {
  const [tabValue, setTabValue] = React.useState<TabKey>(defaultTab);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Vendor Marketplace</CardTitle>
          <CardDescription>
            Browse and book trusted providers with ratings, availability, and pricing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Find a real estate attorney, schedule inspections, or compare insurance quotes — all in one place.
          </p>
        </CardContent>
      </Card>

      <Tabs value={tabValue} onValueChange={(v) => setTabValue(v as TabKey)} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="attorneys">Attorneys</TabsTrigger>
          <TabsTrigger value="inspectors">Inspectors</TabsTrigger>
          <TabsTrigger value="insurance-providers">Insurance Providers</TabsTrigger>
          <TabsTrigger value="insurance-quotes">Insurance Quotes</TabsTrigger>
          <TabsTrigger value="insurance-calculator">Insurance Calculator</TabsTrigger>
        </TabsList>

        <TabsContent value="attorneys" className="space-y-6">
          <AttorneySearch />
        </TabsContent>

        <TabsContent value="inspectors" className="space-y-6">
          <InspectorSearch />
        </TabsContent>

        <TabsContent value="insurance-providers" className="space-y-6">
          <InsuranceProviders />
        </TabsContent>

        <TabsContent value="insurance-quotes" className="space-y-6">
          <InsuranceQuotes />
        </TabsContent>

        <TabsContent value="insurance-calculator" className="space-y-6">
          <InsuranceCalculator />
        </TabsContent>
      </Tabs>
    </div>
  );
}

