
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { School } from '@/lib/types';
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

interface SchoolFormProps {
  existingSchool: School | null;
  onSave: () => void;
  onCancel: () => void;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  location: z.string().optional(),
});

const SchoolForm: React.FC<SchoolFormProps> = ({ existingSchool, onSave, onCancel }) => {
  const isEditing = !!existingSchool;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: existingSchool?.name || '',
      location: existingSchool?.location || '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Ensure name is a string with at least some content
      if (!values.name || values.name.trim() === '') {
        toast.error('School name is required');
        return;
      }
      
      const schoolData = { 
        name: values.name, 
        location: values.location 
      };
      
      if (isEditing) {
        const { error } = await supabase
          .from('schools')
          .update(schoolData)
          .eq('id', existingSchool.id);

        if (error) {
          console.error('Error updating school:', error);
          toast.error('Failed to update school: ' + error.message);
          return;
        }
        toast.success('School updated successfully');
      } else {
        const { error } = await supabase
          .from('schools')
          .insert({
            name: values.name,
            location: values.location || null
          });

        if (error) {
          console.error('Error creating school:', error);
          toast.error('Failed to create school: ' + error.message);
          return;
        }
        toast.success('School created successfully');
      }
      
      onSave();
    } catch (error) {
      console.error('Error saving school:', error);
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} school`);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-6">
        {isEditing ? 'Edit School' : 'Create New School'}
      </h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School Name</FormLabel>
                  <FormControl>
                    <Input placeholder="HACA Coding School" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="New York, NY" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? 'Update School' : 'Create School'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SchoolForm;
