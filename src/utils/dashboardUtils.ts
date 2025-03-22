import { DollarSign, Users, BarChart4, Zap, TrendingUp, Target, LucideIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export const getIconForMetric = (metricName: string): LucideIcon => {
  switch (metricName) {
    case 'Total Revenue':
    case 'ARPPU':
    case 'CPL':
    case 'Second EMI':
      return DollarSign;
    case 'Lead Count':
    case 'Total Leads Needed':
      return Users;
    case 'Conversion Ratio':
      return BarChart4;
    case 'Spend-Revenue Ratio':
      return TrendingUp;
    case 'Fresh Admissions':
      return Zap;
    default:
      return Target;
  }
};

export const updateMetric = async (department: string, metricName: string, value: number) => {
  try {
    const { error } = await supabase
      .from('dashboard_metrics')
      .update({ 
        metric_value: value,
        updated_at: new Date().toISOString()
      })
      .eq('department', department)
      .eq('metric_name', metricName);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error updating metric:', error);
    return { success: false, error };
  }
};

export const updateChartData = async (department: string, chartName: string, chartData: any) => {
  try {
    const { error } = await supabase
      .from('dashboard_charts')
      .update({ 
        chart_data: JSON.stringify(chartData),
        updated_at: new Date().toISOString()
      })
      .eq('department', department)
      .eq('chart_name', chartName);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error updating chart data:', error);
    return { success: false, error };
  }
};

export const addMetric = async (department: string, metricName: string, value: number, trend: 'up' | 'down' | 'neutral', percentChange: number) => {
  try {
    const { error } = await supabase
      .from('dashboard_metrics')
      .insert({
        department,
        metric_name: metricName,
        metric_value: value,
        trend,
        percent_change: percentChange
      });
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error adding metric:', error);
    return { success: false, error };
  }
};

export const simulateMetricChange = async (department: string) => {
  try {
    // Fetch current metrics
    const { data: metrics, error } = await supabase
      .from('dashboard_metrics')
      .select('*')
      .eq('department', department);
    
    if (error) throw error;
    
    // Update each metric with a small random change
    for (const metric of metrics) {
      const randomChange = Math.random() * 0.1 - 0.05; // Random change between -5% and +5%
      const newValue = metric.metric_value * (1 + randomChange);
      const newPercentChange = randomChange > 0 
        ? metric.percent_change + Math.random() * 2 
        : metric.percent_change - Math.random() * 2;
      
      await updateMetric(
        department, 
        metric.metric_name, 
        newValue
      );
      
      // Also update the percent_change and trend
      await supabase
        .from('dashboard_metrics')
        .update({ 
          percent_change: newPercentChange,
          trend: randomChange > 0 ? 'up' : 'down'
        })
        .eq('id', metric.id);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error simulating metric changes:', error);
    return { success: false, error };
  }
};
