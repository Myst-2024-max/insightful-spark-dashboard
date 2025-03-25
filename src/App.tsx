
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthContext";

// Layouts
import DashboardLayout from "@/components/layout/DashboardLayout";

// Pages
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import UserManagement from "@/pages/UserManagement";
import SchoolManagement from "@/pages/SchoolManagement";
import ProgramManagement from "@/pages/ProgramManagement";
import NotFound from "@/pages/NotFound";
import NotAuthorized from "@/pages/NotAuthorized";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Protected routes */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/schools" element={<SchoolManagement />} />
              <Route path="/programs" element={<ProgramManagement />} />
              <Route path="/sales" element={<NotFound />} />
              <Route path="/accounts" element={<NotFound />} />
              <Route path="/growth" element={<NotFound />} />
              <Route path="/teams" element={<NotFound />} />
              <Route path="/projects/:department" element={<NotFound />} />
            </Route>
            
            {/* Common routes */}
            <Route path="/unauthorized" element={<NotAuthorized />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
