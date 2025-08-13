import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Bell,
  Database,
  Globe,
  Key,
  Monitor,
  RefreshCw,
  Save,
  Settings,
  Shield
} from 'lucide-react';

export default function AdminSettings() {
  const systemStatus = [
    { component: 'Resume Agent', status: 'Running', uptime: '99.5%', lastRestart: '3 days ago' },
    { component: 'Attendance Agent', status: 'Running', uptime: '99.8%', lastRestart: '5 days ago' },
    { component: 'Training Agent', status: 'Running', uptime: '99.2%', lastRestart: '1 day ago' },
    { component: 'Opportunity Agent', status: 'Running', uptime: '99.7%', lastRestart: '4 days ago' }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Running':
        return <Badge className="bg-success text-success-foreground">Running</Badge>;
      case 'Stopped':
        return <Badge variant="destructive">Stopped</Badge>;
      case 'Warning':
        return <Badge className="bg-warning text-warning-foreground">Warning</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <DashboardLayout userRole="Admin">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">System Settings</h1>
            <p className="text-muted-foreground">Configure system preferences and manage administrative settings</p>
          </div>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Save All Changes
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* General Settings */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Settings className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">General Settings</h3>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="systemName">System Name</Label>
                <Input
                  id="systemName"
                  placeholder="TechStrike"
                  defaultValue="TechStrike"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="adminEmail">Administrator Email</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  placeholder="admin@TechStrike.com"
                  defaultValue="admin@TechStrike.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timezone">System Timezone</Label>
                <Select defaultValue="utc">
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="est">EST (Eastern)</SelectItem>
                    <SelectItem value="pst">PST (Pacific)</SelectItem>
                    <SelectItem value="cst">CST (Central)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  placeholder="30"
                  defaultValue="30"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="companyDescription">Company Description</Label>
                <Textarea
                  id="companyDescription"
                  placeholder="Enter company description..."
                  defaultValue="Professional consultant management platform for optimizing workforce utilization."
                />
              </div>
            </div>
          </Card>

          {/* Notification Settings */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Bell className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Notification Settings</h3>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive system alerts via email</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Resume Update Alerts</p>
                  <p className="text-sm text-muted-foreground">Notify when consultants update resumes</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Attendance Anomalies</p>
                  <p className="text-sm text-muted-foreground">Alert for unusual attendance patterns</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Training Completions</p>
                  <p className="text-sm text-muted-foreground">Notify when training is completed</p>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Agent Performance Alerts</p>
                  <p className="text-sm text-muted-foreground">Alert for agent performance issues</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="alertEmail">Alert Email Recipients</Label>
                <Input
                  id="alertEmail"
                  placeholder="admin@TechStrike.com, manager@TechStrike.com"
                  defaultValue="admin@TechStrike.com"
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Security Settings */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Security Settings</h3>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Password Complexity</p>
                  <p className="text-sm text-muted-foreground">Enforce strong password requirements</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                <Input
                  id="passwordExpiry"
                  type="number"
                  placeholder="90"
                  defaultValue="90"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                <Input
                  id="maxLoginAttempts"
                  type="number"
                  placeholder="5"
                  defaultValue="5"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ipWhitelist">IP Whitelist</Label>
                <Textarea
                  id="ipWhitelist"
                  placeholder="192.168.1.0/24, 10.0.0.0/8"
                  rows={3}
                />
              </div>
            </div>
          </Card>

          {/* Agent Configuration */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Monitor className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Agent Configuration</h3>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="resumeProcessingInterval">Resume Processing Interval (minutes)</Label>
                <Input
                  id="resumeProcessingInterval"
                  type="number"
                  placeholder="5"
                  defaultValue="5"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="attendanceCheckInterval">Attendance Check Interval (minutes)</Label>
                <Input
                  id="attendanceCheckInterval"
                  type="number"
                  placeholder="15"
                  defaultValue="15"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="trainingUpdateInterval">Training Update Interval (hours)</Label>
                <Input
                  id="trainingUpdateInterval"
                  type="number"
                  placeholder="2"
                  defaultValue="2"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="opportunityMatchInterval">Opportunity Match Interval (hours)</Label>
                <Input
                  id="opportunityMatchInterval"
                  type="number"
                  placeholder="6"
                  defaultValue="6"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto-restart Failed Agents</p>
                  <p className="text-sm text-muted-foreground">Automatically restart agents on failure</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </Card>
        </div>

        {/* System Status */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">System Status</h3>
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Status
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {systemStatus.map((component, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <Monitor className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{component.component}</p>
                    <p className="text-sm text-muted-foreground">Uptime: {component.uptime}</p>
                  </div>
                </div>
                <div className="text-right">
                  {getStatusBadge(component.status)}
                  <p className="text-xs text-muted-foreground mt-1">
                    Last restart: {component.lastRestart}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <div className="flex gap-2">
            <Button variant="outline">
              <Key className="h-4 w-4 mr-2" />
              Generate API Key
            </Button>
            <Button variant="outline">
              <Database className="h-4 w-4 mr-2" />
              Backup Database
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline">
              <Globe className="h-4 w-4 mr-2" />
              System Logs
            </Button>
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Save All Settings
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}