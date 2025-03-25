
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Program } from '@/lib/types';
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
});

const ProgramForm: React.FC<ProgramFormProps> = ({ existingProgram, onSave, onCancel }) => {
  const isEditing = !!existingProgram;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: existingProgram?.name || '',
      description: existingProgram?.description || '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const programData = { ...values };
      
      if (isEditing) {
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
    } catch (error) {
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
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="A comprehensive program covering frontend and backend development..." 
                    className="min-h-32"
                    {...field} 
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
