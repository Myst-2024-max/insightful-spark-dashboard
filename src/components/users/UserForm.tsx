
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserRole, SchoolDepartment } from '@/lib/types';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface HacaUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string | null;
  password?: string;
  avatar: string | null;
  active: boolean;
  created_at: string;
}

interface UserFormProps {
  existingUser: HacaUser | null;
  onSave: () => void;
  onCancel: () => void;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  role: z.string({
    required_error: "Please select a role.",
  }),
  department: z.string().nullable().optional(),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }).or(z.literal('')),
  avatar: z.string().nullable().optional(),
});

const UserForm: React.FC<UserFormProps> = ({ existingUser, onSave, onCancel }) => {
  const isEditing = !!existingUser;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: existingUser?.name || '',
      email: existingUser?.email || '',
      role: existingUser?.role || '',
      department: existingUser?.department || null,
      password: '',
      avatar: existingUser?.avatar || null,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userData = { ...values };
      
      // If password is empty and we're editing, remove it from the update
      if (isEditing && !userData.password) {
        delete userData.password;
      }
      
      // Generate avatar if not provided
      if (!userData.avatar) {
        userData.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=0159FF&color=fff`;
      }

      if (isEditing) {
        const { error } = await supabase
          .from('haca_users')
          .update(userData)
          .eq('id', existingUser.id);

        if (error) throw error;
        toast.success('User updated successfully');
      } else {
        const { error } = await supabase
          .from('haca_users')
          .insert([userData]);

        if (error) throw error;
        toast.success('User created successfully');
      }
      
      onSave();
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} user`);
    }
  };

  const needsDepartment = form.watch('role') === UserRole.PROJECT_LEAD;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-6">
        {isEditing ? 'Edit User' : 'Create New User'}
      </h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Jane Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="jane@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(UserRole).map((role) => (
                        <SelectItem key={role} value={role}>
                          {role.replace(/_/g, ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {needsDepartment && (
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(SchoolDepartment).map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept} School
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{isEditing ? 'New Password (leave blank to keep current)' : 'Password'}</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder={isEditing ? "Leave blank to keep current password" : "Enter password"} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar URL (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://example.com/avatar.jpg" 
                      {...field} 
                      value={field.value || ''} 
                      onChange={(e) => field.onChange(e.target.value || null)}
                    />
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
              {isEditing ? 'Update User' : 'Create User'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UserForm;
