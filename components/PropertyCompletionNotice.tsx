import React from 'react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { AlertCircle, CheckCircle, Home, ArrowRight } from 'lucide-react';
import { usePropertyContext } from './PropertyContext';

interface PropertyCompletionNoticeProps {
  onNavigateToProperty: () => void;
  currentPage: string;
}

export function PropertyCompletionNotice({ 
  onNavigateToProperty, 
  currentPage 
}: PropertyCompletionNoticeProps) {
  const { getCompletionStatus } = usePropertyContext();
  const status = getCompletionStatus();

  const getPageDisplayName = (page: string) => {
    // Add null/undefined check
    if (!page || typeof page !== 'string') {
      return 'Page';
    }
    
    switch (page) {
      case 'overview':
        return 'Dashboard';
      case 'tasks':
        return 'Tasks';
      case 'documents':
        return 'Documents';
      case 'team':
        return 'Team';
      case 'financing':
        return 'Financing';
      case 'legal':
        return 'Legal';
      case 'inspections':
        return 'Inspections';
      case 'insurance':
        return 'Insurance';
      case 'communications':
        return 'Communications';
      case 'resources':
        return 'Resources';
      default:
        return page.charAt(0).toUpperCase() + page.slice(1);
    }
  };

  return (
    <div className="w-full h-full min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Home className="w-8 h-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl mb-2">
              Complete Your Property Details First
            </CardTitle>
            <CardDescription className="text-lg">
              To access the {getPageDisplayName(currentPage)} section, please complete your property questionnaire.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Alert className="border-amber-200 bg-amber-50">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800">Property Information Required</AlertTitle>
            <AlertDescription className="text-amber-700">
              Your property details help us customize your dashboard, generate relevant tasks, 
              and provide personalized guidance throughout your real estate transaction.
            </AlertDescription>
          </Alert>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Current Progress</h4>
              <Badge variant={status.completed ? "default" : "secondary"}>
                {Math.round(status.percentage)}% Complete
              </Badge>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div 
                className="bg-primary h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${status.percentage}%` }}
              ></div>
            </div>

            {status.missingFields.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600 font-medium">
                  Missing Information:
                </p>
                <div className="flex flex-wrap gap-2">
                  {status.missingFields.slice(0, 6).map((field, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {field}
                    </Badge>
                  ))}
                  {status.missingFields.length > 6 && (
                    <Badge variant="outline" className="text-xs">
                      +{status.missingFields.length - 6} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">What you can access after completion:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Personalized Dashboard</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Customized Task List</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Timeline Tracking</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Progress Monitoring</span>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button 
              onClick={onNavigateToProperty}
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all"
            >
              Complete Property Details
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          <p className="text-center text-sm text-gray-500">
            This usually takes 5-10 minutes to complete
          </p>
        </CardContent>
      </Card>
    </div>
  );
}