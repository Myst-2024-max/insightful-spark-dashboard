
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

export const assignSalesExecutiveToTeam = async (salesExecutiveId: string, teamLeadId: string | null) => {
  try {
    console.log(`Assigning executive ${salesExecutiveId} to team lead: ${teamLeadId}`);
    
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

export const fetchTeamPerformance = async (teamLeadId: string): Promise<SalesExecutivePerformance[]> => {
  try {
    console.log("Fetching team performance for team lead:", teamLeadId);
    
    // Fetch team members (sales executives) that report to this team lead
    const { data, error } = await supabase
      .from('haca_users')
      .select('id, name, avatar')
      .eq('team_lead_id', teamLeadId)
      .eq('role', UserRole.SALES_EXECUTIVE);

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
