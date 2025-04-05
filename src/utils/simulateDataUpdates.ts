
import { simulateMetricChange } from './dashboardUtils';
import { supabase } from '@/integrations/supabase/client';

// Function to simulate updates for a specific department
export const simulateAllUpdates = async (department: string) => {
  try {
    // First, simulate changes to metrics
    await simulateMetricChange(department);
    console.log(`Simulated metric updates for ${department} department`);
    
    // Also update a chart to demonstrate chart updates
    const randomChange = Math.random() * 0.2 - 0.1; // Random change between -10% and +10%
    
    // Get existing chart data
    const { data: chartsData, error: chartsError } = await supabase
      .from('dashboard_charts')
      .select('*')
      .eq('department', department)
      .eq('chart_name', 'Monthly Performance')
      .limit(1);
    
    if (chartsError) throw chartsError;
    
    if (chartsData && chartsData.length > 0) {
      const chart = chartsData[0];
      let chartData = [];
      
      try {
        chartData = typeof chart.chart_data === 'string'
          ? JSON.parse(chart.chart_data)
          : chart.chart_data || [];
          
        // Update chart data with random changes
        chartData = chartData.map((item: any) => ({
          ...item,
          achieved: Math.max(0, item.achieved * (1 + randomChange))
        }));
        
        // Save updated chart data
        const { error: updateError } = await supabase
          .from('dashboard_charts')
          .update({ 
            chart_data: chartData,
            updated_at: new Date().toISOString()
          })
          .eq('id', chart.id);
          
        if (updateError) throw updateError;
      } catch (error) {
        console.error('Error updating chart data:', error);
      }
    }
    
    // Now simulate changes to accounts data if appropriate
    if (department === 'CODING' || department === 'DESIGN') {
      const { error: accountsError } = await supabase
        .from('accounts_data')
        .upsert([
          {
            customer_name: `Test Customer ${Math.floor(Math.random() * 1000)}`,
            date: new Date().toISOString().split('T')[0],
            amount_paid: Math.floor(Math.random() * 10000) + 5000,
            total_sale_value: Math.floor(Math.random() * 50000) + 15000,
            remaining_amount: Math.floor(Math.random() * 10000),
            course_name: department === 'CODING' ? 'Web Development' : 'UI/UX Design',
            school_id: '00000000-0000-0000-0000-000000000000',
            user_id: '00000000-0000-0000-0000-000000000000'
          }
        ]);
        
      if (accountsError) {
        console.error('Error simulating accounts data:', accountsError);
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error(`Error simulating updates for ${department}:`, error);
    return { success: false, error };
  }
};
