
import { supabase } from '@/integrations/supabase/client';

// Function to get a random number between min and max
const getRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Function to get a random delta for percent change
const getRandomDelta = () => {
  return (Math.random() * 6 - 3).toFixed(1); // Random value between -3 and +3
};

// Function to simulate metric updates
export const simulateMetricUpdate = async (department: string, metricName: string) => {
  try {
    // Get current metric value
    const { data, error } = await supabase
      .from('dashboard_metrics')
      .select('metric_value, percent_change')
      .eq('department', department)
      .eq('metric_name', metricName)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Metric not found');

    // Calculate new values with small random changes
    const percentDelta = parseFloat(getRandomDelta());
    const newPercentChange = data.percent_change + percentDelta;
    const valueDelta = data.metric_value * (percentDelta / 100);
    const newValue = data.metric_value + valueDelta;

    // Update the metric
    const { error: updateError } = await supabase
      .from('dashboard_metrics')
      .update({
        metric_value: newValue,
        percent_change: newPercentChange,
        trend: percentDelta > 0 ? 'up' : percentDelta < 0 ? 'down' : 'neutral',
        updated_at: new Date().toISOString()
      })
      .eq('department', department)
      .eq('metric_name', metricName);

    if (updateError) throw updateError;
    
    return { success: true, newValue, newPercentChange };
  } catch (error) {
    console.error('Error simulating metric update:', error);
    return { success: false, error };
  }
};

// Function to simulate chart data updates
export const simulateChartUpdate = async (department: string, chartName: string) => {
  try {
    // Get current chart data
    const { data, error } = await supabase
      .from('dashboard_charts')
      .select('chart_data')
      .eq('department', department)
      .eq('chart_name', chartName)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Chart not found');

    // Parse the chart data
    const chartData = JSON.parse(data.chart_data);
    
    // Apply small random changes to the data
    // The implementation depends on the chart type
    const updatedChartData = chartData.map((item: any) => {
      // Clone the item
      const newItem = { ...item };
      
      // Update numeric values with small random changes
      Object.keys(newItem).forEach(key => {
        if (typeof newItem[key] === 'number') {
          const change = newItem[key] * (Math.random() * 0.1 - 0.05); // -5% to +5% change
          newItem[key] = Math.max(0, newItem[key] + change); // Ensure we don't go negative
        }
      });
      
      return newItem;
    });

    // Update the chart data
    const { error: updateError } = await supabase
      .from('dashboard_charts')
      .update({
        chart_data: JSON.stringify(updatedChartData),
        updated_at: new Date().toISOString()
      })
      .eq('department', department)
      .eq('chart_name', chartName);

    if (updateError) throw updateError;
    
    return { success: true, updatedChartData };
  } catch (error) {
    console.error('Error simulating chart update:', error);
    return { success: false, error };
  }
};

// Function to simulate updates for all metrics and charts for a department
export const simulateAllUpdates = async (department: string) => {
  try {
    // Get all metrics for the department
    const { data: metrics, error: metricsError } = await supabase
      .from('dashboard_metrics')
      .select('metric_name')
      .eq('department', department);

    if (metricsError) throw metricsError;

    // Update each metric
    for (const metric of metrics) {
      await simulateMetricUpdate(department, metric.metric_name);
    }

    // Get all charts for the department
    const { data: charts, error: chartsError } = await supabase
      .from('dashboard_charts')
      .select('chart_name')
      .eq('department', department);

    if (chartsError) throw chartsError;

    // Update each chart
    for (const chart of charts) {
      await simulateChartUpdate(department, chart.chart_name);
    }

    return { success: true };
  } catch (error) {
    console.error('Error simulating all updates:', error);
    return { success: false, error };
  }
};
