
import { simulateMetricChange } from './dashboardUtils';

// Function to simulate updates for a specific department
export const simulateAllUpdates = async (department: string) => {
  try {
    await simulateMetricChange(department);
    console.log(`Simulated updates for ${department} department`);
    return { success: true };
  } catch (error) {
    console.error(`Error simulating updates for ${department}:`, error);
    return { success: false, error };
  }
};
