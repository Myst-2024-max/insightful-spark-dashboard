
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
      
      // Update the password if it exists
      const { error: updateError } = await supabase
        .from('haca_users')
        .update({
          password: "haca@1234", // Updated password
          active: true
        })
        .eq('id', existingUser.id);
      
      if (updateError) {
        console.error("Error updating accounts user:", updateError);
        throw updateError;
      }
      
      console.log("Successfully updated accounts user password");
      return { success: true, message: "Accounts user already exists, password updated" };
    }
    
    // Create the accounts team user
    const { error: createError } = await supabase
      .from('haca_users')
      .insert({
        name: "Accounts Team",
        email: "account@haca.com",
        password: "haca@1234", // Updated password
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
    
    // Get or create a school for this department
    let schoolId;
    const { data: schoolData, error: schoolError } = await supabase
      .from('schools')
      .select('id')
      .eq('name', `${department} School`)
      .maybeSingle();
      
    if (schoolError) {
      console.error(`Error fetching school for ${department}:`, schoolError);
    }
    
    if (schoolData) {
      schoolId = schoolData.id;
    } else {
      // Create a school for this department if it doesn't exist
      const { data: newSchool, error: createSchoolError } = await supabase
        .from('schools')
        .insert({
          name: `${department} School`,
          location: 'Virtual'
        })
        .select('id')
        .single();
        
      if (createSchoolError) {
        console.error(`Error creating school for ${department}:`, createSchoolError);
        throw createSchoolError;
      }
      
      schoolId = newSchool.id;
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
        school_id: schoolId,
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

// Add a function to create a pre-configured growth user for the Coding department
export const createCodingGrowthUser = async () => {
  return await setupGrowthUser(
    SchoolDepartment.CODING,
    'growth@coding.com',
    'growth@password'
  );
};
