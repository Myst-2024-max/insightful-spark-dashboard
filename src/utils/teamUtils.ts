
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
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching team leads:', error);
    return [];
  }
};

export const assignSalesExecutiveToTeam = async (salesExecutiveId: string, teamLeadId: string) => {
  try {
    const { error } = await supabase
      .from('haca_users')
      .update({ team_lead_id: teamLeadId })
      .eq('id', salesExecutiveId);
      
    if (error) {
      throw error;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error assigning sales executive to team:', error);
    return { success: false, error };
  }
};

export const fetchTeamPerformance = async (teamLeadId: string): Promise<SalesExecutivePerformance[]> => {
  try {
    // Fetch team members (sales executives) that report to this team lead
    const { data, error } = await supabase
      .from('haca_users')
      .select('id, name, avatar')
      .eq('team_lead_id', teamLeadId)
      .eq('role', UserRole.SALES_EXECUTIVE);

    if (error) {
      throw error;
    }

    if (!data) {
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
    console.error('Error fetching team performance:', error);
    return [];
  }
};

export const updateExecutiveTarget = async (executiveId: string, targetValue: number) => {
  try {
    // In a real application, this would update the target value in the database
    console.log(`Updating target for executive ${executiveId} to ${targetValue}`);
    
    // Simulate a successful response
    return { success: true };
  } catch (error) {
    console.error('Error updating executive target:', error);
    return { success: false, error };
  }
};
