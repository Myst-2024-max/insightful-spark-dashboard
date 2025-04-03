
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { createAccountsUser } from '@/utils/setupAccountsUser';
import { useAuth } from '@/components/auth/AuthContext';
import { UserRole } from '@/lib/types';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const AccountsSetup = () => {
  const { toast } = useToast();
  const { user, checkUserPermission } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [accountsUsers, setAccountsUsers] = useState<{id: string, name: string, email: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchAccountsUsers = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('haca_users')
          .select('id, name, email')
          .eq('role', UserRole.ACCOUNTS_TEAM)
          .eq('active', true);
        
        if (error) throw error;
        setAccountsUsers(data || []);
      } catch (error) {
        console.error('Error fetching accounts users:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch accounts team users',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAccountsUsers();
  }, [toast]);
  
  // Only allow master admin to access this page
  if (!user || !checkUserPermission(UserRole.MASTER_ADMIN)) {
    return <Navigate to="/unauthorized" replace />;
  }

  const handleCreateAccountsUser = async () => {
    setIsCreating(true);
    try {
      const result = await createAccountsUser();
      
      if (result.success) {
        toast({
          title: 'Success',
          description: 'Accounts team user created successfully',
        });
        
        // Refresh the list
        const { data } = await supabase
          .from('haca_users')
          .select('id, name, email')
          .eq('role', UserRole.ACCOUNTS_TEAM)
          .eq('active', true);
        
        setAccountsUsers(data || []);
      } else {
        toast({
          title: 'Error',
          description: result.message || 'Failed to create accounts team user',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error creating accounts user:', error);
      toast({
        title: 'Error',
        description: 'Failed to create accounts team user',
        variant: 'destructive'
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Accounts Team Setup</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Create Accounts Team User</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            This will create a standard accounts team user with the following credentials:
          </p>
          <div className="space-y-2 p-4 bg-gray-50 rounded-md">
            <div><strong>Email:</strong> account@haca.com</div>
            <div><strong>Password:</strong> account@haca</div>
            <div><strong>Role:</strong> Accounts Team</div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleCreateAccountsUser} 
            disabled={isCreating}
          >
            {isCreating ? 'Creating...' : 'Create Accounts User'}
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Existing Accounts Team Users</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading accounts users...</div>
          ) : accountsUsers.length > 0 ? (
            <div className="space-y-4">
              {accountsUsers.map(user => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-md">
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No accounts team users found. Create one using the form above.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountsSetup;
