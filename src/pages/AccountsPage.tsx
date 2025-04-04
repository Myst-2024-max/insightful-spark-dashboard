
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { UserRole } from '@/lib/types';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { DateRange } from "react-day-picker";
import DateFilter from '@/components/dashboard/DateFilter';
import { Plus, FileEdit, Trash2 } from 'lucide-react';
import CustomCard from '@/components/ui/CustomCard';
import AccountForm from '@/components/accounts/AccountForm';
import AccountsTeamDashboard from '@/components/dashboard/AccountsTeamDashboard';

interface AccountData {
  id: string;
  customer_name: string;
  email: string;
  mobile_number: string;
  course_name: string;
  amount_paid: number;
  remaining_amount: number;
  total_sale_value: number;
  date: string;
  batch_name?: string;
  mode_of_learning?: string;
  tenure?: string;
  created_at: string;
}

const AccountsPage = () => {
  const { user, checkUserPermission } = useAuth();
  const [accounts, setAccounts] = useState<AccountData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>({ 
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // First day of current month
    to: new Date() // Today
  });
  const [showForm, setShowForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState<AccountData | null>(null);
  const [showDashboard, setShowDashboard] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAccounts();
      
      // Set up real-time subscription
      const channel = supabase
        .channel('accounts-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'accounts_data'
          },
          () => {
            fetchAccounts();
          }
        )
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, dateRange]);

  const fetchAccounts = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      let query = supabase
        .from('accounts_data')
        .select('*')
        .order('date', { ascending: false });
      
      // Add date range filter if available
      if (dateRange.from) {
        query = query.gte('date', dateRange.from.toISOString().split('T')[0]);
      }
      
      if (dateRange.to) {
        query = query.lte('date', dateRange.to.toISOString().split('T')[0]);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      setAccounts(data || []);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      toast.error('Failed to load accounts data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAccount = () => {
    setEditingAccount(null);
    setShowForm(true);
    setShowDashboard(false);
  };

  const handleEditAccount = (account: AccountData) => {
    setEditingAccount(account);
    setShowForm(true);
    setShowDashboard(false);
  };

  const handleDeleteAccount = async (id: string) => {
    if (!confirm('Are you sure you want to delete this account?')) return;
    
    try {
      const { error } = await supabase
        .from('accounts_data')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      toast.success('Account deleted successfully');
      fetchAccounts();
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account');
    }
  };

  const handleAccountSaved = () => {
    setShowForm(false);
    setShowDashboard(true);
    fetchAccounts();
  };

  const toggleView = () => {
    setShowDashboard(!showDashboard);
    if (showForm) {
      setShowForm(false);
    }
  };

  // Redirect if not authorized
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (!checkUserPermission(UserRole.ACCOUNTS_TEAM) && !checkUserPermission(UserRole.MASTER_ADMIN)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Accounts Management</h1>
          <p className="text-gray-500 mt-2">
            Manage student payment accounts and track revenues
          </p>
        </div>
        <div className="flex gap-4">
          <Button 
            variant={showDashboard ? "outline" : "default"}
            onClick={toggleView}
          >
            {showDashboard ? "View Accounts List" : "View Dashboard"}
          </Button>
          {!showDashboard && (
            <DateFilter dateRange={dateRange} onDateChange={setDateRange} />
          )}
          {!showDashboard && !showForm && (
            <Button onClick={handleAddAccount} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New Account
            </Button>
          )}
        </div>
      </header>

      {showDashboard && (
        <AccountsTeamDashboard />
      )}

      {showForm && (
        <CustomCard className="mb-8">
          <AccountForm 
            existingAccount={editingAccount} 
            onSave={handleAccountSaved} 
            onCancel={() => {
              setShowForm(false); 
              setShowDashboard(true);
            }} 
          />
        </CustomCard>
      )}

      {!showDashboard && !showForm && (
        <CustomCard>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Amount Paid</TableHead>
                  <TableHead>Remaining</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      Loading accounts...
                    </TableCell>
                  </TableRow>
                ) : accounts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      No accounts found. Add your first account to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  accounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell>{new Date(account.date).toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium">{account.customer_name}</TableCell>
                      <TableCell>{account.course_name}</TableCell>
                      <TableCell>₹{account.amount_paid.toLocaleString()}</TableCell>
                      <TableCell>₹{account.remaining_amount.toLocaleString()}</TableCell>
                      <TableCell>₹{account.total_sale_value.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditAccount(account)}
                          >
                            <FileEdit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteAccount(account.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CustomCard>
      )}
    </div>
  );
};

export default AccountsPage;
