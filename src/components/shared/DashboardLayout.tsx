import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
  userRole: 'Consultant' | 'Admin';
}

export function DashboardLayout({ children, userRole }: DashboardLayoutProps) {
  const navigate = useNavigate();

  const handleSignOut = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar userRole={userRole} />
      <main className="flex-1 overflow-auto">
        {/* Header with Sign Out button */}
        <header className="flex justify-end items-center p-4 border-b border-border">
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </header>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}