
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

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: SchoolDepartment;
  avatar?: string;
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
