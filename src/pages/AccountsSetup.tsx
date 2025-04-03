
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/components/auth/AuthContext';
import { createAccountsUser, createGrowthUser } from '@/utils/setupAccountsUser';
import { SchoolDepartment, UserRole } from '@/lib/types';
import { toast } from 'sonner';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AccountsSetup = () => {
  const { user, checkUserPermission } = useAuth();
  const [accountsLoading, setAccountsLoading] = useState(false);
  const [accountsSuccess, setAccountsSuccess] = useState(false);
  const [accountsError, setAccountsError] = useState<string | null>(null);
  
  const [growthLoading, setGrowthLoading] = useState(false);
  const [growthSuccess, setGrowthSuccess] = useState(false);
  const [growthError, setGrowthError] = useState<string | null>(null);
  const [department, setDepartment] = useState<SchoolDepartment | "">("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSetupAccounts = async () => {
    if (!checkUserPermission(UserRole.MASTER_ADMIN)) {
      toast.error('Only master admin can perform this action');
      return;
    }

    try {
      setAccountsLoading(true);
      setAccountsError(null);
      setAccountsSuccess(false);
      
      const result = await createAccountsUser();
      
      if (result.success) {
        setAccountsSuccess(true);
        toast.success(result.message);
      } else {
        setAccountsError(result.message);
        toast.error(result.message);
      }
    } catch (error: any) {
      console.error('Error setting up accounts user:', error);
      setAccountsError(error.message || 'An unexpected error occurred');
      toast.error('Failed to set up accounts user');
    } finally {
      setAccountsLoading(false);
    }
  };
  
  const handleSetupGrowthUser = async () => {
    if (!checkUserPermission(UserRole.MASTER_ADMIN)) {
      toast.error('Only master admin can perform this action');
      return;
    }
    
    if (!department) {
      toast.error('Please select a department');
      return;
    }
    
    if (!email) {
      toast.error('Please enter an email');
      return;
    }
    
    if (!password || password.length < 6) {
      toast.error('Please enter a password with at least 6 characters');
      return;
    }

    try {
      setGrowthLoading(true);
      setGrowthError(null);
      setGrowthSuccess(false);
      
      const result = await createGrowthUser(department as SchoolDepartment, email, password);
      
      if (result.success) {
        setGrowthSuccess(true);
        toast.success(result.message);
        // Reset form fields
        setDepartment("");
        setEmail("");
        setPassword("");
      } else {
        setGrowthError(result.message);
        toast.error(result.message);
      }
    } catch (error: any) {
      console.error('Error setting up growth user:', error);
      setGrowthError(error.message || 'An unexpected error occurred');
      toast.error('Failed to set up growth user');
    } finally {
      setGrowthLoading(false);
    }
  };

  if (!checkUserPermission(UserRole.MASTER_ADMIN)) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600">
              You do not have permission to access this page. Only master admin users can set up the accounts team.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">System Setup</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Create Accounts Team User</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-600">
              This will create a default accounts team user with the following credentials:
            </p>
            <div className="bg-gray-100 p-4 rounded-md mb-6">
              <p><strong>Email:</strong> account@haca.com</p>
              <p><strong>Password:</strong> account@haca</p>
            </div>
            
            {accountsSuccess && (
              <div className="flex items-center gap-2 text-green-600 mb-4">
                <CheckCircle2 className="h-5 w-5" />
                <span>Accounts user created successfully</span>
              </div>
            )}
            
            {accountsError && (
              <div className="flex items-center gap-2 text-red-600 mb-4">
                <AlertCircle className="h-5 w-5" />
                <span>{accountsError}</span>
              </div>
            )}
            
            <Button 
              onClick={handleSetupAccounts}
              disabled={accountsLoading || accountsSuccess}
              className="w-full"
            >
              {accountsLoading ? 'Creating...' : accountsSuccess ? 'Created Successfully' : 'Create Accounts User'}
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Create Growth Team User</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-600">
              This will create a growth team user for a specific department:
            </p>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">Department</label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(SchoolDepartment).map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="growth@department.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <Input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
              </div>
            </div>
            
            {growthSuccess && (
              <div className="flex items-center gap-2 text-green-600 mb-4">
                <CheckCircle2 className="h-5 w-5" />
                <span>Growth user created successfully</span>
              </div>
            )}
            
            {growthError && (
              <div className="flex items-center gap-2 text-red-600 mb-4">
                <AlertCircle className="h-5 w-5" />
                <span>{growthError}</span>
              </div>
            )}
            
            <Button 
              onClick={handleSetupGrowthUser}
              disabled={growthLoading}
              className="w-full"
            >
              {growthLoading ? 'Creating...' : 'Create Growth User'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccountsSetup;
