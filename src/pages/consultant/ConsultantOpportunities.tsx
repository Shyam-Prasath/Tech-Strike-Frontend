import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabaseClient';
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  Check,
  Clock,
  IndianRupee,
  MapPin,
  Search,
  Target,
  Users
} from 'lucide-react';
import { useEffect, useState } from "react";

export default function ConsultantOpportunities() {
  const key = import.meta.env.GEMINI_API_KEY;
  const [resumeData, setResumeData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [jobError, setJobError] = useState<string | null>(null);
  const [jobCount, setJobCount] = useState(0);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchDuration, setSearchDuration] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<any[]>([]);

const handleResumeUpload = async (file: File) => {
  const reader = new FileReader();
  reader.onload = async () => {
    const resumeText = reader.result as string;
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash" }); //gemini-1.5-flash //gemini-1.5-pro
    const fallbackResumeData = {
  name: "S SHYAM PRASATH",
  email: "ss4172@srmist.edu.in",
  skills: [
    "HTML", "CSS", "JavaScript", "Bootstrap", "Tailwind CSS", "React", "Node.js",
    "Express.js", "MongoDB", "MERN stack", "NumPy", "Pandas", "TensorFlow",
    "OpenCV", "Streamlit", "WebSockets", "Socket.io", "JWT Authentication",
    "IPFS", "Smart Contracts", "Web3Auth", "Google Gemini AI"
  ],
  academic: [
    "B.Tech, Computer Science and Engineering from SRM IST-Ramapuram",
    "Class X from Aditya Vidyashram Poraiyur",
    "Class XII from Velammal Vidyalaya"
  ]
};


    const prompt = `
      Extract the following fields from the resume text:
      - Full Name
      - Email
      - List of Skills
      - Academic Qualifications

      Return the data in this JSON format:
      {
        "name": "John Doe",
        "email": "john.doe@example.com",
        "skills": ["JavaScript", "React", "Node.js"],
        "academic": ["B.Tech in Computer Science from XYZ University", "M.Tech in AI from ABC University"]
      }

      Resume Text:
      """${resumeText}"""
    `;

    try {
      setLoading(true);
      setError(null);
      const start = performance.now();
      const result = await model.generateContent(prompt);
      const end = performance.now();
      console.log(`Gemini response time: ${(end - start) / 1000} seconds`);
      const responseText = result.response.text();

      try {
        const trimmedText = responseText.trim().replace(/^```json\s*|\s*```$/g, '');
        const json = JSON.parse(trimmedText);
        setResumeData(json);
        await saveToSupabase(json);
      } catch {
        setResumeData(fallbackResumeData);
      }
    } catch (err) {
      setResumeData(fallbackResumeData);
    } finally {
      setLoading(false);
    }
  };

  reader.readAsText(file);
};

const saveToSupabase = async (data: any) => {
    const { name, email, skills, academic } = data;

    // Check if user already exists
    const { data: existing, error: fetchError } = await supabase
      .from('consultant_resume')
      .select('id')
      .or(`email.eq.${email},name.eq.${name}`)
      .maybeSingle();

    if (fetchError) {
      console.error('Supabase fetch error:', fetchError);
      setError('Database fetch error');
      return;
    }

    if (existing) {
      // Update existing
      const { error: updateError } = await supabase
        .from('consultant_resume')
        .update({ skills, academic })
        .eq('id', existing.id);

      if (updateError) {
        console.error('Update error:', updateError);
        setError('Failed to update resume in database.');
      }
    } else {
      // Insert new
      const { error: insertError } = await supabase
        .from('consultant_resume')
        .insert([{ name, email, skills, academic }]);

      if (insertError) {
        console.error('Insert error:', insertError);
        setError('Failed to save resume to database.');
      }
    }
};

const normalizeSkill = (skill: string) =>
  skill.trim().toLowerCase().replace(/[^a-z0-9]/g, '');

useEffect(() => {
  const fetchJobs = async () => {
    setLoadingJobs(true);
    const { data, error } = await supabase
      .from('posted_jobs')
      .select('*')
      .order('posted_date', { ascending: false });

    if (error) {
      console.error("Error fetching jobs:", error);
      setJobError("Failed to load job opportunities.");
    } else {
      setJobs(data);
    }
    setLoadingJobs(false);
  };

  fetchJobs();
}, []);

useEffect(() => {
    const fetchJobCount = async () => {
      const { count, error } = await supabase
        .from('posted_jobs')
        .select('*', { count: 'exact', head: true })

      if (error) {
        console.error('Error fetching count:', error)
        return
      }

      setJobCount(count || 0)
    }

    fetchJobCount()
  }, [])

  const opportunityStats = [
    {
      label: 'Total Available',
      value: jobCount.toString(),
      trend: '+4', 
      icon: Target,
    },
    {
      label: 'Total Applied Jobs',
      value: jobCount.toString(),
      trend: '+2', 
      icon: Target,
    },
    {
      label: 'Total Eligible Jobs',
      value: jobCount.toString(),
      trend: '+2', 
      icon: Target,
    },
  ]


  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-primary text-primary-foreground">New</Badge>;
      case 'applied':
        return <Badge className="bg-warning text-warning-foreground">Applied</Badge>;
      case 'reviewing':
        return <Badge className="bg-success text-success-foreground">Under Review</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-success';
    if (score >= 80) return 'text-primary';
    if (score >= 70) return 'text-warning';
    return 'text-muted-foreground';
  };

    const filteredJobs = jobs.filter((job) => {
    const matchTitle = job.title.toLowerCase().includes(searchTitle.toLowerCase());
    const matchDuration = job.duration.toLowerCase().includes(searchDuration.toLowerCase());
    const matchLocation = job.location.toLowerCase().includes(searchLocation.toLowerCase());

    return matchTitle && matchDuration && matchLocation;
  });

  const [matchingCompanies, setMatchingCompanies] = useState<string[]>([]);

useEffect(() => {
  const runJobMatching = async () => {
    if (resumeData?.skills && jobs.length > 0) {
      const matches = await filterJobsBySkillMatch(resumeData.skills, jobs);
      setRecommendedJobs(matches);
    }
  };
  runJobMatching();
}, [resumeData, jobs]);

useEffect(() => {
  const fetchAppliedJobs = async () => {
    if (resumeData?.email) {
      const { data, error } = await supabase
        .from('applied_jobs')
        .select('applied_job')
        .eq('email', resumeData.email);

      if (data) {
        const jobTitles = data.map((entry) => entry.applied_job);
        setAppliedJobIds(jobTitles);
      }
    }
  };

  fetchAppliedJobs();
}, [resumeData]);



const handleApply = async (job: any) => {
  if (!resumeData) return;

  const { name, email, skills } = resumeData;

  const { error } = await supabase
    .from('applied_jobs')
    .insert([
      {
        name,
        email,
        skills,
        applied_job: job.title,
        applied_company: job.company
      }
    ]);

  if (!error) {
    setAppliedJobIds((prev) => [...prev, job.title]);
  } else {
    console.error("Failed to apply:", error);
  }
};

const filterJobsBySkillMatch = async (skills: string[], jobs: any[]) => {
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash" });

  const prompt = `
You are given:
1. A list of resume skills.
2. A list of jobs (each job has title, company, required_skills).

Return the list of jobs where **at least one** skill in the resume matches the job's required_skills.

Return the response in JSON format as:
{
  "recommended_jobs": [
    {
      "title": "Frontend Developer",
      "company": "TechCorp",
      "location": "chennai",
      "type": "Full-time",
    },
    ...
  ]
}

Resume Skills:
${JSON.stringify(skills)}

Jobs:
${JSON.stringify(jobs.map(j => ({ title: j.title, company: j.company, required_skills: j.required_skills })))}
`;

  try {
    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim().replace(/^```json\s*|\s*```$/g, '');
    const parsed = JSON.parse(raw);
    return parsed.recommended_jobs || [];
  } catch (error) {
    console.error("AI filtering error:", error);
    return [];
  }
};

const fallbackResumeData = {
  name: "S SHYAM PRASATH",
  email: "ss4172@srmist.edu.in",
  skills: [
    "HTML", "CSS", "JavaScript", "Bootstrap", "Tailwind CSS", "React", "Node.js",
    "Express.js", "MongoDB", "MERN stack", "NumPy", "Pandas", "TensorFlow",
    "OpenCV", "Streamlit", "WebSockets", "Socket.io", "JWT Authentication",
    "IPFS", "Smart Contracts", "Web3Auth", "Google Gemini AI"
  ],
  academic: [
    "B.Tech, Computer Science and Engineering from SRM IST-Ramapuram",
    "Class X from Aditya Vidyashram Poraiyur",
    "Class XII from Velammal Vidyalaya"
  ]
};

const finalRecommendedJobs = jobs.filter(job =>
  recommendedJobs.some(match => match.title === job.title && match.company === job.company)
);
  return (
    <DashboardLayout userRole="Consultant">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Opportunities</h1>
            <p className="text-muted-foreground">Discover and apply for new projects</p>
          </div>
          <div>
            <input
              id="resume-upload"
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleResumeUpload(file);
              }}
            />
            <label htmlFor="resume-upload" className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md cursor-pointer hover:bg-primary/90 transition">
              Upload Resume
            </label>
          </div>
        </div>

        {/* Resume Summary */}
        {loading && <p className="text-sm text-muted-foreground">Analyzing your resume...</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}

        {resumeData && (
          <Card className="mb-6 p-4 border-l-4 border-primary bg-muted">
            <h2 className="text-lg font-bold mb-2">Resume Summary</h2>
            {resumeData.name && <p><strong>Name:</strong> {resumeData.name}</p>}
            {resumeData.email && <p><strong>Email:</strong> {resumeData.email}</p>}
            {resumeData.skills && (
              <p><strong>Skills:</strong> {resumeData.skills.join(", ")}</p>
            )}
            {resumeData.academic && (
              <div>
                <strong>Academic Qualifications:</strong>
                <ul className="list-disc ml-6">
                  {resumeData.academic.map((item: string, idx: number) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {resumeData.raw && (
              <div className="mt-2">
                <strong>Raw Output:</strong>
                <pre className="whitespace-pre-wrap">{resumeData.raw}</pre>
              </div>
            )}
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {opportunityStats.map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-success">+{stat.trend} this week</p>
                </div>
                <stat.icon className="h-8 w-8 text-primary" />
              </div>
            </Card>
          ))}
        </div>

        {/* Search and Filters */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search opportunities..."
                  className="pl-10"
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search duration..."
                    className="pl-10"
                    value={searchDuration}
                    onChange={(e) => setSearchDuration(e.target.value)}
                  />
              </div>
              <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search location..."
                    className="pl-10"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                  />
              </div>
            </div>
          </div>
        </Card>

        {/* Opportunities List */}
        {loadingJobs && <p className="text-muted-foreground">Loading opportunities...</p>}
{jobError && <p className="text-destructive">{jobError}</p>}

{!loadingJobs && jobs.length === 0 && (
  <p className="text-muted-foreground">No opportunities found.</p>
)}
{filteredJobs.length > 0 ? (
  filteredJobs.map((opportunity) => (
    <Card key={opportunity.id} className="p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-semibold">{opportunity.title}</h3>
            {getStatusBadge("new")}
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{opportunity.company}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{opportunity.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{opportunity.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
              <span>{opportunity.rate}</span>
            </div>
          </div>

          <p className="text-muted-foreground mb-4">{opportunity.description}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {opportunity.required_skills?.map((skill: string, idx: number) => (
              <Badge key={idx} variant="secondary">{skill}</Badge>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Posted: {opportunity.posted_date}</span>
            <span>Deadline: {opportunity.deadline}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
            size="sm"
            variant="success"
            disabled={appliedJobIds.includes(opportunity.title)}
            onClick={() => handleApply(opportunity)}
          >
            <Check className="h-4 w-4 mr-2" />
            {appliedJobIds.includes(opportunity.title) ? 'Applied' : 'Apply'}
        </Button>

      </div>
    </Card>
  ))
) : (
  <div className="text-center text-muted-foreground font-medium text-lg">
    No JOBS MATCH
  </div>
)}
{/* --------------------- Recommended Jobs Section -------------------- */}
{recommendedJobs.length > 0 ? (
  <>
    <h2 className="text-2xl font-bold mt-10 mb-4">Recommended Jobs For You</h2>

    {recommendedJobs
      .map(recJob =>
        jobs.find(job =>
          job.title === recJob.title && job.company === recJob.company
        )
      )
      .filter(Boolean) // filter out any unmatched
      .map((job) => (
        <Card key={job.id ?? `${job.title}-${job.company}`} className="p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-semibold">{job.title}</h3>
                {getStatusBadge("new")}
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{job.company}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{job.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <IndianRupee className="h-4 w-4 text-muted-foreground" />
                  <span>{job.rate}</span>
                </div>
              </div>

              <p className="text-muted-foreground mb-4">{job.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {job.required_skills?.map((skill: string, index: number) => (
                  <Badge key={`${skill}-${index}`} variant="secondary">{skill}</Badge>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Posted: {job.posted_date}</span>
                <span>Deadline: {job.deadline}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
                size="sm"
                variant="success"
                disabled={appliedJobIds.includes(job.title)}
                onClick={() => handleApply(job)}
              >
                <Check className="h-4 w-4 mr-2" />
                {appliedJobIds.includes(job.title) ? 'Applied' : 'Apply'}
            </Button>
          </div>
        </Card>
      ))}
  </>
) : (
  <div className="text-center text-muted-foreground font-medium text-lg mt-10"> 
    No Recommended Jobs Found
  </div>
)}
      </div>
    </DashboardLayout>
  );
}