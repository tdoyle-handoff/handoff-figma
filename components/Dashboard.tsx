import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Home, FileText, DollarSign, Users, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { useIsMobile } from './ui/use-mobile';
import { usePropertyContext } from './PropertyContext';
import { useTaskContext } from './TaskContext';

interface SetupData {
  buyerEmail: string;
  buyerName: string;
}

interface DashboardProps {
  setupData: SetupData | null;
}

// Define the stages of the home buying process
const HOME_BUYING_STAGES = [
  {
    id: 'pre-approval',
    title: 'Pre-Approval',
    description: 'Get pre-approved for financing',
    icon: DollarSign,
    status: 'pending' as 'completed' | 'current' | 'pending'
  },
  {
    id: 'house-hunting',
    title: 'House Hunting',
    description: 'Find your perfect home',
    icon: Home,
    status: 'pending' as 'completed' | 'current' | 'pending'
  },
  {
    id: 'under-contract',
    title: 'Under Contract',
    description: 'Offer accepted, moving toward closing',
    icon: FileText,
    status: 'pending' as 'completed' | 'current' | 'pending'
  },
  {
    id: 'inspections',
    title: 'Inspections',
    description: 'Complete property inspections',
    icon: AlertCircle,
    status: 'pending' as 'completed' | 'current' | 'pending'
  },
  {
    id: 'closing',
    title: 'Closing',
    description: 'Finalize the purchase',
    icon: CheckCircle,
    status: 'pending' as 'completed' | 'current' | 'pending'
  }
];

// What to expect information for each stage
const STAGE_EXPECTATIONS = {
  'pre-approval': {
    timeline: '1-3 days',
    tasks: [
      'Submit financial documents',
      'Credit check and verification',
      'Receive pre-approval letter'
    ],
    tips: 'Gather income statements, tax returns, and bank statements to speed up the process.'
  },
  'house-hunting': {
    timeline: '2-8 weeks',
    tasks: [
      'Define your criteria and budget',
      'Schedule property viewings',
      'Research neighborhoods'
    ],
    tips: 'Make a list of must-haves vs. nice-to-haves to stay focused during your search.'
  },
  'under-contract': {
    timeline: '30-45 days',
    tasks: [
      'Sign purchase agreement',
      'Submit financing application',
      'Schedule inspections'
    ],
    tips: 'Stay responsive to requests from your lender and real estate agent to avoid delays.'
  },
  'inspections': {
    timeline: '7-14 days',
    tasks: [
      'Complete home inspection',
      'Review inspection report',
      'Negotiate repairs if needed'
    ],
    tips: 'Attend the inspection if possible to ask questions and understand any issues firsthand.'
  },
  'closing': {
    timeline: '1-3 days',
    tasks: [
      'Final walkthrough',
      'Review closing documents',
      'Transfer funds and sign papers'
    ],
    tips: 'Bring a certified check for closing costs and a valid ID. Review all documents carefully.'
  }
};

export default function Dashboard({ setupData }: DashboardProps) {
  const isMobile = useIsMobile();
  const { propertyData } = usePropertyContext();
  const { getTotalTasksCount, getTotalDueTasks, getTasksByCategory } = useTaskContext();
  const [currentStage, setCurrentStage] = useState('pre-approval');
  const [selectedStageInfo, setSelectedStageInfo] = useState(STAGE_EXPECTATIONS['pre-approval']);

  // Determine current stage based on property data and questionnaire completion
  useEffect(() => {
    // Check if questionnaire is completed and property details exist
    const questionnaireComplete = localStorage.getItem('handoff-questionnaire-complete') === 'true';
    const preQuestionnaireData = localStorage.getItem('handoff-pre-questionnaire');
    
    let stage = 'pre-approval';
    
    if (preQuestionnaireData) {
      try {
        const parsedData = JSON.parse(preQuestionnaireData);
        if (parsedData.hasExistingHome && parsedData.isUnderContract) {
          stage = 'under-contract';
        } else if (parsedData.hasExistingHome) {
          stage = 'house-hunting';
        } else if (questionnaireComplete) {
          stage = 'house-hunting';
        }
      } catch (error) {
        console.warn('Error parsing pre-questionnaire data:', error);
      }
    }
    
    setCurrentStage(stage);
    setSelectedStageInfo(STAGE_EXPECTATIONS[stage as keyof typeof STAGE_EXPECTATIONS]);
  }, [propertyData]);

  // Update stages based on current progress
  const updatedStages = HOME_BUYING_STAGES.map(stage => {
    if (stage.id === currentStage) {
      return { ...stage, status: 'current' as const };
    } else if (HOME_BUYING_STAGES.findIndex(s => s.id === stage.id) < HOME_BUYING_STAGES.findIndex(s => s.id === currentStage)) {
      return { ...stage, status: 'completed' as const };
    } else {
      return { ...stage, status: 'pending' as const };
    }
  });

  const handleStageClick = (stageId: string) => {
    setSelectedStageInfo(STAGE_EXPECTATIONS[stageId as keyof typeof STAGE_EXPECTATIONS]);
  };

  const getStageColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'current':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStageIconColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'current':
        return 'text-blue-600';
      default:
        return 'text-gray-400';
    }
  };

  const totalTasks = getTotalTasksCount();
  const dueTasks = getTotalDueTasks();
  const completionPercentage = totalTasks > 0 ? Math.round(((totalTasks - dueTasks) / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6 p-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-semibold`}>
          Welcome back, {setupData?.buyerName || 'there'}!
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your home buying progress and upcoming tasks.
        </p>
      </div>

      {/* Enhanced Progress Tracker */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="w-5 h-5" />
            Your Home Buying Journey
          </CardTitle>
          <CardDescription>
            Track your progress through each stage of the home buying process
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Horizontal Progress Tracker */}
          <div className="relative">
            <div className={`flex ${isMobile ? 'flex-col space-y-4' : 'items-center justify-between'}`}>
              {updatedStages.map((stage, index) => {
                const Icon = stage.icon;
                const isLast = index === updatedStages.length - 1;
                
                return (
                  <div key={stage.id} className={`flex ${isMobile ? 'w-full' : 'flex-col'} items-center ${isMobile ? 'flex-row' : ''}`}>
                    {/* Stage Item */}
                    <button
                      onClick={() => handleStageClick(stage.id)}
                      className={`
                        flex ${isMobile ? 'flex-row w-full' : 'flex-col'} items-center 
                        ${isMobile ? 'p-3 rounded-lg' : 'p-2'} gap-2 
                        transition-all duration-200 hover:scale-105
                        ${stage.status === 'current' ? 'ring-2 ring-blue-200' : ''}
                      `}
                    >
                      {/* Icon Circle */}
                      <div className={`
                        w-12 h-12 rounded-full border-2 flex items-center justify-center
                        ${getStageColor(stage.status)} transition-all duration-200
                        ${isMobile ? 'flex-shrink-0' : ''}
                      `}>
                        <Icon className={`w-5 h-5 ${getStageIconColor(stage.status)}`} />
                      </div>
                      
                      {/* Stage Info */}
                      <div className={`${isMobile ? 'flex-1 text-left ml-2' : 'text-center mt-2'}`}>
                        <div className={`font-medium ${isMobile ? 'text-sm' : 'text-xs'}`}>
                          {stage.title}
                        </div>
                        <div className={`text-xs text-muted-foreground ${isMobile ? 'hidden' : 'block'}`}>
                          {stage.description}
                        </div>
                      </div>

                      {/* Status Badge */}
                      {stage.status === 'current' && (
                        <Badge variant="default" className={`${isMobile ? 'ml-auto' : 'mt-1'} text-xs`}>
                          Current
                        </Badge>
                      )}
                      {stage.status === 'completed' && (
                        <CheckCircle className={`w-4 h-4 text-green-600 ${isMobile ? 'ml-auto' : 'mt-1'}`} />
                      )}
                    </button>

                    {/* Arrow (Desktop) or Connector (Mobile) */}
                    {!isLast && (
                      <div className={`${isMobile ? 'hidden' : 'flex'} items-center mx-4`}>
                        <div className={`progress-arrow ${
                          stage.status === 'completed' ? 'progress-arrow-completed' : 'progress-arrow-pending'
                        }`}>
                          <div className="progress-arrow-line"></div>
                          <div className="progress-arrow-head"></div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* What to Expect Section */}
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">What to Expect: {updatedStages.find(s => s.id === currentStage)?.title}</h3>
            <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'} gap-4`}>
              {/* Timeline */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-sm">Timeline</div>
                  <div className="text-sm text-muted-foreground">{selectedStageInfo.timeline}</div>
                </div>
              </div>

              {/* Key Tasks */}
              <div className={`${isMobile ? 'col-span-1' : 'col-span-2'}`}>
                <div className="font-medium text-sm mb-2">Key Tasks</div>
                <ul className="space-y-1">
                  {selectedStageInfo.tasks.map((task, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <div className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Pro Tip */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="font-medium text-sm text-blue-900 mb-1">💡 Pro Tip</div>
              <div className="text-sm text-blue-800">{selectedStageInfo.tips}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Property Information */}
      {propertyData?.address && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              Property Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Address</div>
                <div className="font-medium">{propertyData.address}</div>
              </div>
              {propertyData.purchasePrice && (
                <div>
                  <div className="text-sm text-muted-foreground">Purchase Price</div>
                  <div className="font-medium">${propertyData.purchasePrice.toLocaleString()}</div>
                </div>
              )}
              {propertyData.mustHaveFeatures && propertyData.mustHaveFeatures.length > 0 && (
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Must-Have Features</div>
                  <div className="flex flex-wrap gap-2">
                    {propertyData.mustHaveFeatures.slice(0, 5).map((feature, index) => (
                      <Badge key={index} variant="secondary">{feature}</Badge>
                    ))}
                    {propertyData.mustHaveFeatures.length > 5 && (
                      <Badge variant="outline">+{propertyData.mustHaveFeatures.length - 5} more</Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Task Overview */}
      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-6`}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Task Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Overall Progress</span>
                <span className="text-sm font-medium">{completionPercentage}%</span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="text-center">
                  <div className="text-2xl font-semibold text-blue-600">{totalTasks - dueTasks}</div>
                  <div className="text-xs text-muted-foreground">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold text-orange-600">{dueTasks}</div>
                  <div className="text-xs text-muted-foreground">Remaining</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Your Team
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground mb-3">
                Build your team of professionals to help with your purchase
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Real Estate Agent</span>
                  <Badge variant="secondary">Added</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Lender</span>
                  <Badge variant="outline">Add</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Inspector</span>
                  <Badge variant="outline">Add</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Attorney</span>
                  <Badge variant="outline">Add</Badge>
                </div>
              </div>
              
              <Button variant="outline" size="sm" className="w-full mt-3">
                Manage Team
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks for your current stage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-4'} gap-3`}>
            <Button variant="outline" className="justify-start">
              <FileText className="w-4 h-4 mr-2" />
              View Tasks
            </Button>
            <Button variant="outline" className="justify-start">
              <DollarSign className="w-4 h-4 mr-2" />
              Calculate Mortgage
            </Button>
            <Button variant="outline" className="justify-start">
              <Home className="w-4 h-4 mr-2" />
              Property Details
            </Button>
            <Button variant="outline" className="justify-start">
              <Users className="w-4 h-4 mr-2" />
              Contact Team
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}