import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { User } from 'lucide-react';
import { PropertyBasicProfileData } from '../../types/propertyBasicProfile';
import { getPrimaryOwnerName, getMailingAddress } from '../../utils/propertyHelpers';

interface PropertyOwnerSectionProps {
  propertyData: PropertyBasicProfileData;
  mappedData?: any;
}

export function PropertyOwnerSection({ propertyData }: PropertyOwnerSectionProps) {
  if (!propertyData.owner) {
    return null;
  }

  return (
    <Card className="modern-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Current Owner Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Primary Owner */}
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Owner Name</h4>
              <p className="text-lg">{getPrimaryOwnerName(propertyData.owner)}</p>
              
              {/* Additional owners */}
              {propertyData.owner.owner2Full && (
                <p className="text-sm text-muted-foreground mt-1">{propertyData.owner.owner2Full}</p>
              )}
              {propertyData.owner.owner3Full && (
                <p className="text-sm text-muted-foreground">{propertyData.owner.owner3Full}</p>
              )}
            </div>
          </div>

          {/* Mailing Address */}
          {propertyData.owner.mailingAddress && (
            <div>
              <h4 className="font-medium mb-2">Mailing Address</h4>
              <p className="text-sm text-muted-foreground">
                {getMailingAddress(propertyData.owner.mailingAddress)}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}