import React from 'react';
import { cn } from './ui/utils';
import { Button } from './ui/button';
const handoffLogo = '/handoff-logo.svg';
import {
  Home,
  FileText,
  CheckSquare,
  Users,
  BookOpen,
  MessageSquare,
  BarChart3,
  ShoppingCart
} from 'lucide-react';
import type { PageType } from '../hooks/useNavigation';

interface NavigationItem {
  id: PageType;
  label: string;
  icon: React.ElementType;
  description?: string;
  badge?: string;
  category?: string;
}

interface DashboardLayoutProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
  setupData?: any;
  onSignOut: () => void;
  isPropertySetupComplete: boolean;
  children: React.ReactNode;
}

export default function DashboardLayout({ 
  currentPage, 
  onPageChange, 
  setupData, 
  onSignOut,
  isPropertySetupComplete,
  children 
}: DashboardLayoutProps) {

  // Navigation without AI features
  const navigationItems: NavigationItem[] = [
    // Prioritize Property Search as main entry
    {
      id: 'property',
      label: 'Property Search',
      icon: Home,
      category: 'Property'
    },
    {
      id: 'tasks',
      label: 'Transaction Checklist',
      icon: CheckSquare,
      category: 'Property'
    },


    // Keep Analytics but not as the default landing page
    {
      id: 'overview',
      label: 'Analytics & Budget',
      icon: BarChart3,
      category: 'Core'
    },
    
    // Transaction Details
    {
      id: 'vendor-marketplace',
      label: 'Vendor Marketplace',
      icon: ShoppingCart,
      category: 'Transaction Details'
    },
    
    // Communication & Support
    {
      id: 'communications',
      label: 'Communication Suite',
      icon: MessageSquare,
      category: 'Support'
    },
    {
      id: 'team',
      label: 'My Team',
      icon: Users,
      category: 'Support'
    },
    {
      id: 'documents',
      label: 'Offer & Document Hub',
      icon: FileText,
      category: 'Support'
    },
    {
      id: 'offer-builder',
      label: 'Offer Builder',
      icon: FileText,
      category: 'Support'
    },
    {
      id: 'resources',
      label: 'Education Hub',
      icon: BookOpen,
      category: 'Support'
    }
  ];






  // Group navigation items by category

  return (
    <div className="flex h-screen bg-bg">
      {/* Top horizontal header */}
      <header className="sticky top-0 z-40 w-full border-b border-line bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-4">
          <img src={handoffLogo} alt="Handoff" className="h-8 w-auto" />

          {/* Navigation */}
          <nav className="flex-1 overflow-x-auto">
            <div className="flex items-center gap-1 whitespace-nowrap">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "h-9 px-3 rounded-md",
                      isActive ? "bg-primary text-white" : "hover:bg-gray-100"
                    )}
                    onClick={() => onPageChange(item.id)}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => onPageChange('settings')}>Settings</Button>
            <Button variant="outline" size="sm" onClick={onSignOut}>Sign Out</Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}