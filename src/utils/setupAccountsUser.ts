
import { supabase } from '@/integrations/supabase/client';
import { UserRole, SchoolDepartment } from '@/lib/types';

export const setupAccountsUser = async () => {
  try {
    // Check if the accounts team user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('haca_users')
      .select('id')
      .eq('email', 'account@haca.com')
      .maybeSingle();
    
    if (checkError) {
      console.error("Error checking if accounts user exists:", checkError);
      throw checkError;
    }
    
    // If user already exists, no need to create it again
    if (existingUser) {
      console.log("Accounts user already exists");
      return { success: true, message: "Accounts user already exists" };
    }
    
    // Create the accounts team user
    const { error: createError } = await supabase
      .from('haca_users')
      .insert({
        name: "Accounts Team",
        email: "account@haca.com",
        password: "account@haca", // In a real app, this would be hashed
        role: UserRole.ACCOUNTS_TEAM,
        active: true
      });
    
    if (createError) {
      console.error("Error creating accounts user:", createError);
      throw createError;
    }
    
    console.log("Successfully created accounts team user");
    return { success: true, message: "Successfully created accounts team user" };
  } catch (error) {
    console.error("Error in setupAccountsUser:", error);
    return { success: false, error, message: "Failed to create accounts team user" };
  }
};

export const setupGrowthUser = async (department: SchoolDepartment, email: string, password: string) => {
  try {
    // Check if the growth team user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('haca_users')
      .select('id')
      .eq('email', email)
      .maybeSingle();
    
    if (checkError) {
      console.error("Error checking if growth user exists:", checkError);
      throw checkError;
    }
    
    // If user already exists, no need to create it again
    if (existingUser) {
      console.log("Growth user already exists");
      return { success: true, message: "Growth user already exists" };
    }
    
    // Create the growth team user
    const { error: createError } = await supabase
      .from('haca_users')
      .insert({
        name: `${department} Growth Team`,
        email,
        password, // In a real app, this would be hashed
        role: UserRole.GROWTH_TEAM,
        department,
        active: true
      });
    
    if (createError) {
      console.error("Error creating growth user:", createError);
      throw createError;
    }
    
    console.log(`Successfully created growth user for ${department} department`);
    return { success: true, message: `Successfully created growth user for ${department} department` };
  } catch (error) {
    console.error("Error in setupGrowthUser:", error);
    return { success: false, error, message: `Failed to create growth user for ${department} department` };
  }
};

export const createAccountsUser = async () => {
  return await setupAccountsUser();
};

export const createGrowthUser = async (department: SchoolDepartment, email: string, password: string) => {
  return await setupGrowthUser(department, email, password);
};
