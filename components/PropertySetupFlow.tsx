import React, { useState, useEffect } from 'react';
import { PropertySetupScreening } from './PropertySetupScreening';
import { InitialPropertySetup } from './InitialPropertySetup';
import { Button } from './ui/button';
import { ArrowLeft, X } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface ScreeningData {
  buyingStage: 'searching' | 'under-contract' | 'pre-approved' | 'just-starting';
  experienceLevel: 'first-time' | 'experienced' | 'investor';
  hasSpecificProperty: boolean;
  propertyAddress?: string;
  primaryGoal: 'primary-residence' | 'investment' | 'vacation-home' | 'relocation';
  timeframe: 'immediate' | '3-months' | '6-months' | 'exploring';
  hasPreApproval: boolean;
  contractSigned: boolean;
  needsRealtor: boolean;
  nextAction: 'search-properties' | 'focus-property' | 'get-preapproved' | 'sign-contract';
}

interface PropertyData {
  propertyAddress?: string;
  propertyPrice?: string;
  closingDate?: string;
  inspectionDate?: string;
  earnestMoney?: string;
  contingencies?: string[];
  downPayment?: string;
  loanAmount?: string;
  monthlyPayment?: string;
  propertyTaxes?: string;
  hoaFees?: string;
  occupancyDate?: string;
  renovationPlans?: string;
  realtor?: string;
  lender?: string;
  attorney?: string;
  inspector?: string;
  rentalIncome?: string;
  capRate?: string;
  firstTimeBuyerPrograms?: string[];
}

interface PropertySetupFlowProps {
  onComplete: () => void;
  isEditMode?: boolean;
  onExitEditMode?: () => void;
}

export function PropertySetupFlow({ onComplete, isEditMode = false, onExitEditMode }: PropertySetupFlowProps) {
  const [currentPhase, setCurrentPhase] = useState<'screening' | 'setup'>('setup');
  const [screeningData, setScreeningData] = useState<ScreeningData | null>(null);

  // Check if screening is already complete
  useEffect(() => {
    const savedScreeningData = localStorage.getItem('handoff-screening-data');
    if (savedScreeningData) {
      try {
        const parsedData = JSON.parse(savedScreeningData);
        setScreeningData(parsedData);
        
        // In edit mode, start with screening to allow changes
        // In new setup mode, go to setup phase if screening exists
        if (!isEditMode) {
          setCurrentPhase('setup');
        }
      } catch (error) {
        console.warn('Error parsing saved screening data:', error);
        // Clear invalid data
        localStorage.removeItem('handoff-screening-data');
      }
    }
  }, [isEditMode]);

  const handleScreeningComplete = (data: ScreeningData) => {
    setScreeningData(data);
    setCurrentPhase('setup');
  };

  const handleScreeningSkip = () => {
    // Create default screening data for skip scenario
    const defaultScreeningData: ScreeningData = {
      buyingStage: 'just-starting',
      experienceLevel: 'first-time',
      hasSpecificProperty: false,
      primaryGoal: 'primary-residence',
      timeframe: 'exploring',
      hasPreApproval: false,
      contractSigned: false,
      needsRealtor: false,
      nextAction: 'search-properties',
    };
    
    localStorage.setItem('handoff-screening-data', JSON.stringify(defaultScreeningData));
    setScreeningData(defaultScreeningData);
    setCurrentPhase('setup');
  };

  const handleSetupComplete = (data: PropertyData) => {
    // Mark both screening and setup as complete
    localStorage.setItem('handoff-initial-setup-complete', 'true');
    localStorage.setItem('handoff-questionnaire-complete', 'true');
    localStorage.setItem('handoff-property-data', JSON.stringify(data));
    
    // Create questionnaire responses for backward compatibility
    const questionnaireResponses = {
      agentName: data.realtor || '',
      propertyAddress: data.propertyAddress || '',
      propertyPrice: data.propertyPrice || '',
      closingDate: data.closingDate || '',
      inspectionDate: data.inspectionDate || '',
      ...(screeningData && {
        buyingStage: screeningData.buyingStage,
        experienceLevel: screeningData.experienceLevel,
        primaryGoal: screeningData.primaryGoal,
        timeframe: screeningData.timeframe,
      })
    };
    
    localStorage.setItem('handoff-questionnaire-responses', JSON.stringify(questionnaireResponses));
    
    onComplete();
  };

  const handleBackToScreening = () => {
    setCurrentPhase('screening');
  };

  const handleExitEdit = () => {
    if (onExitEditMode) {
      onExitEditMode();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Edit Mode Header */}
      {isEditMode && (
        <div className="sticky top-0 z-50 bg-card border-b border-border px-4 py-3">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExitEdit}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Summary
              </Button>
              <div className="h-6 w-px bg-border" />
              <div>
                <h2 className="font-medium">Edit Property Setup</h2>
                <p className="text-sm text-muted-foreground">Update your setup information</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExitEdit}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Edit Mode Notice */}
      {isEditMode && (
        <div className="max-w-2xl mx-auto px-4 pt-6">
          <Alert className="bg-blue-50 border-blue-200 mb-6">
            <AlertDescription className="text-blue-800">
              <strong>Editing Mode:</strong> You're updating your existing setup. Your progress and tasks will be preserved. 
              You can change your responses and they'll be saved automatically.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Main Content: Always use single-page setup */}
      <InitialPropertySetup
        onComplete={handleSetupComplete}
        isEditMode={isEditMode}
        screeningData={screeningData}
        forceAllSections={true}
      />
    </div>
  );
}