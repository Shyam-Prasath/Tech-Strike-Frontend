import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  Award,
  BookOpen,
  Clock,
  Play,
  Star,
  Target,
  Users
} from 'lucide-react';
import { useState } from 'react';
export default function ConsultantTraining() {
  const key = import.meta.env.GEMINI_API_KEY;
  const [skills, setSkills] = useState<string[]>([]);
  const [loadingSkills, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);

const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fallbackSkills = ["HTML", "CSS", "JavaScript", "React", "Node.js"];

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        setLoading(true);
        setError(null);

        const resumeText = reader.result as string;
        const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash" });

        // STEP 1: Extract Skills
        const skillPrompt = `
          From the following resume text, extract ONLY the skills.
          Return them as a JSON array like:
          ["JavaScript", "React", "Node.js"]

          Resume Text:
          """${resumeText}"""
        `;
        const skillResult = await model.generateContent(skillPrompt);
        const skillText = skillResult.response.text().trim().replace(/^```json\s*|\s*```$/g, "");
        let parsedSkills = [];
        try {
          parsedSkills = JSON.parse(skillText);
        } catch {
          parsedSkills = fallbackSkills;
        }
        setSkills(parsedSkills);

        // STEP 2: Suggest Courses Based on Skills
        const coursePrompt = `
          Based on these skills: ${JSON.stringify(parsedSkills)},
          suggest 4 relevant online courses in JSON format:
          [
            {
              "id": 1,
              "title": "Course Name",
              "description": "Brief description",
              "duration": "e.g. '8 hours'",
              "difficulty": "Beginner | Intermediate | Advanced",
              "status": "available | in-progress | completed",
              "progress": 0,
              "deadline": "YYYY-MM-DD or 'Completed'",
              "instructor": "Instructor Name",
              "rating": 4.5,
              "courseLink": "https://course link"
            }
          ]
          Ensure valid JSON, no extra text.
        `;
        const courseResult = await model.generateContent(coursePrompt);
        const courseText = courseResult.response.text().trim().replace(/^```json\s*|\s*```$/g, "");
        let parsedCourses = [];
        try {
          parsedCourses = JSON.parse(courseText);
        } catch {
          parsedCourses = []; // fallback empty
        }
        setAvailableCourses(parsedCourses);

      } catch (err) {
        console.error("Gemini API error:", err);
        setSkills(fallbackSkills);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(file);
  };

  const learningPath = [
    { title: 'Frontend Fundamentals', completed: true },
    { title: 'React Ecosystem', completed: true },
    { title: 'State Management', completed: true },
    { title: 'Advanced Patterns', completed: false, current: true },
    { title: 'Performance Optimization', completed: false },
    { title: 'Testing Strategies', completed: false }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-success text-success-foreground">Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-primary text-primary-foreground">In Progress</Badge>;
      case 'available':
        return <Badge variant="secondary">Available</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-success';
      case 'Intermediate': return 'text-warning';
      case 'Advanced': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <DashboardLayout userRole="Consultant">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Training & Development</h1>
            <p className="text-muted-foreground">Enhance your skills with our comprehensive training programs</p>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
        </div>

        {/* Resume Upload & Skills */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Upload Your Resume</h3>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleResumeUpload}
            className="mb-4"
          />
          {loadingSkills && <p className="text-sm text-muted-foreground">Extracting skills...</p>}
          {!loadingSkills && skills.length > 0 && (
            <div>
              <h4 className="text-md font-semibold mb-2">Skills Detected:</h4>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, idx) => (
                  <Badge key={idx} variant="outline">{skill}</Badge>
                ))}
              </div>
            </div>
          )}
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Suggested Courses */}
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">AI-Suggested Courses</h3>
            </div>
            
            <div className="space-y-4">
              {availableCourses.length > 0 ? availableCourses.map((course) => (
                <div key={course.id} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{course.title}</h4>
                        {getStatusBadge(course.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{course.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="h-4 w-4" />
                          <span className={getDifficultyColor(course.difficulty)}>{course.difficulty}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{course.instructor}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-warning" />
                          <span>{course.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {course.status === 'in-progress' && (
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Deadline: {course.deadline}
                    </span>
                    <div className="flex gap-2">
                      {(course.status === 'available' || course.status === 'in-progress') && (
                        <Button size="sm" onClick={() => window.open(course.courseLink, "_blank")}>
                          <Play className="h-4 w-4 mr-2" />
                          {course.status === 'available' ? "Start Course" : "Continue"}
                        </Button>
                      )}
                      {course.status === 'completed' && (
                        <Button size="sm" variant="outline">
                          <Award className="h-4 w-4 mr-2" />
                          View Certificate
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground">Upload your resume to see AI-suggested courses.</p>
              )}
            </div>
          </Card>
        </div>
        
      </div>
      
    </DashboardLayout>
  );
}