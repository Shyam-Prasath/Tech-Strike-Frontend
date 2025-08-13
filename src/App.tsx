import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminAgents from "./pages/admin/AdminAgents";
import AdminConsultants from "./pages/admin/AdminConsultants";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminReports from "./pages/admin/AdminReports";
import AdminSettings from "./pages/admin/AdminSettings";
import ConsultantAttendance from "./pages/consultant/ConsultantAttendance";
import ConsultantDashboard from "./pages/consultant/ConsultantDashboard";
import ConsultantOpportunities from "./pages/consultant/ConsultantOpportunities";
import ConsultantProfile from "./pages/consultant/ConsultantProfile";
import ConsultantResume from "./pages/consultant/ConsultantResume";
import ConsultantTraining from "./pages/consultant/ConsultantTraining";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
const queryClient = new QueryClient();
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Consultant Routes */}
          <Route path="/consultant/dashboard" element={<ConsultantDashboard />} />
          <Route path="/consultant/profile" element={<ConsultantProfile />} />
          <Route path="/consultant/resume" element={<ConsultantResume />} />
          <Route path="/consultant/attendance" element={<ConsultantAttendance />} />
          <Route path="/consultant/training" element={<ConsultantTraining />} />
          <Route path="/consultant/opportunities" element={<ConsultantOpportunities />} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/consultants" element={<AdminConsultants />} />
          <Route path="/admin/agents" element={<AdminAgents />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
