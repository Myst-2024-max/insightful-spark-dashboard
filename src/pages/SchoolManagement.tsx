
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { UserRole, School } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Table, TableHeader, TableBody, TableHead, 
  TableRow, TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import CustomCard from '@/components/ui/CustomCard';
import SchoolForm from '@/components/schools/SchoolForm';

const SchoolManagement = () => {
  const { checkUserPermission } = useAuth();
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching schools:', error);
        setError('Failed to fetch schools. Please try again.');
        toast.error('Failed to load schools');
      } else {
        setSchools(data || []);
      }
    } catch (err) {
      console.error('Error in fetchSchools:', err);
      setError('An unexpected error occurred. Please try again.');
      toast.error('Failed to load schools');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSchool = () => {
    setEditingSchool(null);
    setShowForm(true);
  };

  const handleEditSchool = (school: School) => {
    setEditingSchool(school);
    setShowForm(true);
  };

  const handleDeleteSchool = async (id: string) => {
    if (!confirm('Are you sure you want to delete this school? This will affect all associated users and data.')) return;

    try {
      const { error } = await supabase
        .from('schools')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting school:', error);
        toast.error('Failed to delete school: ' + error.message);
        return;
      }
      
      toast.success('School deleted successfully');
      fetchSchools();
    } catch (error) {
      console.error('Error deleting school:', error);
      toast.error('Failed to delete school');
    }
  };

  const handleSchoolSaved = () => {
    setShowForm(false);
    fetchSchools();
  };

  if (!checkUserPermission([UserRole.MASTER_ADMIN, UserRole.ACCOUNTS_TEAM])) {
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
          <h1 className="text-3xl font-bold">School Management</h1>
          <p className="text-gray-500 mt-2">
            Create and manage schools for HACA Academy
          </p>
        </div>
        <Button onClick={handleAddSchool} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Add New School
        </Button>
      </header>

      {showForm && (
        <CustomCard className="mb-8">
          <SchoolForm 
            existingSchool={editingSchool} 
            onSave={handleSchoolSaved} 
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
                <TableHead>Location</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10">
                    Loading schools...
                  </TableCell>
                </TableRow>
              ) : schools.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10">
                    No schools found. Add your first school to get started.
                  </TableCell>
                </TableRow>
              ) : (
                schools.map((school) => (
                  <TableRow key={school.id}>
                    <TableCell className="font-medium">{school.name}</TableCell>
                    <TableCell>{school.location || '-'}</TableCell>
                    <TableCell>{new Date(school.created_at || '').toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditSchool(school)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteSchool(school.id)}
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

export default SchoolManagement;
