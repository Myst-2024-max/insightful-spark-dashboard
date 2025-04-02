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
    console.log(`Fetching team leads for department: ${department}`);
    
    const { data, error } = await supabase
      .from('haca_users')
      .select('id, name')
      .eq('role', UserRole.TEAM_LEAD)
      .eq('department', department)
      .eq('active', true);
      
    if (error) {
      console.error(`Error fetching team leads for department ${department}:`, error);
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
    const updateData = projectLeadId ? { project_lead_id: projectLeadId } : { project_lead_id: null };
    
    const { error } = await supabase
      .from('haca_users')
      .update(updateData)
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

    // Fetch the actual performance data from the sales_data table
    const executiveIds = data.map(member => member.id);

    // Try to get real performance data from the sales_data table
    const { data: salesData, error: salesError } = await supabase
      .from('sales_data')
      .select('user_id, incentive_target, achieved_amount')
      .in('user_id', executiveIds);

    if (salesError) {
      console.error("Error fetching sales data:", salesError);
    }

    // Map the sales data to the executives
    const salesDataMap = new Map();
    
    if (salesData && salesData.length > 0) {
      salesData.forEach(record => {
        salesDataMap.set(record.user_id, {
          targetValue: record.incentive_target,
          achievedValue: record.achieved_amount
        });
      });
    }
    
    // Create performance objects with real data or mock data as fallback
    const performanceData: SalesExecutivePerformance[] = data.map(member => {
      const salesInfo = salesDataMap.get(member.id);
      const targetValue = salesInfo?.targetValue || 100000;
      const achievedValue = salesInfo?.achievedValue || Math.floor(Math.random() * 100000);
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
    
    // Check if we have an existing sales_data entry for this executive
    const { data: existingData, error: checkError } = await supabase
      .from('sales_data')
      .select('id')
      .eq('user_id', executiveId)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking for existing sales data:", checkError);
      throw checkError;
    }

    if (existingData) {
      // Update existing sales data
      const { error: updateError } = await supabase
        .from('sales_data')
        .update({ incentive_target: targetValue })
        .eq('user_id', executiveId);

      if (updateError) {
        console.error("Error updating sales data:", updateError);
        throw updateError;
      }
    } else {
      // Create new sales data for this executive
      const { error: insertError } = await supabase
        .from('sales_data')
        .insert({
          user_id: executiveId,
          incentive_target: targetValue,
          achieved_amount: 0,
          leads_assigned: 0,
          sales_units: 0,
          school_id: '00000000-0000-0000-0000-000000000000', // Placeholder
          program_id: '00000000-0000-0000-0000-000000000000', // Placeholder
        });

      if (insertError) {
        console.error("Error inserting sales data:", insertError);
        throw insertError;
      }
    }
    
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
    
    // Using a different approach to avoid type errors
    const { data, error } = await supabase
      .from('haca_users')
      .select('*')  // Select all columns to ensure we get what we need
      .eq('id', teamLeadId)
      .maybeSingle();
      
    if (error) {
      console.error("Error fetching user's project lead ID:", error);
      // Return default values to prevent undefined errors
      return {
        projectLead: null,
        department: null
      };
    }
    
    if (!data || !data.project_lead_id) {
      console.log("No project lead assigned to this team lead");
      return {
        projectLead: null,
        department: data?.department || null
      };
    }
    
    // Now fetch the project lead details
    const { data: projectLeadData, error: projectLeadError } = await supabase
      .from('haca_users')
      .select('id, name')
      .eq('id', data.project_lead_id)
      .single();
      
    if (projectLeadError) {
      console.error("Error fetching project lead details:", projectLeadError);
      return {
        projectLead: null,
        department: data?.department || null
      };
    }
    
    return {
      projectLead: projectLeadData,
      department: data?.department || null
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
