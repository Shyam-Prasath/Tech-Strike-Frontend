import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabaseClient';
import {
  BookOpen,
  Calendar,
  Edit,
  Eye,
  FileCheck,
  Mail,
  MoreHorizontal,
  Search,
  Users
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type Consultant = {
  id: string;
  username: string;
  email: string;
  role: string;
};

const departments = ['Development', 'Testing', 'Data Analytics', 'DevOps'];
const statuses = ['Active', 'Training', 'Inactive'];

function getRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function AdminConsultants() {
  const [formData, setFormData] = useState({
  title: '',
  company: '',
  location: '',
  type: '',
  duration: '',
  rate: '',
  description: '',
  required_skills: '',
  cgpa: '',
  deadline: '',
  });


  const [avgAttendance, setAvgAttendance] = useState<number | null>(null);

useEffect(() => {
  const fetchAttendance = async () => {
    const { data, error } = await supabase
      .from('attendance')
      .select('overall_attendance_percentage');

    if (error) {
      console.error('Error fetching attendance:', error);
      return;
    }

    if (!data || data.length === 0) {
      setAvgAttendance(0);
      return;
    }

    // Calculate average directly from the existing column
    const total = data.reduce(
      (sum, record) => sum + (record.overall_attendance_percentage || 0),
      0
    );

    const avg = total / data.length;
    setAvgAttendance(avg);
  };

  fetchAttendance();
}, []);



  const [consultants, setConsultants] = useState<
    (Consultant & { department: string; status: string })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmitJob = async () => {
  // Convert required_skills to array
  const skillsArray = formData.required_skills
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0); // clean empty values

  // Convert CGPA to float (optional field)
  const cgpaValue = formData.cgpa ? parseFloat(formData.cgpa) : null;

  // Format deadline (ensure it's in yyyy-mm-dd format)
  const deadlineValue = formData.deadline ? formData.deadline : null;

  const payload = {
    title: formData.title,
    company: formData.company,
    location: formData.location,
    type: formData.type,
    duration: formData.duration,
    rate: formData.rate,
    description: formData.description,
    required_skills: skillsArray,
    cgpa: cgpaValue,
    deadline: deadlineValue,
    // ✅ omit posted_date (auto-filled)
  };

  const { error } = await supabase.from('posted_jobs').insert([payload]);

  if (error) {
    console.error('Insert error:', error);
    toast.error('Failed to post job');
  } else {
    toast.success('Job posted successfully!');
    setFormData({
      title: '',
      company: '',
      location: '',
      type: '',
      duration: '',
      rate: '',
      description: '',
      required_skills: '',
      cgpa: '',
      deadline: '',
    });
  }
};

useEffect(() => {
    const fetchConsultants = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, email, role')
        .eq('role', 'Consultant'); // case-sensitive

      if (error) {
        console.error('Error fetching consultants:', error.message);
      } else {
        const enhancedData = data.map((user) => ({
          ...user,
          department: getRandom(departments),
          status: getRandom(statuses),
        }));
        setConsultants(enhancedData)
      }

      setLoading(false);
    };

    fetchConsultants();
  }, []);


useEffect(() => {
  const filteredData = consultants.filter((consultant) => {
    const matchDepartment = departmentFilter ? consultant.department === departmentFilter : true;
    const matchStatus = statusFilter ? consultant.status === statusFilter : true;
    const matchSearch = searchTerm
      ? consultant.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        consultant.email.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchDepartment && matchStatus && matchSearch;
  });
  setFiltered(filteredData);
}, [departmentFilter, statusFilter, searchTerm, consultants]);


  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success text-success-foreground">Active</Badge>;
      case 'training':
        return <Badge className="bg-primary text-primary-foreground">Training</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getResumeStatusBadge = (status: string) => {
    return status === 'Updated' 
      ? <Badge className="bg-success text-success-foreground">Updated</Badge>
      : <Badge className="bg-warning text-warning-foreground">Pending</Badge>;
  };

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case 'Development': return 'text-blue-600';
      case 'Testing': return 'text-green-600';
      case 'Data Analytics': return 'text-purple-600';
      case 'DevOps': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <DashboardLayout userRole="Admin">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Consultant Management</h1>
            <p className="text-muted-foreground">Manage and monitor your consultant pool</p>
          </div>
        </div>

        {/* Job Posting Form */}
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Post New Job</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input name="title" placeholder="Title" value={formData.title} onChange={handleInputChange} />
            <Input name="company" placeholder="Company" value={formData.company} onChange={handleInputChange} />
            <Input name="location" placeholder="Location" value={formData.location} onChange={handleInputChange} />
            <Input name="type" placeholder="Type (Full-time / Part-time)" value={formData.type} onChange={handleInputChange} />
            <Input name="duration" placeholder="Duration (e.g. 6 months)" value={formData.duration} onChange={handleInputChange} />
            <Input name="rate" placeholder="Rate (INR/month)" value={formData.rate} onChange={handleInputChange} />
            <Input name="cgpa" placeholder="Minimum cgpa (e.g. 8.5)" value={formData.cgpa} onChange={handleInputChange} />
            <Input type="date" name="deadline" placeholder="Deadline (yyyy-mm-dd)" value={formData.deadline} onChange={handleInputChange} />
          </div>
          <Textarea name="description" placeholder="Job Description" value={formData.description} onChange={handleInputChange} />
          <Input name="required_skills" placeholder="Required Skills (comma separated)" value={formData.required_skills} onChange={handleInputChange} />
          <Button onClick={handleSubmitJob}>Post Job</Button>
        </Card>


        {/* Search and Filters */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search consultants..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

              </div>
            </div>
            <div className="flex gap-2">
              <Select onValueChange={(value) => setDepartmentFilter(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept.charAt(0).toUpperCase() + dept.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
              
              <Select onValueChange={(value) => setStatusFilter(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            </div>
          </div>
        </Card>

        {/* Consultants Table */}
        <Card className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Consultant</th>
                  <th className="text-left py-3 px-4 font-medium">Department</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
              {filtered.length > 0 ? (
                filtered.map((consultant) => (
                  <tr key={consultant.id} className="border-b hover:bg-muted/30">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="" />
                          <AvatarFallback>
                            {consultant.username?.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{consultant.username}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{consultant.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 capitalize">{consultant.department}</td>
                    <td className="py-4 px-4 capitalize">{consultant.status}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-6 px-4 text-center text-muted-foreground" colSpan={4}>
                    No Consultant Match
                  </td>
                </tr>
              )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 text-center">
            <Users className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{consultants.length}</div>
            <p className="text-sm text-muted-foreground">Total Consultants</p>
          </Card>
          
          <Card className="p-6 text-center">
            <Calendar className="h-8 w-8 text-success mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {avgAttendance !== null ? `${avgAttendance.toFixed(1)}%` : 'Loading...'}
            </div>
            <p className="text-sm text-muted-foreground">Avg Attendance</p>
          </Card>

          
          <Card className="p-6 text-center">
            <FileCheck className="h-8 w-8 text-warning mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {consultants.length}
            </div>
            <p className="text-sm text-muted-foreground">Resume Updated</p>
          </Card>
          
          <Card className="p-6 text-center">
            <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {consultants.length}
            </div>
            <p className="text-sm text-muted-foreground">Avg Training</p>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}