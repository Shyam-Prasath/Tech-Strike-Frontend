import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  AlertCircle,
  CheckCircle,
  Code,
  Download,
  Edit,
  Eye,
  FileText,
  Star,
  TrendingUp,
  Upload
} from 'lucide-react';
import React, { useRef, useState } from 'react';

export default function ConsultantResume() {
  const key = import.meta.env.GEMINI_API_KEY;
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setUploadedFileName(file.name);
    const formData = new FormData();
    formData.append('resume', file);
    
    try {
      const response = await fetch('https://tech-strike-backend.onrender.com/api/resume/analyze', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setAnalysis(data);
      console.log('Resume analysis result:', data);
    } catch (err) {
      alert('Failed to analyze resume');
    }
    setLoading(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  const recommendedCourses = analysis?.recommendedCourses || [];

  const resumeScore = analysis
    ? { overall: analysis.overallScore, sections: analysis.sections }
    : {
        overall: 0,
        sections: [
          { name: 'Contact Information', score: 0, status: 'excellent' },
          { name: 'Professional Summary', score: 0, status: 'good' },
          { name: 'Work Experience', score: 0, status: 'excellent' },
          { name: 'Skills & Technologies', score: 0, status: 'fair' },
          { name: 'Education', score: 0, status: 'good' },
          { name: 'Certifications', score: 0, status: 'fair' }
        ]
      };

  const suggestions = analysis
    ? analysis.suggestions
    : [
        'Add more quantifiable achievements in work experience',
        'Include recent certifications in cloud technologies',
        'Expand technical skills section with specific frameworks',
        'Add links to portfolio projects or GitHub repositories'
      ];

  const skillVector = analysis?.skillVector || [
    { skill: 'React', level: 'advanced' },
    { skill: 'Node.js', level: 'intermediate' },
    { skill: 'AWS', level: 'intermediate' },
    { skill: 'TypeScript', level: 'advanced' }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-success';
    if (score >= 75) return 'text-primary';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'excellent': return <Badge className="bg-success text-success-foreground">Excellent</Badge>;
      case 'good': return <Badge className="bg-primary text-primary-foreground">Good</Badge>;
      case 'fair': return <Badge variant="secondary">Needs Improvement</Badge>;
      default: return <Badge variant="destructive">Poor</Badge>;
    }
  };

  return (
    <DashboardLayout userRole="Consultant">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-inter tracking-tight">Resume Management</h1>
            <p className="text-muted-foreground">Upload, edit, and optimize your resume</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" disabled>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <input
              type="file"
              accept=".pdf"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <Button onClick={handleUploadClick} disabled={loading}>
              <Upload className="h-4 w-4 mr-2" />
              {loading ? 'Uploading...' : 'Upload New'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Resume Score */}
          <Card className="lg:col-span-1 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Star className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold font-inter tracking-tight">ATS Score</h3>
            </div>
            <div className="text-center mb-6">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="hsl(var(--muted))"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="hsl(var(--primary))"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - resumeScore.overall / 100)}`}
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary">{resumeScore.overall}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Overall Score</p>
            </div>
            <div className="space-y-3">
              {resumeScore.sections.map((section, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{section.name}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${getScoreColor(section.score)}`}>
                        {section.score}%
                      </span>
                    </div>
                  </div>
                  <Progress value={section.score} className="h-1.5" />
                </div>
              ))}
            </div>
          </Card>

          {/* Resume Management */}
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center gap-2 mb-6">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold font-inter tracking-tight">Current Resume</h3>
            </div>
            <div className="space-y-6">
              {/* File Info */}
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{uploadedFileName || 'No file uploaded yet'}</p>
                    <p className="text-sm text-muted-foreground">{uploadedFileName ? 'Just now' : ''}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </div>
              {/* Upload New Version */}
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="text-lg font-medium mb-2">Upload New Resume</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Drag and drop your resume here, or click to browse
                </p>
                <Button onClick={handleUploadClick} disabled={loading}>
                  Choose File
                </Button>
                <input
                  type="file"
                  accept=".pdf"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Supported formats: PDF (Max 5MB)
                </p>
              </div>

            </div>
          </Card>
        </div>

        {/* Improvement Suggestions */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold font-inter tracking-tight">Improvement Suggestions</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="flex items-start gap-3 p-4 border border-border rounded-lg">
                <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm">{suggestion}</p>
                  <Button variant="link" size="sm" className="p-0 h-auto text-primary" disabled>
                    Learn more →
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Skill Vector */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Code className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold font-inter tracking-tight">Technical Skills Breakdown</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {skillVector.map((item, index) => (
              <div key={index} className="p-4 border border-border rounded-lg flex flex-col gap-1">
                <span className="font-medium font-jetbrains text-sm">{item.skill}</span>
                <Badge variant="outline" className="w-fit text-xs capitalize">{item.level}</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* AI Resume Summary */}
        {analysis?.reportSummary && (
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="h-5 w-5 text-success" />
              <h3 className="text-lg font-semibold font-inter tracking-tight">Gemini Resume Summary</h3>
            </div>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{analysis.reportSummary}</p>
          </Card>
        )}

        {/* Course Recommender */}
        {recommendedCourses.length > 0 && (
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold font-inter tracking-tight">Upskill Section</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendedCourses.map((course, index) => (
                <div
                  key={index}
                  className="border border-border rounded-lg p-4 flex flex-col gap-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-base font-jetbrains">{course.topic}</span>
                    <Badge variant="outline" className="capitalize text-xs">{course.level}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{course.reason}</p>
                  <p className="text-sm">
                    Platform:{' '}
                    {course.link ? (
                      <a
                        href={course.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline"
                      >
                        {course.platform}
                      </a>
                    ) : (
                      <span className="text-muted-foreground">{course.platform}</span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
