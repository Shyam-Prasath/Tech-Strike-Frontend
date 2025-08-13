import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileText,
  Home,
  LogOut,
  Monitor,
  Settings,
  Shield,
  Target,
  User,
  Users
} from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface SidebarProps {
  userRole: 'Consultant' | 'Admin';
}

export function Sidebar({ userRole }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const consultantItems = [
    { icon: Home, label: 'Dashboard', path: '/consultant/dashboard' },
    { icon: User, label: 'My Profile', path: '/consultant/profile' },
    { icon: FileText, label: 'Resume', path: '/consultant/resume' },
    { icon: Calendar, label: 'Attendance', path: '/consultant/attendance' },
    { icon: BookOpen, label: 'Training', path: '/consultant/training' },
    { icon: Target, label: 'Opportunities', path: '/consultant/opportunities' },
  ];

  const adminItems = [
    { icon: Home, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Consultants', path: '/admin/consultants' },
    { icon: Monitor, label: 'Alert And Notification', path: '/admin/agents' },
    { icon: BarChart3, label: 'Reports', path: '/admin/reports' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  const items = userRole === 'Consultant' ? consultantItems : adminItems;

  const handleSignOut = () => {
    navigate('/signin');
  };

  return (
    <div className={cn(
      "bg-card border-r border-border flex flex-col transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div>
              <h2 className="text-lg font-semibold bg-gradient-primary bg-clip-text text-transparent">
                TechStrike
              </h2>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Shield className="h-3 w-3" />
                {userRole}
              </p>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                "hover:bg-accent hover:text-accent-foreground",
                isActive && "bg-primary text-primary-foreground shadow-md",
                collapsed && "justify-center"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Sign Out */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          onClick={handleSignOut}
          className={cn(
            "w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10",
            collapsed && "justify-center px-0"
          )}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span className="ml-3">Sign Out</span>}
        </Button>
      </div>
    </div>
  );
}