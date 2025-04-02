
import { supabase } from '@/integrations/supabase/client';
import { UserRole, SalesExecutivePerformance } from '@/lib/types';

export const fetchTeamLeads = async () => {
  try {
    const { data, error } = await supabase
      .from('haca_users')
      .select('id, name')
      .eq('role', UserRole.TEAM_LEAD)
      .eq('active', true);
      
    if (error) {
      console.error("Error fetching team leads:", error);
      throw error;
    }
    
    console.log("Fetched team leads:", data);
    return data || [];
  } catch (error) {
    console.error('Error in fetchTeamLeads:', error);
    return [];
  }
};

export const fetchProjectLeads = async () => {
  try {
    const { data, error } = await supabase
      .from('haca_users')
      .select('id, name, department')
      .eq('role', UserRole.PROJECT_LEAD)
      .eq('active', true);
      
    if (error) {
      console.error("Error fetching project leads:", error);
      throw error;
    }
    
    console.log("Fetched project leads:", data);
    return data || [];
  } catch (error) {
    console.error('Error in fetchProjectLeads:', error);
    return [];
  }
};

export const fetchTeamLeadsByDepartment = async (department: string) => {
  try {
    const { data, error } = await supabase
      .from('haca_users')
      .select('id, name')
      .eq('role', UserRole.TEAM_LEAD)
      .eq('department', department)
      .eq('active', true);
      
    if (error) {
      console.error("Error fetching team leads for department:", error);
      throw error;
    }
    
    console.log(`Fetched team leads for ${department}:`, data);
    return data || [];
  } catch (error) {
    console.error('Error in fetchTeamLeadsByDepartment:', error);
    return [];
  }
};

export const assignSalesExecutiveToTeam = async (salesExecutiveId: string, teamLeadId: string | null) => {
  try {
    console.log(`Assigning executive ${salesExecutiveId} to team lead: ${teamLeadId}`);
    
    // Create the update object with team_lead_id
    const { error } = await supabase
      .from('haca_users')
      .update({ team_lead_id: teamLeadId })
      .eq('id', salesExecutiveId);
      
    if (error) {
      console.error("Error assigning sales executive to team:", error);
      throw error;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error in assignSalesExecutiveToTeam:', error);
    return { success: false, error };
  }
};

export const assignTeamLeadToProjectLead = async (teamLeadId: string, projectLeadId: string | null) => {
  try {
    console.log(`Assigning team lead ${teamLeadId} to project lead: ${projectLeadId}`);
    
    // Update with project_lead_id
    const { error } = await supabase
      .from('haca_users')
      .update({ project_lead_id: projectLeadId })
      .eq('id', teamLeadId);
      
    if (error) {
      console.error("Error assigning team lead to project lead:", error);
      throw error;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error in assignTeamLeadToProjectLead:', error);
    return { success: false, error };
  }
};

export const fetchTeamPerformance = async (teamLeadId: string): Promise<SalesExecutivePerformance[]> => {
  try {
    console.log("Fetching team performance for team lead:", teamLeadId);
    
    // Fetch team members (sales executives) that report to this team lead
    const { data, error } = await supabase
      .from('haca_users')
      .select('id, name, avatar')
      .eq('team_lead_id', teamLeadId)
      .eq('role', UserRole.SALES_EXECUTIVE)
      .eq('active', true);  // Only include active users

    if (error) {
      console.error("Error fetching team members:", error);
      throw error;
    }

    console.log("Team members for performance:", data);
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // In a real application, we would fetch actual performance data from a database
    // Here we're just generating mock data for demonstration
    const performanceData: SalesExecutivePerformance[] = data.map(member => {
      const achievedValue = Math.floor(Math.random() * 100000);
      const targetValue = 100000;
      const achievementPercentage = Math.floor((achievedValue / targetValue) * 100);
      
      return {
        id: member.id,
        name: member.name,
        targetValue,
        achievedValue,
        achievementPercentage,
        trend: achievementPercentage >= 100 ? 'up' : 'down',
        avatar: member.avatar
      };
    });
    
    return performanceData;
  } catch (error) {
    console.error('Error in fetchTeamPerformance:', error);
    return [];
  }
};

export const updateExecutiveTarget = async (executiveId: string, targetValue: number) => {
  try {
    console.log(`Updating target for executive ${executiveId} to ${targetValue}`);
    
    // In a real application, this would update the target value in the database
    // For now, we're just logging the action
    
    // Simulate a successful response
    return { success: true };
  } catch (error) {
    console.error('Error in updateExecutiveTarget:', error);
    return { success: false, error };
  }
};

export const fetchSalesExecutiveTeamLead = async (executiveId: string) => {
  try {
    console.log("Fetching team lead for sales executive:", executiveId);
    
    // First get the team_lead_id for this executive
    const { data: userData, error: userError } = await supabase
      .from('haca_users')
      .select('team_lead_id')
      .eq('id', executiveId)
      .single();
      
    if (userError) {
      console.error("Error fetching user's team lead ID:", userError);
      throw userError;
    }
    
    if (!userData?.team_lead_id) {
      console.log("No team lead assigned to this executive");
      return null;
    }
    
    // Now fetch the team lead details
    const { data: teamLeadData, error: teamLeadError } = await supabase
      .from('haca_users')
      .select('id, name')
      .eq('id', userData.team_lead_id)
      .single();
      
    if (teamLeadError) {
      console.error("Error fetching team lead details:", teamLeadError);
      throw teamLeadError;
    }
    
    return teamLeadData;
  } catch (error) {
    console.error('Error in fetchSalesExecutiveTeamLead:', error);
    return null;
  }
};

export const fetchTeamLeadProjectLead = async (teamLeadId: string) => {
  try {
    console.log("Fetching project lead for team lead:", teamLeadId);
    
    // First get the project_lead_id for this team lead
    const { data: userData, error: userError } = await supabase
      .from('haca_users')
      .select('project_lead_id, department')
      .eq('id', teamLeadId)
      .single();
      
    if (userError) {
      console.error("Error fetching user's project lead ID:", userError);
      // Return default values to prevent undefined errors
      return {
        projectLead: null,
        department: null
      };
    }
    
    if (!userData || !userData.project_lead_id) {
      console.log("No project lead assigned to this team lead");
      return {
        projectLead: null,
        department: userData?.department || null
      };
    }
    
    // Now fetch the project lead details
    const { data: projectLeadData, error: projectLeadError } = await supabase
      .from('haca_users')
      .select('id, name')
      .eq('id', userData.project_lead_id)
      .single();
      
    if (projectLeadError) {
      console.error("Error fetching project lead details:", projectLeadError);
      return {
        projectLead: null,
        department: userData?.department || null
      };
    }
    
    return {
      projectLead: projectLeadData,
      department: userData?.department || null
    };
  } catch (error) {
    console.error('Error in fetchTeamLeadProjectLead:', error);
    return {
      projectLead: null,
      department: null
    };
  }
};

export const fetchDepartmentProjectLead = async (department: string) => {
  try {
    console.log(`Fetching project lead for department: ${department}`);
    
    const { data, error } = await supabase
      .from('haca_users')
      .select('id, name')
      .eq('role', UserRole.PROJECT_LEAD)
      .eq('department', department)
      .eq('active', true)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        console.log(`No project lead found for ${department} department`);
        return null;
      }
      
      console.error("Error fetching department project lead:", error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in fetchDepartmentProjectLead:', error);
    return null;
  }
};
