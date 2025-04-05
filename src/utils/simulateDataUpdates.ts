
import { simulateMetricChange } from './dashboardUtils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
          achieved: Math.max(0, Math.round(item.achieved * (1 + randomChange)))
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
    } else {
      // Create sample chart data if none exists
      const sampleChartData = [
        { name: 'Jan', target: 100000, achieved: 85000 },
        { name: 'Feb', target: 120000, achieved: 95000 },
        { name: 'Mar', target: 90000, achieved: 88000 },
        { name: 'Apr', target: 150000, achieved: 120000 }
      ];
      
      await supabase.from('dashboard_charts').insert({
        chart_name: 'Monthly Performance',
        department: department,
        chart_data: sampleChartData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
    
    // Also update Target Achievement chart data
    const { data: targetData, error: targetError } = await supabase
      .from('dashboard_charts')
      .select('*')
      .eq('department', department)
      .eq('chart_name', 'Target Achievement')
      .limit(1);
      
    if (targetError) throw targetError;
    
    if (targetData && targetData.length > 0) {
      const chart = targetData[0];
      let achievementData = [];
      
      try {
        achievementData = typeof chart.chart_data === 'string'
          ? JSON.parse(chart.chart_data)
          : chart.chart_data || [];
        
        // Generate a new achievement percentage (make sure 'Achieved' + 'Remaining' = 100)
        const newAchieved = Math.floor(Math.random() * 20) + 70; // Random between 70-90%
        achievementData = [
          { name: 'Achieved', value: newAchieved },
          { name: 'Remaining', value: 100 - newAchieved }
        ];
        
        // Save updated chart data
        const { error: updateError } = await supabase
          .from('dashboard_charts')
          .update({ 
            chart_data: achievementData,
            updated_at: new Date().toISOString()
          })
          .eq('id', chart.id);
          
        if (updateError) throw updateError;
      } catch (error) {
        console.error('Error updating target achievement data:', error);
      }
    }
    
    // Now simulate changes to accounts data if appropriate
    if (department === 'CODING' || department === 'DESIGN') {
      const randomNames = [
        'Priya Sharma', 'Raj Patel', 'Arjun Singh', 'Ananya Gupta', 
        'Vikram Mehta', 'Neha Shah', 'Karan Malhotra', 'Divya Reddy'
      ];
      const randomCourses = {
        'CODING': ['Web Development', 'Full Stack JS', 'Python Programming', 'Mobile App Development'],
        'DESIGN': ['UI/UX Design', 'Graphic Design', 'Motion Graphics', 'Design Thinking']
      };
      
      const customerName = randomNames[Math.floor(Math.random() * randomNames.length)];
      const courseName = department === 'CODING' 
        ? randomCourses.CODING[Math.floor(Math.random() * randomCourses.CODING.length)]
        : randomCourses.DESIGN[Math.floor(Math.random() * randomCourses.DESIGN.length)];
      
      const totalValue = Math.floor(Math.random() * 50000) + 30000;
      const paidAmount = Math.floor(totalValue * (Math.random() * 0.6 + 0.2)); // 20-80% of total
      
      const { error: accountsError } = await supabase
        .from('accounts_data')
        .insert([
          {
            customer_name: customerName,
            date: new Date().toISOString().split('T')[0],
            amount_paid: paidAmount,
            total_sale_value: totalValue,
            remaining_amount: totalValue - paidAmount,
            course_name: courseName,
            school_id: '00000000-0000-0000-0000-000000000000',
            user_id: '00000000-0000-0000-0000-000000000000',
            email: `${customerName.toLowerCase().replace(' ', '.')}@example.com`,
            mobile_number: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`,
            mode_of_learning: ['online', 'offline', 'hybrid'][Math.floor(Math.random() * 3)],
            tenure: ['3 months', '6 months', '12 months'][Math.floor(Math.random() * 3)],
            batch_name: `${courseName.slice(0, 3)}-${Math.floor(Math.random() * 100)}`
          }
        ]);
        
      if (accountsError) {
        console.error('Error simulating accounts data:', accountsError);
      } else {
        toast.success(`Added new payment for ${customerName}`);
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error(`Error simulating updates for ${department}:`, error);
    return { success: false, error };
  }
};
