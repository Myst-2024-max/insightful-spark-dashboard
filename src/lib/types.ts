
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
  location?: string;
  created_at?: string;
}

export interface Program {
  id: string;
  name: string;
  description?: string;
  school_id?: string;  // Added school_id to associate programs with schools
  created_at?: string;
}

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: SchoolDepartment;
  avatar?: string;
  teamLeadId?: string; // Reference to team lead for sales executives
  teamName?: string; // Added for UI display purposes
  school_id?: string; // Reference to school
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
  icon?: LucideIcon;
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
  avatar?: string; // Added avatar property
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
  conversion_ratio?: number;
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
  mobile_number?: string;
  email?: string;
  course_name: string;
  tenure?: string;
  mode_of_learning?: string;
  batch_name?: string;
  amount_paid: number;
  total_sale_value: number;
  remaining_amount: number;
  school_id: string;
  created_at?: string;
}
