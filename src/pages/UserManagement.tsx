
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { UserRole, SchoolDepartment } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Table, TableHeader, TableBody, TableHead, 
  TableRow, TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import UserForm from '@/components/users/UserForm';
import { PlusCircle, Edit, Trash2, Filter } from 'lucide-react';
import CustomCard from '@/components/ui/CustomCard';

interface HacaUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string | null;
  avatar: string | null;
  active: boolean;
  created_at: string;
}

const UserManagement = () => {
  const { user, checkUserPermission, canViewAllDepartments, getCurrentUserDepartment } = useAuth();
  const [users, setUsers] = useState<HacaUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<HacaUser | null>(null);
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // If user can't view all departments, force their department as the filter
  useEffect(() => {
    if (!canViewAllDepartments()) {
      const userDept = getCurrentUserDepartment();
      if (userDept) {
        setDepartmentFilter(userDept);
      }
    }
  }, [canViewAllDepartments, getCurrentUserDepartment]);

  useEffect(() => {
    fetchUsers();
  }, [departmentFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('haca_users')
        .select('*')
        .order('name');
      
      // Apply department filter if set (note: RLS policies will also restrict data)
      if (departmentFilter) {
        query = query.eq('department', departmentFilter);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching users:', error);
        setError('Failed to fetch users. Please try again.');
        toast.error('Failed to load users');
      } else {
        setUsers(data || []);
      }
    } catch (err) {
      console.error('Error in fetchUsers:', err);
      setError('An unexpected error occurred. Please try again.');
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  const handleEditUser = (user: HacaUser) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const { error } = await supabase
        .from('haca_users')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user: ' + error.message);
        return;
      }
      
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const handleUserSaved = () => {
    setShowForm(false);
    fetchUsers();
  };

  const toggleUserStatus = async (user: HacaUser) => {
    try {
      const { error } = await supabase
        .from('haca_users')
        .update({ active: !user.active })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating user status:', error);
        toast.error('Failed to update user status: ' + error.message);
        return;
      }
      
      toast.success(`User ${user.active ? 'deactivated' : 'activated'} successfully`);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };

  // Only MASTER_ADMIN can access this page
  if (!checkUserPermission(UserRole.MASTER_ADMIN)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-gray-600">
          You do not have permission to access this page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-gray-500 mt-2">
            Create and manage user accounts for HACA Academy
          </p>
        </div>
        <div className="flex gap-2">
          {canViewAllDepartments() && (
            <select 
              className="border border-gray-300 rounded px-3 py-2 bg-white"
              value={departmentFilter || ''}
              onChange={(e) => setDepartmentFilter(e.target.value || null)}
            >
              <option value="">All Departments</option>
              {Object.values(SchoolDepartment).map((dept) => (
                <option key={dept} value={dept}>{dept} School</option>
              ))}
            </select>
          )}
          <Button onClick={handleAddUser} className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Add New User
          </Button>
        </div>
      </header>

      {showForm && (
        <CustomCard className="mb-8">
          <UserForm 
            existingUser={editingUser} 
            onSave={handleUserSaved} 
            onCancel={() => setShowForm(false)} 
          />
        </CustomCard>
      )}

      <CustomCard>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    No users found. {users.length === 0 && !departmentFilter ? 'Add your first user to get started.' : ''}
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.department || '-'}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.active ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleUserStatus(user)}
                        >
                          {user.active ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
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
    </div>
  );
};

export default UserManagement;
