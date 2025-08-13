import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { KpiCard } from '@/components/shared/KpiCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/lib/supabaseClient';
import {
  Activity,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  FileCheck,
  Search,
  Target,
  TrendingUp,
  Upload
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ConsultantDashboard() {
  const [username, setUsername] = useState('Consultant');
  const [resumeStatus, setResumeStatus] = useState<{ status: string; lastUpdated: string }>({ status: 'Not Updated', lastUpdated: '-' });
  const [attendanceRate, setAttendanceRate] = useState<number>(0);
  const [opportunitiesCount, setOpportunitiesCount] = useState<number>(0);
  const [newOpportunities, setNewOpportunities] = useState<number>(0);
  const [trainingProgress, setTrainingProgress] = useState<number>(0);

  useEffect(() => {
    const fetchUser = async () => {
      const wallet = localStorage.getItem('wallet');
      const email = localStorage.getItem('email'); // store email in localStorage at login
      if (!wallet) return;

      const { data, error } = await supabase
        .from('users')
        .select('username')
        .eq('email', email)
        .single();

      if (error) {
        console.error('Error fetching user:', error);
        return;
      }

      if (data?.username) {
        setUsername(data.username);
      }
    };

    fetchUser();
  }, []);

useEffect(() => {
  const wallet = localStorage.getItem('wallet');
  if (!wallet) return;
  const email = localStorage.getItem('email'); // store email in localStorage at login
  if (!email) return;
  async function fetchConsultantData() {
    try {
      // STEP 1 — Get user ID & username from wallet
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, username,email')
        .eq('email', email)
        .single();

      if (userError || !userData) {
        console.error('User not found for wallet:', wallet);
        return;
      }
      setUsername(userData.username);
      const userId = userData.id;

      // STEP 2 — Fetch resume info (consultant_resume)
      const { data: resumeData, error: resumeError } = await supabase
        .from('consultant_resume')
        .select('created_at')
        .eq('email', userData.username) // Or match by email if stored
        .single();

      if (!resumeError && resumeData) {
        const updatedDate = resumeData.created_at
          ? new Date(resumeData.created_at)
          : null;

        setResumeStatus({
          status: resumeData ? '-' : 'Uploaded',
          lastUpdated:
            updatedDate && !isNaN(updatedDate.getTime())
              ? updatedDate.toLocaleDateString()
              : '-',
        });
      } else {
        setResumeStatus({
          status: 'Uploaded',
          lastUpdated: '-',
        });
      }

      // STEP 3 — Fetch attendance rate
      const { data: attendanceData, error: attendanceError } = await supabase
        .from('attendance')
        .select('overall_attendance_percentage, attendance_date')
        .eq('user_id', userId)
        .order('attendance_date', { ascending: false })
        .limit(1);

      if (!attendanceError && attendanceData?.length) {
        setAttendanceRate(attendanceData[0].overall_attendance_percentage);
      } else {
        setAttendanceRate(0);
      }

      // STEP 4 — Fetch opportunities count (posted_jobs)
      const { data: opportunitiesData, error: oppError } = await supabase
        .from('posted_jobs')
        .select('id, created_at');

      if (!oppError && opportunitiesData) {
        const total = opportunitiesData.length;
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const newCount = opportunitiesData.filter(
          (opp) => new Date(opp.created_at) >= oneWeekAgo
        ).length;

        setOpportunitiesCount(total);
        setNewOpportunities(newCount);
      } else {
        setOpportunitiesCount(0);
        setNewOpportunities(0);
      }

      // STEP 5 — Training progress (table missing — setting default)
      setTrainingProgress(0);
    } catch (error) {
      console.error('Error fetching consultant KPI data:', error);
    }
  }

  fetchConsultantData();
}, []);



const kpiData = [
  {
    title: 'Resume Status',
    value: resumeStatus.status,
    subtitle: `Last updated ${resumeStatus.lastUpdated}`,
    icon: <FileCheck className="h-5 w-5 text-success" />,
    trend: 'up' as const,
  },
  {
    title: 'Attendance Rate',
    value: `${attendanceRate.toFixed(0)}%`,
    subtitle: '+5% from last month', // optionally dynamic
    icon: <Calendar className="h-5 w-5 text-primary" />,
    trend: 'up' as const,
  },
  {
    title: 'Opportunities',
    value: opportunitiesCount.toString(),
    subtitle: `${newOpportunities} new this week`,
    icon: <Target className="h-5 w-5 text-warning" />,
    trend: 'up' as const,
  },
  {
    title: 'Training Progress',
    value: `${trainingProgress}%`,
    subtitle: trainingProgress < 100 ? 'In Progress' : 'Completed',
    icon: <BookOpen className="h-5 w-5 text-primary" />,
    trend: trainingProgress === 100 ? 'up' : 'neutral',
  }
];


  const workflowItems = [
    { title: 'Resume Updated', completed: true, icon: FileCheck },
    { title: 'Attendance Reported', completed: true, icon: Calendar },
    { title: 'Opportunities Documented', completed: false, icon: Target },
    { title: 'Training Completed', completed: false, icon: BookOpen }
  ];

  const skills = ['React', 'TypeScript', 'Node.js', 'AWS', 'Python', 'Docker', 'Kubernetes', 'GraphQL'];

  return (
    <DashboardLayout userRole="Consultant">
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {username}</h1>
            <p className="text-muted-foreground">Here's your consultant overview</p>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-success" />
            <span className="text-sm text-success font-medium">Online</span>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiData.map((kpi, index) => (
            <KpiCard key={index} {...kpi} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Real-Time Workflow Progress */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Real-Time Workflow Progress</h3>
            </div>
            <div className="space-y-4">
              {workflowItems.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <div className={`p-2 rounded-full ${item.completed ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'}`}>
                    {item.completed ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                  </div>
                  <span className={`font-medium ${item.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {item.title}
                  </span>
                  {item.completed && (
                    <Badge variant="secondary" className="ml-auto">Completed</Badge>
                  )}
                </div>
              ))}
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Overall Progress</span>
                  <span>50%</span>
                </div>
                <Progress value={50} className="h-2" />
              </div>
            </div>
          </Card>

          {/* Your Skills */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Your Skills</h3>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
              <div className="space-y-3 pt-4 border-t">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>React/TypeScript</span>
                    <span>Expert</span>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Cloud Technologies</span>
                    <span>Advanced</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Backend Development</span>
                    <span>Intermediate</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-primary" />
              <div className="text-center">
                <div className="font-medium">Update Resume</div>
                <div className="text-sm text-muted-foreground">Upload new version</div>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Eye className="h-8 w-8 text-primary" />
              <div className="text-center">
                <div className="font-medium">View Training</div>
                <div className="text-sm text-muted-foreground">Continue learning</div>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Search className="h-8 w-8 text-primary" />
              <div className="text-center">
                <div className="font-medium">Browse Opportunities</div>
                <div className="text-sm text-muted-foreground">Find new projects</div>
              </div>
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}