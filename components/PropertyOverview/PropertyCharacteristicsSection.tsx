import { Fragment } from 'react';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { Ruler, Bed, Bath, Home, Car, CheckCircle } from 'lucide-react';
import { PropertyBasicProfileData } from '../../types/propertyBasicProfile';
import { formatSquareFeet, formatLotSize } from '../../utils/propertyHelpers';

interface PropertyCharacteristicsSectionProps {
  propertyData: PropertyBasicProfileData;
  mappedData?: any;
}

export function PropertyCharacteristicsSection({ propertyData, mappedData }: PropertyCharacteristicsSectionProps) {
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
  if (!propertyData.area && !propertyData.building) {
    return null;
  }

  return (
    <Card className="modern-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ruler className="w-5 h-5 text-primary" />
          Property Characteristics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Bedrooms */}
          <div className="text-center">
            <Bed className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <div className="text-2xl font-semibold">
              {propertyData.area?.bedrooms || propertyData.building?.summary?.noOfBeds || 'N/A'}
            </div>
            <div className="text-sm text-muted-foreground">Bedrooms</div>
          </div>

          {/* Bathrooms */}
          <div className="text-center">
            <Bath className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <div className="text-2xl font-semibold">
              {propertyData.area?.bathrooms || propertyData.building?.summary?.noOfBaths || 'N/A'}
            </div>
            <div className="text-sm text-muted-foreground">Bathrooms</div>
            {(propertyData.area?.bathroomsFull || propertyData.area?.bathroomsPartial) && (
              <div className="text-xs text-muted-foreground mt-1">
                {propertyData.area.bathroomsFull && `${propertyData.area.bathroomsFull} Full`}
                {propertyData.area.bathroomsFull && propertyData.area.bathroomsPartial && ', '}
                {propertyData.area.bathroomsPartial && `${propertyData.area.bathroomsPartial} Half`}
              </div>
            )}
          </div>

          {/* Square Feet */}
          <div className="text-center">
            <Home className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <div className="text-2xl font-semibold">
              {propertyData.area?.areaSqFt || 
               propertyData.building?.size?.universalSize || 
               propertyData.building?.size?.grossSizeGeneral || 'N/A'}
            </div>
            <div className="text-sm text-muted-foreground">Sq Ft</div>
            {propertyData.building?.size?.livingSize && (
              <div className="text-xs text-muted-foreground mt-1">
                {formatSquareFeet(propertyData.building.size.livingSize)} Living
              </div>
            )}
          </div>

          {/* Parking */}
          <div className="text-center">
            <Car className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <div className="text-2xl font-semibold">
              {propertyData.building?.parking?.prkgSize || 'N/A'}
            </div>
            <div className="text-sm text-muted-foreground">Parking Spaces</div>
            {propertyData.building?.parking?.garagetype && (
              <div className="text-xs text-muted-foreground mt-1">
                {propertyData.building.parking.garagetype}
              </div>
            )}
          </div>
        </div>

        {/* Additional Property Features */}
        {propertyData.building && (
          <Fragment>
            <Separator className="my-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Construction Details */}
              {propertyData.building.construction && (
                <div>
                  <h4 className="font-medium mb-3">Construction Details</h4>
                  <div className="space-y-2 text-sm">
                    {propertyData.building.construction.style && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Style:</span>
                        <span>{propertyData.building.construction.style}</span>
                      </div>
                    )}
                    {propertyData.building.construction.condition && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Condition:</span>
                        <span>{propertyData.building.construction.condition}</span>
                      </div>
                    )}
                    {propertyData.building.construction.quality && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Quality:</span>
                        <span>{propertyData.building.construction.quality}</span>
                      </div>
                    )}
                    {propertyData.building.construction.exteriorWalls && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Exterior:</span>
                        <span>{propertyData.building.construction.exteriorWalls}</span>
                      </div>
                    )}
                    {propertyData.building.construction.roofCover && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Roof:</span>
                        <span>{propertyData.building.construction.roofCover}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Lot Information */}
              {propertyData.lot && (
                <div>
                  <h4 className="font-medium mb-3">Lot Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lot Size:</span>
                      <span>{formatLotSize(propertyData.lot.lotsize1, propertyData.lot.lotsize2)}</span>
                    </div>
                    {propertyData.lot.pooltype && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Pool:</span>
                        <span className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          {propertyData.lot.pooltype}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Fragment>
        )}
      </CardContent>
    </Card>
  );
}