import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/lib/supabaseClient';
import {
  BookOpen,
  Calendar,
  Clock,
  Edit,
  FileCheck,
  Mail,
  MapPin,
  Phone,
  Shield,
  Target,
  User
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ConsultantProfile() {
  const [personalInfo, setPersonalInfo] = useState<{
    name: string;
    email: string;
    phone: string;
    location: string;
    joinDate: string;
    role: string;
    department: string;
  } | null>(null);

useEffect(() => {
    const wallet = localStorage.getItem('wallet');
    if (!wallet) return;
    const email = localStorage.getItem('email'); // store email in localStorage at login
    supabase
      .from('users')
      .select('username, email, role, created_at')
      .eq('email', email)
      .maybeSingle()
      .then(({ data, error }) => {
  if (error) {
    console.error('Error loading user info:', error.message);
  } else if (data) {
    setPersonalInfo({
      name: data.username, // map `username` from DB to `name`
      email: data.email,
      phone: '+91 94243444474', // if not stored in DB
      location: 'chennai, TamilNadu', // static or default
      joinDate: new Date(data.created_at).toLocaleDateString('default', {
        month: 'long',
        year: 'numeric',
      }),
      role: data.role,
      department: 'Development', // default or from another field
    });
  }
});

}, []);

  if (!personalInfo) {
    return (
      <DashboardLayout userRole="Consultant">
        <div className="text-center p-8">Loading profile…</div>
      </DashboardLayout>
    );
  }


  const skills = [
    { name: 'React', level: 90 },
    { name: 'TypeScript', level: 85 },
    { name: 'Node.js', level: 80 },
    { name: 'AWS', level: 75 },
    { name: 'Python', level: 70 },
    { name: 'Docker', level: 65 }
  ];

  const statusOverview = [
    { label: 'Resume Status', value: 'Updated', status: 'success', icon: FileCheck },
    { label: 'Training Progress', value: '0%', status: 'progress', icon: BookOpen },
    { label: 'Attendance Rate', value: '85%', status: 'good', icon: Calendar },
    { label: 'Opportunities', value: '1 Active', status: 'info', icon: Target }
  ];

  const timeline = [
    { date: '2024-01-15', event: 'Resume updated to v3.2', type: 'update' },
    { date: '2024-01-10', event: 'Completed AWS Certification training', type: 'achievement' },
    { date: '2024-01-05', event: 'Started new project: E-commerce Platform', type: 'project' },
    { date: '2023-12-28', event: 'Attendance reported for December', type: 'attendance' },
    { date: '2023-12-20', event: 'Skills assessment completed', type: 'assessment' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-success';
      case 'progress': return 'text-primary';
      case 'good': return 'text-success';
      case 'info': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <DashboardLayout userRole="Consultant">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Personal Information */}
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center gap-2 mb-6">
              <User className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Personal Information</h3>
            </div>
            
            <div className="flex items-start gap-6 mb-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback className="text-lg font-semibold">AK</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-3">
                <div>
                  <h2 className="text-2xl font-bold">{personalInfo.name}</h2>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span>{personalInfo.role}</span>
                    <span>•</span>
                    <span>{personalInfo.department}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{personalInfo.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{personalInfo.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{personalInfo.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Joined {personalInfo.joinDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Status Overview */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Status Overview</h3>
            <div className="space-y-4">
              {statusOverview.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <item.icon className={`h-4 w-4 ${getStatusColor(item.status)}`} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <Badge variant="secondary">{item.value}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Skills & Expertise */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Skills & Expertise</h3>
            <div className="space-y-4">
              {skills.map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-muted-foreground">{skill.level}%</span>
                  </div>
                  <Progress value={skill.level} className="h-2" />
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-6">
              <BookOpen className="h-4 w-4 mr-2" />
              Take Skills Assessment
            </Button>
          </Card>

          {/* Timeline */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Recent Activity</h3>
            </div>
            <div className="space-y-4">
              {timeline.map((item, index) => (
                <div key={index} className="flex gap-3 pb-4 last:pb-0 border-b last:border-b-0">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{item.event}</p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}