import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Home, MapPin, Building } from 'lucide-react';
import { PropertyBasicProfileData } from '../../types/propertyBasicProfile';
import { formatPropertyType } from '../../utils/propertyHelpers';

interface PropertyInfoSectionProps {
  propertyData: PropertyBasicProfileData;
  mappedData?: any;
}

export function PropertyInfoSection({ propertyData, mappedData }: PropertyInfoSectionProps) {
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
  return (
    <Card className="modern-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="w-5 h-5 text-primary" />
          Property Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Address Information */}
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Property Address
              </h4>
              <p className="text-lg font-medium">
                {getMappedValue('property.address.street', propertyData.address?.oneLine) || 'Address not available'}
              </p>
              <div className="text-sm text-muted-foreground mt-1">
                <p>Street: {propertyData.address?.line1 || 'N/A'}</p>
                <p>City: {getMappedValue('property.address.city', propertyData.address?.locality) || 'N/A'}</p>
                <p>State: {getMappedValue('property.address.state', propertyData.address?.countrySubd) || 'N/A'}</p>
                <p>ZIP: {getMappedValue('property.address.zipCode', propertyData.address?.postal1) || 'N/A'}</p>
                {propertyData.address?.postal2 && (
                  <p>ZIP+4: {propertyData.address.postal2}</p>
                )}
              </div>
            </div>

            {propertyData.location && (
              <div>
                <h4 className="font-medium mb-2">Coordinates</h4>
                <p className="text-sm">
                  Lat: {propertyData.location.latitude}, Lng: {propertyData.location.longitude}
                </p>
                <p className="text-xs text-muted-foreground">
                  Accuracy: {propertyData.location.accuracy}
                </p>
              </div>
            )}
          </div>

          {/* Basic Property Info */}
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Building className="w-4 h-4" />
                Property Details
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Property Type:</span>
                  <span>{getMappedValue('property.basic.propertyType', formatPropertyType(propertyData.summary?.proptype))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Property Class:</span>
                  <span>{propertyData.summary?.propclass || 'N/A'}</span>
                </div>
                {propertyData.summary?.propsubtype && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtype:</span>
                    <span>{formatPropertyType(propertyData.summary.propsubtype)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Year Built:</span>
                  <span>{getMappedValue('property.basic.yearBuilt', propertyData.summary?.yearbuilt || propertyData.building?.summary?.yearBuilt) || 'N/A'}</span>
                </div>
                {propertyData.summary?.propLandUse && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Land Use:</span>
                    <span>{propertyData.summary.propLandUse}</span>
                  </div>
                )}
              </div>
            </div>

            {propertyData.lot && (
              <div>
                <h4 className="font-medium mb-2">Location Info</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">County:</span>
                    <span>{propertyData.lot.situsCounty || 'N/A'}</span>
                  </div>
                  {propertyData.lot.subdname && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subdivision:</span>
                      <span>{propertyData.lot.subdname}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}