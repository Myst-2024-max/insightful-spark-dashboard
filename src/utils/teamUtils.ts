
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/lib/types';

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
