
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthContext';
import { UserRole, SchoolDepartment } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { setupAccountsUser, setupGrowthUser } from '@/utils/setupAccountsUser';
import { toast } from 'sonner';

const AccountsSetup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [setupType, setSetupType] = useState<'quick' | 'growth' | 'custom'>('quick');
  const [department, setDepartment] = useState<SchoolDepartment | ''>('');

  const handleQuickSetup = async () => {
    setLoading(true);
    try {
      const result = await setupAccountsUser();
      
      if (result.success) {
        toast.success('Accounts team user created successfully!');
        navigate('/login');
      } else {
        toast.error(result.error || 'Failed to set up accounts team');
      }
    } catch (error) {
      console.error('Error in quick setup:', error);
      toast.error('An error occurred during setup');
    } finally {
      setLoading(false);
    }
  };

  const handleGrowthSetup = async () => {
    if (!department) {
      toast.error('Please select a department');
      return;
    }
    
    setLoading(true);
    try {
      const result = await setupGrowthUser(department as SchoolDepartment);
      
      if (result.success) {
        toast.success(`Growth team user created successfully for ${department} department!`);
        navigate('/login');
      } else {
        toast.error(result.error || 'Failed to set up growth team');
      }
    } catch (error) {
      console.error('Error in growth setup:', error);
      toast.error('An error occurred during setup');
    } finally {
      setLoading(false);
    }
  };

  // Fix for the SchoolDepartment type issue
  const handleDepartmentChange = (value: string) => {
    setDepartment(value as SchoolDepartment | '');
  };

  if (!user || !user.role || user.role !== UserRole.MASTER_ADMIN) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Unauthorized Access</CardTitle>
            <CardDescription>
              You need to be logged in as an admin to access this page.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate('/login')} className="w-full">
              Go to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 max-w-4xl animate-fade-in">
      <h1 className="text-3xl font-bold mb-8">Accounts Setup</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Setup Options</CardTitle>
            <CardDescription>
              Choose how you want to set up user accounts for your academy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              defaultValue={setupType}
              onValueChange={(value) => setSetupType(value as 'quick' | 'growth' | 'custom')}
              className="flex flex-col gap-4"
            >
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="quick" id="quick" />
                <div className="grid gap-1.5">
                  <Label htmlFor="quick" className="font-medium">
                    Quick Setup (Accounts Team)
                  </Label>
                  <p className="text-sm text-gray-500">
                    Creates a pre-configured accounts team user with access to all schools
                  </p>
                  <div className="border rounded p-3 mt-2 bg-gray-50">
                    <p className="text-sm font-medium">User credentials:</p>
                    <p className="text-xs text-gray-500">Email: account@haca.com</p>
                    <p className="text-xs text-gray-500">Password: haca@1234</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="growth" id="growth" />
                <div className="grid gap-1.5">
                  <Label htmlFor="growth" className="font-medium">
                    Growth Team Setup
                  </Label>
                  <p className="text-sm text-gray-500">
                    Creates a pre-configured growth team user for a specific department
                  </p>
                  {setupType === 'growth' && (
                    <div className="mt-4">
                      <Label htmlFor="department">Department</Label>
                      <Select 
                        value={department} 
                        onValueChange={handleDepartmentChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={SchoolDepartment.CODING}>Coding</SelectItem>
                          <SelectItem value={SchoolDepartment.DESIGN}>Design</SelectItem>
                          <SelectItem value={SchoolDepartment.MARKETING}>Marketing</SelectItem>
                          <SelectItem value={SchoolDepartment.FINANCE}>Finance</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <div className="border rounded p-3 mt-4 bg-gray-50">
                        <p className="text-sm font-medium">User credentials:</p>
                        <p className="text-xs text-gray-500">Email: growth-{department.toLowerCase() || 'department'}@haca.com</p>
                        <p className="text-xs text-gray-500">Password: haca@1234</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              onClick={setupType === 'quick' ? handleQuickSetup : handleGrowthSetup}
              disabled={loading || (setupType === 'growth' && !department)}
            >
              {loading ? 'Setting up...' : 'Create Account'}
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Custom Setup</CardTitle>
            <CardDescription>For advanced users and custom configurations</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              If you need more control over user permissions, roles, and account settings, use the User Management page to create and configure users individually.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => navigate('/users')}>
              Go to User Management
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AccountsSetup;
