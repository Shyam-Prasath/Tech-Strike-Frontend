import { Button } from '@/components/ui/button';
import { Activity, BarChart3, Brain, LogIn, Shield, Target, UserPlus, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10">
      {/* Header with Sign In/Create Account buttons */}
      <header className="flex justify-between items-center p-6">
        <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          TechStrike
        </div>
        <div className="flex gap-3">
          <Link to="/signin">
            <Button variant="ghost" size="sm">
              <LogIn className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          </Link>
          <Link to="/signup">
            <Button size="sm">
              <UserPlus className="h-4 w-4 mr-2" />
              Create Account
            </Button>
          </Link>
        </div>
      </header>

      <div className="flex items-center justify-center p-4 min-h-[calc(100vh-88px)]">
        <div className="text-center max-w-6xl mx-auto">
          <div className="mb-12">
            <h1 className="text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6">
              TechStrike
            </h1>
            <p className="text-2xl text-muted-foreground mb-4">Pool Consultant Management System</p>
            <p className="text-lg text-muted-foreground mb-6 max-w-3xl mx-auto">
              Professional-grade monitoring and management with AI-based multi-agent architecture. 
              Streamline your consultant operations with intelligent automation and comprehensive insights.
            </p>
            <div className="flex justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                <span>Performance Tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-success" />
                <span>AI-Powered Insights</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-warning" />
                <span>Real-time Monitoring</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="p-6 bg-card border border-border rounded-xl hover:shadow-lg transition-shadow">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Consultant Management</h3>
              <p className="text-sm text-muted-foreground">Complete visibility into consultant utilization, performance metrics, and skill assessments</p>
            </div>
            
            <div className="p-6 bg-card border border-border rounded-xl hover:shadow-lg transition-shadow">
              <Activity className="h-12 w-12 text-success mx-auto mb-4" />
              <h3 className="font-semibold mb-2">AI Agent Monitoring</h3>
              <p className="text-sm text-muted-foreground">Advanced Resume, Attendance, Training, and Opportunity agents with real-time analytics</p>
            </div>
            
            <div className="p-6 bg-card border border-border rounded-xl hover:shadow-lg transition-shadow">
              <Shield className="h-12 w-12 text-warning mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Role-Based Access</h3>
              <p className="text-sm text-muted-foreground">Secure consultant and admin panels with isolated access and granular permissions</p>
            </div>

            <div className="p-6 bg-card border border-border rounded-xl hover:shadow-lg transition-shadow">
              <BarChart3 className="h-12 w-12 text-info mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Analytics & Reports</h3>
              <p className="text-sm text-muted-foreground">Comprehensive reporting suite with department-wise performance and KPI tracking</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 mb-12">
            <h2 className="text-2xl font-semibold mb-6">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <h4 className="font-medium mb-2 text-primary">For Consultants</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Resume management with ATA scoring</li>
                  <li>• Attendance tracking and reporting</li>
                  <li>• Training progress monitoring</li>
                  <li>• Opportunity discovery and management</li>
                  <li>• Skills assessment and development</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-success">For Administrators</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Multi-agent system monitoring</li>
                  <li>• Consultant performance analytics</li>
                  <li>• Department-wise reporting</li>
                  <li>• System configuration and settings</li>
                  <li>• Resource allocation optimization</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
