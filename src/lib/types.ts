
// User roles for the HACA Academy dashboard
export enum UserRole {
  MASTER_ADMIN = "MASTER_ADMIN",
  SALES_EXECUTIVE = "SALES_EXECUTIVE",
  ACCOUNTS_TEAM = "ACCOUNTS_TEAM",
  GROWTH_TEAM = "GROWTH_TEAM",
  TEAM_LEAD = "TEAM_LEAD",
  PROJECT_LEAD = "PROJECT_LEAD",
}

// School departments in HACA Academy
export enum SchoolDepartment {
  CODING = "CODING",
  DESIGN = "DESIGN",
  MARKETING = "MARKETING",
  FINANCE = "FINANCE",
}

// School/Program interfaces for database schema
export interface School {
  id: string;
  name: string;
  location?: string | null;
  created_at?: string;
}

export interface Program {
  id: string;
  name: string;
  description?: string | null;
  school_id?: string | null;  // Added school_id to associate programs with schools
  created_at?: string;
  school?: School | null; // For joined queries that include school data
}

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: SchoolDepartment | null;
  avatar?: string | null;
  teamLeadId?: string | null; // Reference to team lead for sales executives
  projectLeadId?: string | null; // Reference to project lead for team leads
  teamName?: string | null; // Added for UI display purposes
  school_id?: string | null; // Reference to school
  active?: boolean;
}

// Database user interface - represents the actual structure from Supabase
export interface HacaUser {
  id: string;
  name: string;
  email: string;
  role: string; // This comes as string from the database
  department?: string | null;
  avatar?: string | null;
  team_lead_id?: string | null;
  project_lead_id?: string | null;
  school_id?: string | null;
  active: boolean;
  created_at: string;
  created_by?: string | null;
  password?: string; // Only used when creating new users
}

// Converter functions
export function hacaUserToUser(hacaUser: HacaUser): User {
  return {
    id: hacaUser.id,
    name: hacaUser.name,
    email: hacaUser.email,
    role: hacaUser.role as UserRole,
    department: hacaUser.department as SchoolDepartment | null,
    avatar: hacaUser.avatar,
    teamLeadId: hacaUser.team_lead_id,
    projectLeadId: hacaUser.project_lead_id,
    school_id: hacaUser.school_id,
    active: hacaUser.active
  };
}

// Authentication state
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Import LucideIcon type
import { LucideIcon } from 'lucide-react';

// Dashboard analytics data
export interface AnalyticsData {
  id: string;
  title: string;
  value: number | string;
  percentChange: number;
  trend: 'up' | 'down' | 'neutral';
  icon: LucideIcon;  // Changed from optional to required
}

// Chart data interface
export interface ChartData {
  name: string;
  value: number;
  [key: string]: any;
}

// Sales Executive Performance interface
export interface SalesExecutivePerformance {
  id: string;
  name: string;
  targetValue: number;
  achievedValue: number;
  achievementPercentage: number;
  trend: 'up' | 'down' | 'neutral';
  avatar?: string | null; // Added avatar property
}

// Team interface
export interface Team {
  id: string;
  name: string;
  leadId: string;
  leadName: string;
}

// School data interfaces
export interface SalesData {
  id: string;
  user_id: string;
  school_id: string;
  program_id: string;
  incentive_target: number;
  achieved_amount: number;
  leads_assigned: number;
  sales_units: number;
  conversion_ratio?: number | null;
  created_at?: string;
}

export interface GrowthData {
  id: string;
  date: string;
  spend: number;
  lead_target: number;
  achieved_leads: number;
  program_id: string;
  school_id: string;
  created_at?: string;
}

export interface AccountsData {
  id: string;
  user_id: string;
  date: string;
  customer_name: string;
  mobile_number?: string | null;
  email?: string | null;
  course_name: string;
  tenure?: string | null;
  mode_of_learning?: string | null;
  batch_name?: string | null;
  amount_paid: number;
  total_sale_value: number;
  remaining_amount: number;
  school_id: string;
  created_at?: string;
}
