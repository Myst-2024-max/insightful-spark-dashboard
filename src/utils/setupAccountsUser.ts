
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/lib/types';

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

export const createAccountsUser = async () => {
  return await setupAccountsUser();
};
