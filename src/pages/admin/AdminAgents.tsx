import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/lib/supabaseClient.ts';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Eye,
  Minus,
  Monitor,
  Pause,
  RotateCcw,
  TrendingDown,
  TrendingUp,
  Zap
} from 'lucide-react';
import { useEffect, useState } from 'react';
interface AppliedJob {
  id: string
  name: string
  email: string
  skills: string[]
  applied_job: string
  applied_company: string
  applied_at: string
}

export default function AdminAgents() {

  const [appliedJobs, setAppliedJobs] = useState<any[]>([]);

const [totalConsultants, setTotalConsultants] = useState(0)

const [systemMetrics, setSystemMetrics] = useState([
  { label: 'Total Requests', value: 0, trend: 'up', change: '+12%' },
  { label: 'Average Response Time', value: '2.5s', trend: 'down', change: '-8%' },
  { label: 'Success Rate', value: '98.9%', trend: 'up', change: '+0.3%' },
  { label: 'Active Connections', value: '45', trend: 'neutral', change: '0%' }
]);



useEffect(() => {
  const fetchConsultantCount = async () => {
    const { count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'Consultant');

    if (error) {
      console.error('Error fetching consultant count:', error);
    } else {
      setTotalConsultants(count || 0);

      // 🔁 Update "Total Requests" in system metrics
      setSystemMetrics((prevMetrics) =>
        prevMetrics.map((metric) =>
          metric.label === 'Total Requests'
            ? { ...metric, value: count || 0 }
            : metric
        )
      );
    }
  };

  fetchConsultantCount();
}, []);



  const agents = [
    {
      id: 1,
      name: 'Resume Agent',
      status: 'Active',
      queueSize: 3,
      avgLatency: 2.3,
      errorRate: 2.0,
      lastActivity: '2 minutes ago',
      description: 'Processes and analyzes consultant resumes, extracts skills, and calculates ATA scores for optimization.',
      uptime: 99.5,
      processedToday: 47,
      successRate: 98.0,
      healthScore: 95
    },
    {
      id: 2,
      name: 'Attendance Agent',
      status: 'Active',
      queueSize: 1,
      avgLatency: 1.8,
      errorRate: 0.5,
      lastActivity: '1 minute ago',
      description: 'Monitors consultant attendance patterns, tracks working hours, and identifies attendance anomalies.',
      uptime: 99.8,
      processedToday: 156,
      successRate: 99.5,
      healthScore: 98
    },
    {
      id: 3,
      name: 'Training Agent',
      status: 'Active',
      queueSize: 5,
      avgLatency: 3.1,
      errorRate: 1.2,
      lastActivity: '5 minutes ago',
      description: 'Manages training programs, tracks progress, assigns courses, and monitors skill development.',
      uptime: 99.2,
      processedToday: 89,
      successRate: 98.8,
      healthScore: 92
    },
    {
      id: 4,
      name: 'Opportunity Agent',
      status: 'Active',
      queueSize: 2,
      avgLatency: 2.7,
      errorRate: 0.8,
      lastActivity: '3 minutes ago',
      description: 'Matches consultants with opportunities, analyzes skill requirements, and optimizes project assignments.',
      uptime: 99.7,
      processedToday: 34,
      successRate: 99.2,
      healthScore: 96
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'Warning':
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case 'Error':
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-success text-success-foreground">Active</Badge>;
      case 'Warning':
        return <Badge className="bg-warning text-warning-foreground">Warning</Badge>;
      case 'Error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-success" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 95) return 'text-success';
    if (score >= 85) return 'text-primary';
    if (score >= 70) return 'text-warning';
    return 'text-destructive';
  };

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      const { data, error } = await supabase
        .from('applied_jobs')
        .select('*')
        .order('applied_at', { ascending: false })

      if (error) {
        console.error('Error fetching applied jobs:', error)
      } else {
        setAppliedJobs(data)
      }
    }

    fetchAppliedJobs()
  }, [])


  return (
    <DashboardLayout userRole="Admin">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Alert And Notifications</h1>
            <p className="text-muted-foreground">Monitor and manage AI agents performance</p>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-success" />
            <span className="text-sm text-success font-medium">All Agents Operational</span>
          </div>
        </div>


        {/* Applied Jobs Overview */}
    <div className="p-6  shadow rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Applied Jobs Overview</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm bg-white">
          <thead>
            <tr className="bg-white text-left">
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Skills</th>
              <th className="p-3 border">Applied Job</th>
              <th className="p-3 border">Company</th>
              <th className="p-3 border">Applied At</th>
            </tr>
          </thead>
          <tbody>
            {appliedJobs.length > 0 ? (
              appliedJobs.map((job) => (
                <tr key={job.id} className="border-t bg-white text-black">
                  <td className="p-3 border">{job.name}</td>
                  <td className="p-3 border">{job.email}</td>
                  <td className="p-3 border">{job.skills.join(', ')}</td>
                  <td className="p-3 border">{job.applied_job}</td>
                  <td className="p-3 border">{job.applied_company}</td>
                  <td className="p-3 border">
                    {new Date(job.applied_at).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-3 text-center">
                  No jobs applied yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>


        
        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {systemMetrics.map((metric, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {getTrendIcon(metric.trend)}
                    <span className={`text-sm font-medium ${
                      metric.trend === 'up' ? 'text-success' : 
                      metric.trend === 'down' ? 'text-destructive' : 
                      'text-muted-foreground'
                    }`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
                <Monitor className="h-8 w-8 text-primary" />
              </div>
            </Card>
          ))}
        </div>

        {/* Agent Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {agents.map((agent) => (
            <Card key={agent.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getStatusIcon(agent.status)}
                  <div>
                    <h3 className="text-lg font-semibold">{agent.name}</h3>
                    <p className="text-sm text-muted-foreground">{agent.description}</p>
                  </div>
                </div>
                {getStatusBadge(agent.status)}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Database className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Queue Size</span>
                    </div>
                    <p className="text-xl font-bold">{agent.queueSize}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Avg Latency</span>
                    </div>
                    <p className="text-xl font-bold">{agent.avgLatency}s</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Error Rate</span>
                    </div>
                    <p className="text-xl font-bold">{agent.errorRate}%</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Health Score</span>
                    </div>
                    <p className={`text-xl font-bold ${getHealthScoreColor(agent.healthScore)}`}>
                      {agent.healthScore}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Uptime</span>
                    <span>{agent.uptime}%</span>
                  </div>
                  <Progress value={agent.uptime} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Success Rate</span>
                    <span>{agent.successRate}%</span>
                  </div>
                  <Progress value={agent.successRate} className="h-2" />
                </div>
              </div>

              <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
                <span>Processed today: {agent.processedToday} items</span>
                <span>Last activity: {agent.lastActivity}</span>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Logs
                </Button>
                <Button variant="outline" size="sm">
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
                <Button variant="outline" size="sm">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Restart
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Real-time Activity Log */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Real-time Activity Log</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
              <CheckCircle className="h-4 w-4 text-success mt-0.5" />
              <div>
                <p className="text-sm font-medium">Resume Agent processed batch of 5 resumes</p>
                <p className="text-xs text-muted-foreground">2 minutes ago • Average processing time: 1.8s</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
              <CheckCircle className="h-4 w-4 text-success mt-0.5" />
              <div>
                <p className="text-sm font-medium">Attendance Agent completed daily report generation</p>
                <p className="text-xs text-muted-foreground">5 minutes ago • 156 records processed</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
              <AlertTriangle className="h-4 w-4 text-warning mt-0.5" />
              <div>
                <p className="text-sm font-medium">Training Agent queue size increased to 5 items</p>
                <p className="text-xs text-muted-foreground">8 minutes ago • Monitoring for performance impact</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
              <CheckCircle className="h-4 w-4 text-success mt-0.5" />
              <div>
                <p className="text-sm font-medium">Opportunity Agent matched 3 consultants to new projects</p>
                <p className="text-xs text-muted-foreground">12 minutes ago • Match scores: 92%, 88%, 85%</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}