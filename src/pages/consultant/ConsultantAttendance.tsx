import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/supabaseClient';
import {
  AlertCircle,
  Calendar as CalendarIcon,
  CheckCircle,
  Clock,
  TrendingUp,
  XCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ConsultantAttendance() {

  const [recentAttendance, setRecentAttendance] = useState<
  {
    date: string;
    status: string;
    from_time: string | null;
    to_time: string | null;
    hours: number | null;
  }[]
>([]);

useEffect(() => {
  async function fetchAttendance() {
    try {
      const wallet = localStorage.getItem('wallet');
      if (!wallet) {
        setRecentAttendance([]);
        setLoading(false);
        return;
      }

      // Get user id for wallet
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('wallet_address', wallet)
        .single();

      if (userError || !userData) {
        console.error('User fetch error:', userError);
        setRecentAttendance([]);
        setLoading(false);
        return;
      }

      const userId = userData.id;

      // Fetch recent attendance records for user, sorted by date desc, limit 10
      const { data: attendanceData, error: attendanceError } = await supabase
        .from('attendance')
        .select('attendance_date, status, from_time, to_time, hours')
        .eq('user_id', userId)
        .order('attendance_date', { ascending: false })
        .limit(10);

      if (attendanceError) {
        console.error('Attendance fetch error:', attendanceError);
        setRecentAttendance([]);
        setLoading(false);
        return;
      }

      if (!attendanceData || attendanceData.length === 0) {
        setRecentAttendance([]);
        setLoading(false);
        return;
      }

      setRecentAttendance(
        attendanceData.map((rec) => ({
          date: rec.attendance_date,
          status: rec.status.toLowerCase(),
          from_time: rec.from_time,
          to_time: rec.to_time,
          hours: rec.hours,
        }))
      );
      setLoading(false);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      setRecentAttendance([]);
      setLoading(false);
    }
  }

  fetchAttendance();
}, []);



  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const [selectedDateAttendance, setSelectedDateAttendance] = useState<{
  date: string;
  status: string;
  from_time: string | null;
  to_time: string | null;
  hours: number | null;
} | null>(null);

const [loadingSelectedDate, setLoadingSelectedDate] = useState(false);

useEffect(() => {
  async function fetchAttendanceForDate(date: Date | undefined) {
    if (!date) {
      setSelectedDateAttendance(null);
      return;
    }
    setLoadingSelectedDate(true);

    try {
      const wallet = localStorage.getItem('wallet');
      if (!wallet) {
        setSelectedDateAttendance(null);
        setLoadingSelectedDate(false);
        return;
      }

      // Get user id
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('wallet_address', wallet)
        .single();

      if (userError || !userData) {
        setSelectedDateAttendance(null);
        setLoadingSelectedDate(false);
        return;
      }

      const userId = userData.id;

      // Format date as YYYY-MM-DD string (match your DB format)
      const dateString = date.toISOString().split('T')[0];

      // Fetch attendance for that user on the selected date
      const { data: attendanceData, error: attendanceError } = await supabase
        .from('attendance')
        .select('attendance_date, status, from_time, to_time, hours')
        .eq('user_id', userId)
        .eq('attendance_date', dateString)
        .single();

      if (attendanceError || !attendanceData) {
        setSelectedDateAttendance(null);
      } else {
        setSelectedDateAttendance({
          date: attendanceData.attendance_date,
          status: attendanceData.status.toLowerCase(),
          from_time: attendanceData.from_time,
          to_time: attendanceData.to_time,
          hours: attendanceData.hours,
        });
      }
    } catch (error) {
      console.error('Error fetching selected date attendance:', error);
      setSelectedDateAttendance(null);
    } finally {
      setLoadingSelectedDate(false);
    }
  }

  fetchAttendanceForDate(selectedDate);
}, [selectedDate]);


  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-success text-success-foreground">Present</Badge>;
      case 'absent':
        return <Badge variant="destructive">Absent</Badge>;
      case 'late':
        return <Badge className="bg-warning text-warning-foreground">Late</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'absent':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'late':
        return <AlertCircle className="h-4 w-4 text-warning" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };


const [monthlySummary, setMonthlySummary] = useState({
  present: 0,
  absent: 0,
  late: 0,
  totalHours: 0,
  attendancePercent: 0,
});



useEffect(() => {
  async function fetchMonthlySummary() {
    try {
      const wallet = localStorage.getItem('wallet');
      if (!wallet) {
        setMonthlySummary({
          present: 0,
          absent: 0,
          late: 0,
          totalHours: 0,
          attendancePercent: 0,
        });
        return;
      }

      // Get user id for wallet
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('wallet_address', wallet)
        .single();

      if (userError || !userData) {
        console.error('User fetch error:', userError);
        return;
      }

      const userId = userData.id;

      // Get current month date range
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

      // Fetch attendance for current month for user
      const { data: attendanceData, error: attendanceError } = await supabase
        .from('attendance')
        .select('status, hours')
        .eq('user_id', userId)
        .gte('attendance_date', startOfMonth)
        .lte('attendance_date', endOfMonth);

      if (attendanceError || !attendanceData) {
        console.error('Error fetching monthly attendance:', attendanceError);
        return;
      }

      // Calculate summary
      let present = 0;
      let absent = 0;
      let late = 0;
      let totalHours = 0;
      attendanceData.forEach((rec) => {
        switch (rec.status.toLowerCase()) {
          case 'present':
            present++;
            break;
          case 'absent':
            absent++;
            break;
          case 'late':
            late++;
            break;
        }
        totalHours += rec.hours ?? 0;
      });

      // Calculate attendance percentage
      const totalDays = present + absent + late;
      const attendancePercent = totalDays > 0 ? Math.round((present / totalDays) * 100) : 0;

      setMonthlySummary({
        present,
        absent,
        late,
        totalHours,
        attendancePercent,
      });
    } catch (error) {
      console.error('Error fetching monthly summary:', error);
    }
  }

  fetchMonthlySummary();
}, []);

const attendanceStats = [
  {
    label: 'Present',
    value: monthlySummary.present.toString(),
    trend: '+4',  // You can update this dynamically if you want or remove
    color: 'text-success',
  },
  {
    label: 'Absent',
    value: monthlySummary.absent.toString(),
    trend: '+1',  // Update as needed
    color: 'text-destructive',
  },
  {
    label: 'Late',
    value: monthlySummary.late.toString(),
    trend: '+2',  // Update as needed
    color: 'text-warning',
  },
  {
    label: 'Total Hours',
    value: Math.round(monthlySummary.totalHours).toString(),
    trend: '',  // You can omit or put any dynamic trend
    color: 'text-primary',
  },
  {
    label: 'Avg/Day',
    value:
      monthlySummary.present > 0
        ? `${(monthlySummary.totalHours / monthlySummary.present).toFixed(2)} h`
        : '0 h',
    trend: '',
    color: 'text-primary',
  },
  {
    label: 'Attendance %',
    value: `${monthlySummary.attendancePercent}%`,
    trend: '',
    color: 'text-success',
  },
];


  return (
    <DashboardLayout userRole="Consultant">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Attendance Tracking</h1>
            <p className="text-muted-foreground">Monitor your attendance and working hours</p>
          </div>
          
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {attendanceStats.map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className={`text-sm font-medium ${stat.color}`}>{stat.trend}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[0.6fr_1fr] gap-8">
          {/* Calendar */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <CalendarIcon className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Attendance Calendar</h3>
            </div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border w-full"
            />
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 bg-success rounded-full"></div>
                <span>Present</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 bg-destructive rounded-full"></div>
                <span>Absent</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 bg-warning rounded-full"></div>
                <span>Late</span>
              </div>
            </div>
          </Card>

          {/* Recent Attendance */}
          {/* Recent Attendance */}
<Card className="p-6 max-w-[600px] w-full">
  <div className="flex items-center gap-2 mb-6">
    <Clock className="h-5 w-5 text-primary" />
    <h3 className="text-lg font-semibold">Recent Attendance</h3>
  </div>

  {loading ? (
    <p className="text-muted-foreground">Loading attendance...</p>
  ) : recentAttendance.length === 0 ? (
    <p className="text-muted-foreground italic">No attendance history</p>
  ) : (
    <div className="space-y-4">
      {recentAttendance.map((record, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-4 border border-border rounded-lg"
        >
          <div className="flex items-center gap-3">
            {getStatusIcon(record.status)}
            <div>
              <p className="font-medium">{record.date}</p>
              <p className="text-sm text-muted-foreground">
                {record.from_time ?? '-'} - {record.to_time ?? '-'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium">{record.hours ?? '0h 0m'}</p>
              <p className="text-xs text-muted-foreground">Hours</p>
            </div>
            {getStatusBadge(record.status)}
          </div>
        </div>
      ))}
    </div>
  )}
</Card>

        </div>

        {/* Today's Status */}
        <Card className="p-6">
  <h3 className="text-lg font-semibold mb-6">Attendance for {selectedDate?.toISOString().split('T')[0]}</h3>

  {loadingSelectedDate ? (
    <p className="text-muted-foreground">Loading attendance...</p>
  ) : selectedDateAttendance ? (
    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
      <div className="flex items-center gap-3">
        {getStatusIcon(selectedDateAttendance.status)}
        <div>
          <p className="font-medium">{selectedDateAttendance.date}</p>
          <p className="text-sm text-muted-foreground">
            {selectedDateAttendance.from_time ?? '-'} - {selectedDateAttendance.to_time ?? '-'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium">{selectedDateAttendance.hours ?? '0h 0m'}</p>
          <p className="text-xs text-muted-foreground">Hours</p>
        </div>
        {getStatusBadge(selectedDateAttendance.status)}
      </div>
    </div>
  ) : (
    <p className="text-muted-foreground italic">No attendance on this date</p>
  )}
</Card>


        {/* Monthly Summary */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">Monthly Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-success">{monthlySummary.present}</p>
              <p className="text-sm text-muted-foreground">Present</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-destructive">{monthlySummary.absent}</p>
              <p className="text-sm text-muted-foreground">Absent</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-warning">{monthlySummary.late}</p>
              <p className="text-sm text-muted-foreground">Late</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{Math.round(monthlySummary.totalHours)} h</p>
              <p className="text-sm text-muted-foreground">Total Hours</p>
            </div>
            <div>
                  <p className="text-2xl font-bold text-primary">
                    {monthlySummary.present > 0
                      ? `${(monthlySummary.totalHours / monthlySummary.present).toFixed(2)}h`
                      : '0h'}
                  </p>
                  <p className="text-sm text-muted-foreground">Avg/Day</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-success">{monthlySummary.attendancePercent}%</p>
              <p className="text-sm text-muted-foreground">Attendance</p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}