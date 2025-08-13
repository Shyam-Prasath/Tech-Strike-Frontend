import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/supabaseClient.ts';
import {
  BarChart3,
  Calendar,
  Clock,
  Target,
  TrendingUp,
  UserCheck, UserX,
} from 'lucide-react';
import { useEffect, useState } from 'react';

type TopUser = {
  id: string;
  username: string;
  overall_attendance_percentage: number;
};

export default function AdminReports() {

  const [attendanceForm, setAttendanceForm] = useState({
    name: '',
    date: '',
    status: 'Present',
    fromTime: '',
    toTime: '',
    hours: ''
  });


const [consultantCount, setConsultantCount] = useState(0);
const [consultantsWithResumeCount, setConsultantsWithResumeCount] = useState(0);
const [highAttendanceCount, setHighAttendanceCount] = useState(0);
const [totalJobsCount, setTotalJobsCount] = useState(0);

useEffect(() => {
  async function fetchKpiMetrics() {
  try {
    // Total consultants count using count property (head: true fetches count only)
    const { count: usersCount, error: usersError } = await supabase
      .from('users')
      .select('id', { count: 'exact', head: true })
      .eq('role', 'Consultant');

    if (usersError) throw usersError;
    setConsultantCount(usersCount ?? 0);

    // Consultants with resumes count (just count, no data)
    const { count: resumesCount, error: resumesError } = await supabase
      .from('consultant_resume')
      .select('id', { count: 'exact', head: true });

    if (resumesError) throw resumesError;
    setConsultantsWithResumeCount(resumesCount ?? 0);

    // High attendance count - assuming no RPC function, you can do this:
    // Get count of users with latest attendance overall_attendance_percentage >= 90
    const { data: attendanceData, error: attendanceError } = await supabase
      .from('attendance')
      .select('user_id, overall_attendance_percentage')
      .order('attendance_date', { ascending: false }); // latest records first

    if (attendanceError) throw attendanceError;

    // We'll pick latest attendance per user and count those above 90%
    const latestAttendanceMap = new Map<string, number>();
    attendanceData?.forEach(record => {
      if (!latestAttendanceMap.has(record.user_id)) {
        latestAttendanceMap.set(record.user_id, record.overall_attendance_percentage);
      }
    });
    const highAttendanceUsers = Array.from(latestAttendanceMap.values()).filter(p => p >= 90).length;
    setHighAttendanceCount(highAttendanceUsers);

    // Total jobs count
    const { count: jobsCount, error: jobsError } = await supabase
      .from('posted_jobs')
      .select('id', { count: 'exact', head: true });

    if (jobsError) throw jobsError;
    setTotalJobsCount(jobsCount ?? 0);

  } catch (error) {
    console.error('Error fetching KPI metrics:', error);
  }
}
  fetchKpiMetrics();
}, []);

const [users, setUsers] = useState<{ id: string; username: string }[]>([]);

useEffect(() => {
  async function fetchUsers() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, username')
        .eq('role', 'Consultant'); // Ensure we only fetch consultants
      
      if (error) throw error;
      if (data) setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }
  fetchUsers();
}, []);



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAttendanceForm((prev) => ({
      ...prev,
      [name]: value
    }));

    if ((name === 'fromTime' || name === 'toTime') && attendanceForm.fromTime && attendanceForm.toTime) {
      const from = new Date(`1970-01-01T${name === 'fromTime' ? value : attendanceForm.fromTime}:00`);
      const to = new Date(`1970-01-01T${name === 'toTime' ? value : attendanceForm.toTime}:00`);
      if (to > from) {
        const diffMs = to.getTime() - from.getTime();
        const diffHrs = diffMs / (1000 * 60 * 60);
        setAttendanceForm(prev => ({ ...prev, hours: diffHrs.toFixed(2) }));
      }
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const user = users.find(u => u.username === attendanceForm.name);
    if (!user) {
      alert("User not found!");
      return;
    }
    const userId = user.id;

    // Fetch all existing attendance records for this user (exclude the new one for now)
    const { data: existingRecords, error: fetchError } = await supabase
      .from('attendance')
      .select('status')
      .eq('user_id', userId);

    if (fetchError) throw fetchError;

    // Start from 100 overall percentage
    let overall = 100;

    // Function to apply status adjustment
    const adjustOverall = (currentOverall: number, status: string) => {
      switch (status) {
        case 'Absent':
          return currentOverall - 20;
        case 'Late':
          return currentOverall - 10;
        case 'Present':
          return currentOverall + 5;
        default:
          return currentOverall;
      }
    };

    // Calculate overall from existing records
    if (existingRecords && existingRecords.length > 0) {
      for (const record of existingRecords) {
        overall = adjustOverall(overall, record.status);
        overall = Math.min(Math.max(overall, 0), 100); // clamp
      }
    }

    // Adjust overall with the new attendance status
    overall = adjustOverall(overall, attendanceForm.status);
    overall = Math.min(Math.max(overall, 0), 100); // clamp

    // Insert new attendance record with calculated overall attendance percentage
    const { error: insertError } = await supabase
      .from('attendance')
      .insert([{
        user_id: userId,
        attendance_date: attendanceForm.date,
        status: attendanceForm.status,
        from_time: attendanceForm.fromTime || null,
        to_time: attendanceForm.toTime || null,
        hours: attendanceForm.hours ? parseFloat(attendanceForm.hours) : null,
        overall_attendance_percentage: overall
      }]);

    if (insertError) throw insertError;

    alert("Attendance submitted successfully!");

    setAttendanceForm({
      name: '',
      date: '',
      status: 'Present',
      fromTime: '',
      toTime: '',
      hours: ''
    });

  } catch (error) {
    console.error('Error submitting attendance:', error);
    alert('Failed to submit attendance. Please try again.');
  }
};

const [topPresent, setTopPresent] = useState<TopUser | null>(null);
  const [topAbsent, setTopAbsent] = useState<TopUser | null>(null);
  const [topLate, setTopLate] = useState<TopUser | null>(null);

useEffect(() => {
  async function fetchTopUsers() {
    try {
      const { data: attendanceData, error: attendanceError } = await supabase
        .from('attendance')
        .select(`
          user_id,
          attendance_date,
          overall_attendance_percentage,
          status,
          users!attendance_user_id_fkey ( username )
        `);

      if (attendanceError) throw attendanceError;
      if (!attendanceData) return;

      // Count attendance records per user


      // Map to keep latest attendance record per user by date
// Map to keep latest attendance record per user by date
const latestAttendanceMap = new Map<string, typeof attendanceData[0]>();
for (const record of attendanceData) {
  const existing = latestAttendanceMap.get(record.user_id);
  if (!existing || new Date(record.attendance_date) > new Date(existing.attendance_date)) {
    latestAttendanceMap.set(record.user_id, record);
  }
}

const latestAttendanceArray = Array.from(latestAttendanceMap.values());

// Sort latest attendance by overall_attendance_percentage ascending
const sortedByOverall = latestAttendanceArray.sort(
  (a, b) => a.overall_attendance_percentage - b.overall_attendance_percentage
);


// Top absent: first element (lowest overall attendance)
const topAbsentUserRecord = sortedByOverall[0] || null;

// Top present: last element (highest overall attendance)
const topPresentUserRecord = sortedByOverall.length > 0 ? sortedByOverall[sortedByOverall.length - 1] : null;

// Top late: find the user with status 'Late' with lowest overall attendance
const lateUsers = sortedByOverall.filter(r => r.status === 'Late');
const topLateUserRecord = lateUsers.length > 0 ? lateUsers[0] : null;


const mapRecordToUser = (r: typeof attendanceData[0] | null): TopUser | null => {
  if (!r || !r.users) return null;
  return {
    id: r.user_id,
    username: r.users.username,
    overall_attendance_percentage: r.overall_attendance_percentage,
  };
};

setTopPresent(mapRecordToUser(topPresentUserRecord));
setTopAbsent(mapRecordToUser(topAbsentUserRecord));
setTopLate(mapRecordToUser(topLateUserRecord));

    } catch (error) {
      console.error('Error fetching top attendance users:', error);
    }
  }

  fetchTopUsers();
}, []);


const kpiMetrics = [
  {
    title: 'Resume Compliance',
    value: consultantCount > 0 ? `${Math.round((consultantsWithResumeCount / consultantCount) * 100)}%` : '0%',
    subtitle: `${consultantsWithResumeCount} of ${consultantCount} updated`,
    description: `${consultantsWithResumeCount} of ${consultantCount} consultants have updated resumes`,
    trend: 'up',
    color: 'text-success',
  },
  {
    title: 'Training Completion',
    value: '78%', // Static or add DB data if available
    subtitle: 'Average across all departments',
    description: '23 courses completed this month',
    trend: 'up',
    color: 'text-primary',
  },
  {
    title: 'High Attendance',
    value: consultantCount > 0 ? `${Math.round((highAttendanceCount / consultantCount) * 100)}%` : '0%',
    subtitle: `Above 90% attendance rate`,
    description: `${highAttendanceCount} consultants with excellent attendance`,
    trend: 'up',
    color: 'text-success',
  },
  {
    title: 'Avg Opportunities',
    value: consultantCount > 0 ? (totalJobsCount / consultantCount).toFixed(2) : '0',
    subtitle: 'Per consultant',
    description: `${totalJobsCount} total opportunities assigned`,
    trend: 'neutral',
    color: 'text-warning',
  },
];

  return (
    <DashboardLayout userRole="Admin">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Reports & Analytics</h1>
            <p className="text-muted-foreground">Comprehensive insights into consultant performance and system metrics</p>
          </div>
          <div className="flex gap-2">
          </div>
        </div>

        {/* KPI Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiMetrics.map((metric, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                  <p className="text-3xl font-bold">{metric.value}</p>
                  <p className={`text-sm font-medium ${metric.color}`}>{metric.subtitle}</p>
                </div>
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground">{metric.description}</p>
            </Card>
          ))}
        </div>

        {/* === Attendance Upload Form === */}
        <Card className="p-6 max-w-lg mx-auto">
          <h3 className="text-lg font-semibold mb-6">Upload Attendance</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
              <select
    id="name"
    name="name"
    value={attendanceForm.name}
    onChange={handleInputChange}
    required
    className="w-full rounded border border-border px-3 py-2"
  >
    <option value="" disabled>Select consultant</option>
    {users.map(user => (
      <option key={user.id} value={user.username}>
        {user.username}
      </option>
    ))}
  </select>
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium mb-1">Date</label>
              <input
                id="date"
                name="date"
                type="date"
                value={attendanceForm.date}
                onChange={handleInputChange}
                required
                className="w-full rounded border border-border px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium mb-1">Status</label>
              <select
                id="status"
                name="status"
                value={attendanceForm.status}
                onChange={handleInputChange}
                className="w-full rounded border border-border px-3 py-2"
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Late">Late</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="fromTime" className="block text-sm font-medium mb-1">From Time</label>
                <input
                  id="fromTime"
                  name="fromTime"
                  type="time"
                  value={attendanceForm.fromTime}
                  onChange={handleInputChange}
                  className="w-full rounded border border-border px-3 py-2"
                />
              </div>

              <div>
                <label htmlFor="toTime" className="block text-sm font-medium mb-1">To Time</label>
                <input
                  id="toTime"
                  name="toTime"
                  type="time"
                  value={attendanceForm.toTime}
                  onChange={handleInputChange}
                  className="w-full rounded border border-border px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label htmlFor="hours" className="block text-sm font-medium mb-1">Hours</label>
              <input
                id="hours"
                name="hours"
                type="number"
                step="0.01"
                value={attendanceForm.hours}
                onChange={handleInputChange}
                className="w-full rounded border border-border px-3 py-2"
                placeholder="Calculated or enter hours"
              />
            </div>

            <Button type="submit" className="w-full">
              Submit Attendance
            </Button>
          </form>
        </Card>




        {/* here add there card section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {topPresent ? (
          <Card className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <UserCheck className="h-8 w-8 text-green-600" />
              <h3 className="text-lg font-semibold">Top Present</h3>
            </div>
            <p className="text-xl font-bold">{topPresent.username}</p>
            <p className="text-sm text-muted-foreground">
              Overall Attendance: {topPresent.overall_attendance_percentage.toFixed(2)}%
            </p>
          </Card>
        ): (
    <Card className="p-6 flex items-center justify-center text-muted-foreground font-semibold">
      <div className="flex items-center space-x-4 mb-4 flex-col">
              <UserX className="h-8 w-8 text-green-600" />
              <h3 className="text-lg font-semibold">Top Present</h3>
              <h4>No user in this criteria</h4>
            </div>
    </Card>
  )}

        {topAbsent ? (
          <Card className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <UserX className="h-8 w-8 text-red-600" />
              <h3 className="text-lg font-semibold">Top Absent</h3>
            </div>
            <p className="text-xl font-bold">{topAbsent.username}</p>
            <p className="text-sm text-muted-foreground">
              Overall Attendance: {topAbsent.overall_attendance_percentage.toFixed(2)}%
            </p>
          </Card>
        ): (
    <Card className="p-6 flex items-center justify-center text-muted-foreground font-semibold">
      <div className="flex items-center space-x-4 mb-4 flex-col">
              <UserX className="h-8 w-8 text-red-600" />
              <h3 className="text-lg font-semibold">Top Absent</h3>
              <h4>No user in this criteria</h4>
            </div>
    </Card>
  )}

        {topLate ?  (
          <Card className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <Clock className="h-8 w-8 text-yellow-600" />
              <h3 className="text-lg font-semibold">Top Late</h3>
            </div>
            <p className="text-xl font-bold">{topLate.username}</p>
            <p className="text-sm text-muted-foreground">
              Overall Attendance: {topLate.overall_attendance_percentage.toFixed(2)}%
            </p>
          </Card>
        ): (
          
    <Card className="p-6 flex items-center justify-center text-muted-foreground font-semibold">
      <div className="flex items-center space-x-4 mb-4 flex-col">
              <Clock className="h-8 w-8 text-yellow-600" />
              <h3 className="text-lg font-semibold">Top Late</h3>
              <h4>No user in this criteria</h4>
      </div>
    </Card>
  )}
      </div>






        {/* Report Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 text-center">
            <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Performance Analytics</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Generate detailed performance reports for consultants and departments
            </p>
            <Button variant="outline" className="w-full">
              Generate Analytics
            </Button>
          </Card>
          
          <Card className="p-6 text-center">
            <Calendar className="h-12 w-12 text-success mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Attendance Report</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Monthly attendance summaries and trend analysis
            </p>
            <Button variant="outline" className="w-full">
              View Attendance
            </Button>
          </Card>
          
          <Card className="p-6 text-center">
            <Target className="h-12 w-12 text-warning mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Opportunity Metrics</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Track opportunity assignments and success rates
            </p>
            <Button variant="outline" className="w-full">
              View Opportunities
            </Button>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}