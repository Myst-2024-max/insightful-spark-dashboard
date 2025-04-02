
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Program, School } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ProgramFormProps {
  existingProgram: Program | null;
  onSave: () => void;
  onCancel: () => void;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  school_id: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const ProgramForm: React.FC<ProgramFormProps> = ({ existingProgram, onSave, onCancel }) => {
  const isEditing = !!existingProgram;
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: existingProgram?.name || '',
      description: existingProgram?.description || '',
      school_id: existingProgram?.school_id || '',
    },
  });

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .order('name');

      if (error) throw error;
      setSchools(data || []);
    } catch (err) {
      console.error('Error fetching schools:', err);
      toast.error('Failed to load schools');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      // Ensure name is a string with at least some content
      if (!values.name || values.name.trim() === '') {
        toast.error('Program name is required');
        return;
      }
      
      const programData = { 
        name: values.name,
        description: values.description || null,
        school_id: values.school_id || null
      };
      
      if (isEditing && existingProgram) {
        const { error } = await supabase
          .from('programs')
          .update(programData)
          .eq('id', existingProgram.id);

        if (error) {
          console.error('Error updating program:', error);
          toast.error('Failed to update program: ' + error.message);
          return;
        }
        toast.success('Program updated successfully');
      } else {
        const { error } = await supabase
          .from('programs')
          .insert(programData);

        if (error) {
          console.error('Error creating program:', error);
          toast.error('Failed to create program: ' + error.message);
          return;
        }
        toast.success('Program created successfully');
      }
      
      onSave();
    } catch (error: any) {
      console.error('Error saving program:', error);
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} program`);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-6">
        {isEditing ? 'Edit Program' : 'Create New Program'}
      </h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Web Development" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="school_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School (Optional)</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a school" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {schools.map((school) => (
                        <SelectItem key={school.id} value={school.id}>
                          {school.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="A comprehensive program covering frontend and backend development..." 
                    className="min-h-32"
                    {...field} 
                    value={field.value || ''} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? 'Update Program' : 'Create Program'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProgramForm;
