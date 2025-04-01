
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { UserRole, Program, School } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Table, TableHeader, TableBody, TableHead, 
  TableRow, TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import CustomCard from '@/components/ui/CustomCard';
import ProgramForm from '@/components/programs/ProgramForm';

const ProgramManagement = () => {
  const { checkUserPermission } = useAuth();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPrograms();
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .order('name');

      if (error) throw error;
      setSchools(data || []);
    } catch (err) {
      console.error('Error fetching schools:', err);
    }
  };

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('programs')
        .select('*, schools(name)')
        .order('name');

      if (error) {
        console.error('Error fetching programs:', error);
        setError('Failed to fetch programs. Please try again.');
        toast.error('Failed to load programs');
      } else {
        setPrograms(data || []);
      }
    } catch (err) {
      console.error('Error in fetchPrograms:', err);
      setError('An unexpected error occurred. Please try again.');
      toast.error('Failed to load programs');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProgram = () => {
    setEditingProgram(null);
    setShowForm(true);
  };

  const handleEditProgram = (program: Program) => {
    setEditingProgram(program);
    setShowForm(true);
  };

  const handleDeleteProgram = async (id: string) => {
    if (!confirm('Are you sure you want to delete this program? This will affect all associated data.')) return;

    try {
      const { error } = await supabase
        .from('programs')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting program:', error);
        toast.error('Failed to delete program: ' + error.message);
        return;
      }
      
      toast.success('Program deleted successfully');
      fetchPrograms();
    } catch (error) {
      console.error('Error deleting program:', error);
      toast.error('Failed to delete program');
    }
  };

  const handleProgramSaved = () => {
    setShowForm(false);
    fetchPrograms();
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
          <h1 className="text-3xl font-bold">Program Management</h1>
          <p className="text-gray-500 mt-2">
            Create and manage programs for HACA Academy
          </p>
        </div>
        <Button onClick={handleAddProgram} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Add New Program
        </Button>
      </header>

      {showForm && (
        <CustomCard className="mb-8">
          <ProgramForm 
            existingProgram={editingProgram} 
            onSave={handleProgramSaved} 
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
                <TableHead>Description</TableHead>
                <TableHead>School</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    Loading programs...
                  </TableCell>
                </TableRow>
              ) : programs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    No programs found. Add your first program to get started.
                  </TableCell>
                </TableRow>
              ) : (
                programs.map((program) => (
                  <TableRow key={program.id}>
                    <TableCell className="font-medium">{program.name}</TableCell>
                    <TableCell>{program.description || '-'}</TableCell>
                    <TableCell>{program.school?.name || '-'}</TableCell>
                    <TableCell>{new Date(program.created_at || '').toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditProgram(program)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteProgram(program.id)}
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

export default ProgramManagement;
