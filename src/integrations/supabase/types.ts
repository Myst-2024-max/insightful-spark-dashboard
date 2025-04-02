export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      accounts_data: {
        Row: {
          amount_paid: number
          batch_name: string | null
          course_name: string
          created_at: string | null
          customer_name: string
          date: string
          email: string | null
          id: string
          mobile_number: string | null
          mode_of_learning: string | null
          remaining_amount: number
          school_id: string
          tenure: string | null
          total_sale_value: number
          user_id: string
        }
        Insert: {
          amount_paid?: number
          batch_name?: string | null
          course_name: string
          created_at?: string | null
          customer_name: string
          date: string
          email?: string | null
          id?: string
          mobile_number?: string | null
          mode_of_learning?: string | null
          remaining_amount?: number
          school_id: string
          tenure?: string | null
          total_sale_value?: number
          user_id: string
        }
        Update: {
          amount_paid?: number
          batch_name?: string | null
          course_name?: string
          created_at?: string | null
          customer_name?: string
          date?: string
          email?: string | null
          id?: string
          mobile_number?: string | null
          mode_of_learning?: string | null
          remaining_amount?: number
          school_id?: string
          tenure?: string | null
          total_sale_value?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounts_data_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_data_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "haca_users"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboard_charts: {
        Row: {
          chart_data: Json
          chart_name: string
          created_at: string | null
          department: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          chart_data: Json
          chart_name: string
          created_at?: string | null
          department?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          chart_data?: Json
          chart_name?: string
          created_at?: string | null
          department?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      dashboard_metrics: {
        Row: {
          created_at: string | null
          department: string | null
          id: string
          metric_name: string
          metric_value: number
          percent_change: number | null
          trend: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          id?: string
          metric_name: string
          metric_value: number
          percent_change?: number | null
          trend?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string | null
          id?: string
          metric_name?: string
          metric_value?: number
          percent_change?: number | null
          trend?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      growth_data: {
        Row: {
          achieved_leads: number
          created_at: string | null
          date: string
          id: string
          lead_target: number
          program_id: string
          school_id: string
          spend: number
        }
        Insert: {
          achieved_leads?: number
          created_at?: string | null
          date: string
          id?: string
          lead_target?: number
          program_id: string
          school_id: string
          spend?: number
        }
        Update: {
          achieved_leads?: number
          created_at?: string | null
          date?: string
          id?: string
          lead_target?: number
          program_id?: string
          school_id?: string
          spend?: number
        }
        Relationships: [
          {
            foreignKeyName: "growth_data_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "growth_data_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      haca_users: {
        Row: {
          active: boolean
          avatar: string | null
          created_at: string
          created_by: string | null
          department: string | null
          email: string
          id: string
          name: string
          password: string
          project_lead_id: string | null
          role: string
          school_id: string | null
          team_lead_id: string | null
        }
        Insert: {
          active?: boolean
          avatar?: string | null
          created_at?: string
          created_by?: string | null
          department?: string | null
          email: string
          id?: string
          name: string
          password: string
          project_lead_id?: string | null
          role: string
          school_id?: string | null
          team_lead_id?: string | null
        }
        Update: {
          active?: boolean
          avatar?: string | null
          created_at?: string
          created_by?: string | null
          department?: string | null
          email?: string
          id?: string
          name?: string
          password?: string
          project_lead_id?: string | null
          role?: string
          school_id?: string | null
          team_lead_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "haca_users_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "haca_users_team_lead_id_fkey"
            columns: ["team_lead_id"]
            isOneToOne: false
            referencedRelation: "haca_users"
            referencedColumns: ["id"]
          },
        ]
      }
      master_dashboard: {
        Row: {
          achieved: number
          arppu: number | null
          conversion_ratio: number | null
          cpl: number | null
          created_at: string | null
          deficit: number | null
          fresh_admission_count: number
          fresh_admissions_amount: number
          id: string
          lead_count: number
          revenue_ratio: number | null
          school_id: string | null
          second_emi: number
          spend: number
          total_revenue: number
          total_target: number
        }
        Insert: {
          achieved?: number
          arppu?: number | null
          conversion_ratio?: number | null
          cpl?: number | null
          created_at?: string | null
          deficit?: number | null
          fresh_admission_count?: number
          fresh_admissions_amount?: number
          id?: string
          lead_count?: number
          revenue_ratio?: number | null
          school_id?: string | null
          second_emi?: number
          spend?: number
          total_revenue?: number
          total_target?: number
        }
        Update: {
          achieved?: number
          arppu?: number | null
          conversion_ratio?: number | null
          cpl?: number | null
          created_at?: string | null
          deficit?: number | null
          fresh_admission_count?: number
          fresh_admissions_amount?: number
          id?: string
          lead_count?: number
          revenue_ratio?: number | null
          school_id?: string | null
          second_emi?: number
          spend?: number
          total_revenue?: number
          total_target?: number
        }
        Relationships: [
          {
            foreignKeyName: "master_dashboard_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      programs: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      project_lead_data: {
        Row: {
          arppu: number | null
          conversion_rate: number | null
          cpl: number | null
          created_at: string | null
          fresh_admission_count: number
          fresh_admissions_amount: number
          id: string
          paid_user_target: number
          revenue_ratio: number | null
          school_id: string
          second_emi: number
          spend: number
          target: number
          total_leads_needed: number
          user_id: string
        }
        Insert: {
          arppu?: number | null
          conversion_rate?: number | null
          cpl?: number | null
          created_at?: string | null
          fresh_admission_count?: number
          fresh_admissions_amount?: number
          id?: string
          paid_user_target?: number
          revenue_ratio?: number | null
          school_id: string
          second_emi?: number
          spend?: number
          target?: number
          total_leads_needed?: number
          user_id: string
        }
        Update: {
          arppu?: number | null
          conversion_rate?: number | null
          cpl?: number | null
          created_at?: string | null
          fresh_admission_count?: number
          fresh_admissions_amount?: number
          id?: string
          paid_user_target?: number
          revenue_ratio?: number | null
          school_id?: string
          second_emi?: number
          spend?: number
          target?: number
          total_leads_needed?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_lead_data_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_lead_data_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "haca_users"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_data: {
        Row: {
          achieved_amount: number
          conversion_ratio: number | null
          created_at: string | null
          id: string
          incentive_target: number
          leads_assigned: number
          program_id: string
          sales_units: number
          school_id: string
          user_id: string
        }
        Insert: {
          achieved_amount?: number
          conversion_ratio?: number | null
          created_at?: string | null
          id?: string
          incentive_target?: number
          leads_assigned?: number
          program_id: string
          sales_units?: number
          school_id: string
          user_id: string
        }
        Update: {
          achieved_amount?: number
          conversion_ratio?: number | null
          created_at?: string | null
          id?: string
          incentive_target?: number
          leads_assigned?: number
          program_id?: string
          sales_units?: number
          school_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_data_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_data_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_data_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "haca_users"
            referencedColumns: ["id"]
          },
        ]
      }
      schools: {
        Row: {
          created_at: string | null
          id: string
          location: string | null
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          location?: string | null
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          location?: string | null
          name?: string
        }
        Relationships: []
      }
      team_lead_data: {
        Row: {
          achieved: number
          arppu: number | null
          conversion_ratio: number | null
          cpl: number | null
          created_at: string | null
          deficit: number | null
          fresh_admission_count: number
          fresh_admissions_amount: number
          id: string
          lead_count: number
          revenue_ratio: number | null
          school_id: string
          second_emi: number
          spend: number
          target: number
          team_lead_id: string
        }
        Insert: {
          achieved?: number
          arppu?: number | null
          conversion_ratio?: number | null
          cpl?: number | null
          created_at?: string | null
          deficit?: number | null
          fresh_admission_count?: number
          fresh_admissions_amount?: number
          id?: string
          lead_count?: number
          revenue_ratio?: number | null
          school_id: string
          second_emi?: number
          spend?: number
          target?: number
          team_lead_id: string
        }
        Update: {
          achieved?: number
          arppu?: number | null
          conversion_ratio?: number | null
          cpl?: number | null
          created_at?: string | null
          deficit?: number | null
          fresh_admission_count?: number
          fresh_admissions_amount?: number
          id?: string
          lead_count?: number
          revenue_ratio?: number | null
          school_id?: string
          second_emi?: number
          spend?: number
          target?: number
          team_lead_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_lead_data_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_lead_data_team_lead_id_fkey"
            columns: ["team_lead_id"]
            isOneToOne: false
            referencedRelation: "haca_users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      belongs_to_user_school: {
        Args: {
          check_school_id: string
        }
        Returns: boolean
      }
      get_user_schools: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string | null
          id: string
          location: string | null
          name: string
        }[]
      }
      is_admin_or_accounts_team: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
