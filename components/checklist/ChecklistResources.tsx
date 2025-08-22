import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { ExternalLink, HelpCircle, FileText, DollarSign } from 'lucide-react';

export default function ChecklistResources() {
  return (
    <div className="space-y-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Additional Resources</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full justify-start">
            <HelpCircle className="w-4 h-4 mr-2" />
            Frequently Asked Questions
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <FileText className="w-4 h-4 mr-2" />
            Learn More About This Step
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <DollarSign className="w-4 h-4 mr-2" />
            View Pricing & Plans
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full justify-start">
            <ExternalLink className="w-4 h-4 mr-2" />
            Preview Related Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

