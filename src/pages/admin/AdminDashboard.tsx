import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { KpiCard } from '@/components/shared/KpiCard';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/lib/supabaseClient.ts';
import {
  Activity,
  AlertCircle,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  FileCheck,
  Target,
  TrendingUp,
  Users
} from 'lucide-react';
import { useEffect, useState } from 'react';
export default function AdminDashboard() {
  const [consultantCount, setConsultantCount] = useState(0);
  useEffect(() => {
  const fetchUserCount = async () => {
    const { count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true }) // efficient count
      .eq('role', 'Consultant'); // Filter by role === 'consultant'

    if (!error && count !== null) {
      setConsultantCount(count);
    } else {
      console.error("Failed to fetch consultant count", error);
    }
  };

  fetchUserCount();
}, []);

const [consultantsWithResumeCount, setConsultantsWithResumeCount] = useState(0);
const [averageAttendance, setAverageAttendance] = useState(0); // as percentage 0-100
const [trainingProgress, setTrainingProgress] = useState(0); // as percentage 0-100

useEffect(() => {
  async function fetchKpiData() {
    try {
      // Fetch total consultants count
      const { count: totalConsultants, error: usersError } = await supabase
        .from('users')
        .select('id', { count: 'exact', head: true })
        .eq('role', 'Consultant');

      if (usersError) throw usersError;
      setConsultantCount(totalConsultants ?? 0);

      // Fetch count of consultants with updated resumes
      const { count: resumeCount, error: resumeError } = await supabase
        .from('consultant_resume')
        .select('id', { count: 'exact', head: true });

      if (resumeError) throw resumeError;
      setConsultantsWithResumeCount(resumeCount ?? 0);

      // Fetch average attendance (average of latest overall_attendance_percentage per user)
      const { data: attendanceData, error: attendanceError } = await supabase
        .from('attendance')
        .select('user_id, overall_attendance_percentage, attendance_date')
        .order('attendance_date', { ascending: false });

      if (attendanceError) throw attendanceError;

      // Map latest attendance record per user
      const latestAttendanceMap = new Map<string, number>();
      attendanceData?.forEach(record => {
        if (!latestAttendanceMap.has(record.user_id)) {
          latestAttendanceMap.set(record.user_id, record.overall_attendance_percentage);
        }
      });

      const avgAttendance =
        latestAttendanceMap.size > 0
          ? Array.from(latestAttendanceMap.values()).reduce((a, b) => a + b, 0) / latestAttendanceMap.size
          : 0;

      setAverageAttendance(avgAttendance);

      setTrainingProgress(78); // replace with real fetch if available

    } catch (error) {
      console.error('Error fetching KPI data:', error);
    }
  }

  fetchKpiData();
}, []);

  const agentPerformance = [
    { name: 'Resume Agent', status: 'Active', queue: 3, latency: '2.3s', errorRate: '2.0%' },
    { name: 'Attendance Agent', status: 'Active', queue: 1, latency: '1.8s', errorRate: '0.5%' },
    { name: 'Training Agent', status: 'Active', queue: 5, latency: '3.1s', errorRate: '1.2%' },
    { name: 'Opportunity Agent', status: 'Active', queue: 2, latency: '2.7s', errorRate: '0.8%' }
  ];

  const consultantDistribution = [
    { status: 'Active', count: 45, percentage: 75, color: 'bg-success' },
    { status: 'Training', count: 12, percentage: 20, color: 'bg-primary' },
    { status: 'Inactive', count: 3, percentage: 5, color: 'bg-muted' }
  ];

  const kpiData = [
  {
    title: 'Total Consultants',
    value: consultantCount.toString(),
    subtitle: `+${consultantCount * 0.1 | 0} this month`, // example increase stat
    icon: <Users className="h-5 w-5 text-primary" />,
    trend: 'up' as const,
  },
  {
    title: 'Resume Compliance',
    value: consultantCount > 0 ? `${Math.round((consultantsWithResumeCount / consultantCount) * 100)}%` : '0%',
    subtitle: `${consultantsWithResumeCount} of ${consultantCount} updated`,
    icon: <FileCheck className="h-5 w-5 text-success" />,
    trend: 'up' as const,
  },
  {
    title: 'Avg Attendance',
    value: `${averageAttendance.toFixed(0)}%`,
    subtitle: '+3% from last month', // optionally calculate real trend
    icon: <Calendar className="h-5 w-5 text-primary" />,
    trend: 'up' as const,
  },
  {
    title: 'Training Progress',
    value: `${trainingProgress}%`,
    subtitle: 'Overall completion',
    icon: <BookOpen className="h-5 w-5 text-warning" />,
    trend: 'neutral' as const,
  }
];


  const recentActivity = [
    { time: '2 min ago', event: 'Resume Agent processed 3 resumes', type: 'success' },
    { time: '5 min ago', event: 'New consultant onboarded: Sarah Wilson', type: 'info' },
    { time: '12 min ago', event: 'Training Agent completed batch processing', type: 'success' },
    { time: '18 min ago', event: 'Attendance anomaly detected for 2 consultants', type: 'warning' },
    { time: '25 min ago', event: 'Opportunity Agent matched 5 new positions', type: 'success' }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-warning" />;
      case 'info': return <Activity className="h-4 w-4 text-primary" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <DashboardLayout userRole="Admin">
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Monitor and manage your consultant pool</p>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-success" />
            <span className="text-sm text-success font-medium">All Systems Operational</span>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiData.map((kpi, index) => (
            <KpiCard key={index} {...kpi} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Agent Performance Overview */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Agent Performance Overview</h3>
            </div>
            <div className="space-y-4">
              {agentPerformance.map((agent, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-success rounded-full"></div>
                    <div>
                      <p className="font-medium">{agent.name}</p>
                      <p className="text-sm text-muted-foreground">Queue: {agent.queue} items</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">{agent.status}</Badge>
                    <div className="text-sm text-muted-foreground mt-1">
                      {agent.latency} • {agent.errorRate}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Consultant Status Distribution */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Consultant Status Distribution</h3>
            </div>
            <div className="space-y-4">
              {consultantDistribution.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                      <span className="font-medium">{item.status}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold">{item.count}</span>
                      <span className="text-sm text-muted-foreground ml-2">({item.percentage}%)</span>
                    </div>
                  </div>
                  <Progress value={item.percentage} className="h-2" />
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold">{consultantCount.toString() }</div>
                <div className="text-sm text-muted-foreground">Total Consultants</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Activity Feed */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Recent System Activity</h3>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors">
                {getActivityIcon(activity.type)}
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.event}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 text-center">
            <Target className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{consultantCount}</div>
            <p className="text-sm text-muted-foreground">Active Opportunities</p>
          </Card>
          
          <Card className="p-6 text-center">
            <BookOpen className="h-8 w-8 text-success mx-auto mb-2" />
            <div className="text-2xl font-bold">{consultantCount}</div>
            <p className="text-sm text-muted-foreground">Training Students</p>
          </Card>
          
          <Card className="p-6 text-center">
            <Calendar className="h-8 w-8 text-warning mx-auto mb-2" />
            <div className="text-2xl font-bold">{averageAttendance.toFixed(0)}%</div>
            <p className="text-sm text-muted-foreground">Attendance Rate</p>
          </Card>
          
          <Card className="p-6 text-center">
            <FileCheck className="h-8 w-8 text-destructive mx-auto mb-2" />
            <div className="text-2xl font-bold">0</div>
            <p className="text-sm text-muted-foreground">Pending Reviews</p>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}