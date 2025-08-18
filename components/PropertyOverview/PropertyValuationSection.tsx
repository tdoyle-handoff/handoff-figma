import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { DollarSign } from 'lucide-react';
import { PropertyBasicProfileData } from '../../types/propertyBasicProfile';
import { formatCurrency, formatDate } from '../../utils/propertyHelpers';

interface PropertyValuationSectionProps {
  propertyData: PropertyBasicProfileData;
  mappedData?: any;
}

export function PropertyValuationSection({ propertyData, mappedData }: PropertyValuationSectionProps) {
  // Helper function to get mapped value or fallback to original
  const getMappedValue = (targetField: string, fallback: any) => {
    if (mappedData && targetField) {
      const keys = targetField.split('.');
      let value = mappedData;
      for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
          value = value[key];
        } else {
          return fallback;
        }
      }
      return value !== undefined && value !== null ? value : fallback;
    }
    return fallback;
  };
  if (!propertyData.assessment && !propertyData.sale) {
    return null;
  }

  return (
    <Card className="modern-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-primary" />
          Valuation & Assessment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Assessment Information */}
          {propertyData.assessment && (
            <div>
              <h4 className="font-medium mb-3">Assessment Data</h4>
              <div className="space-y-2 text-sm">
                {propertyData.assessment.assessor?.assdValue && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Assessed Value:</span>
                    <span>{formatCurrency(propertyData.assessment.assessor.assdValue)}</span>
                  </div>
                )}
                {propertyData.assessment.market?.apprCurr && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Market Value:</span>
                    <span>{formatCurrency(propertyData.assessment.market.apprCurr)}</span>
                  </div>
                )}
                {propertyData.assessment.tax?.taxAmt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Annual Tax:</span>
                    <span>{formatCurrency(propertyData.assessment.tax.taxAmt)}</span>
                  </div>
                )}
                {propertyData.assessment.assessor?.taxYear && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax Year:</span>
                    <span>{propertyData.assessment.assessor.taxYear}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sale Information */}
          {propertyData.sale && (
            <div>
              <h4 className="font-medium mb-3">Sale Data</h4>
              <div className="space-y-2 text-sm">
                {propertyData.sale.amount?.saleAmt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Sale Price:</span>
                    <span>{formatCurrency(propertyData.sale.amount.saleAmt)}</span>
                  </div>
                )}
                {propertyData.sale.transaction?.saleTransDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sale Date:</span>
                    <span>{formatDate(propertyData.sale.transaction.saleTransDate)}</span>
                  </div>
                )}
                {propertyData.sale.calculation?.pricePerSizeUnit && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price per Sq Ft:</span>
                    <span>{formatCurrency(propertyData.sale.calculation.pricePerSizeUnit)}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}