import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, UserRole, SchoolDepartment, School, HacaUser, hacaUserToUser } from '@/lib/types';
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
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/components/auth/AuthContext';

interface UserFormProps {
  existingUser: User | null;
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
  password: z.string().optional(),
  role: z.nativeEnum(UserRole),
  department: z.nativeEnum(SchoolDepartment).optional(),
  avatar: z.string().optional(),
  active: z.boolean().default(true),
  team_lead_id: z.string().optional(),
  school_id: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const UserForm: React.FC<UserFormProps> = ({ existingUser, onSave, onCancel }) => {
  const { user: currentUser } = useAuth();
  const isEditing = !!existingUser;
  const [submitting, setSubmitting] = useState(false);
  const [teamLeads, setTeamLeads] = useState<User[]>([]);
  const [schools, setSchools] = useState<School[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: existingUser?.name || '',
      email: existingUser?.email || '',
      password: '',
      role: existingUser?.role || UserRole.SALES_EXECUTIVE,
      department: existingUser?.department,
      avatar: existingUser?.avatar || '',
      active: existingUser ? !!existingUser.active : true,
      team_lead_id: existingUser?.teamLeadId || '',
      school_id: existingUser?.school_id || '',
    },
  });

  const selectedRole = form.watch('role');

  useEffect(() => {
    fetchTeamLeads();
    fetchSchools();
  }, []);

  const fetchTeamLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('haca_users')
        .select('*')
        .eq('role', UserRole.TEAM_LEAD)
        .order('name');

      if (error) throw error;
      
      setTeamLeads((data || []).map(hacaUserToUser));
    } catch (err) {
      console.error('Error fetching team leads:', err);
    }
  };

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

  const onSubmit = async (values: FormValues) => {
    try {
      setSubmitting(true);

      // Basic validation
      if (!values.email || !values.name || !values.role) {
        toast.error('Please fill out all required fields');
        return;
      }

      const userData = {
        active: values.active,
        created_by: currentUser?.id || '',
        name: values.name,
        email: values.email,
        role: values.role,
        department: values.department || null,
        avatar: values.avatar || null,
        team_lead_id: values.team_lead_id || null,
        school_id: values.school_id || null,
      };

      if (isEditing && existingUser) {
        // When updating, don't send the password
        const { error } = await supabase
          .from('haca_users')
          .update(userData)
          .eq('id', existingUser.id);

        if (error) {
          console.error('Error updating user:', error);
          toast.error('Failed to update user: ' + error.message);
          return;
        }
        toast.success('User updated successfully');
      } else {
        // For new users, require a password
        if (!values.password) {
          toast.error('Password is required for new users');
          return;
        }

        // Include password only when creating new users
        const { error } = await supabase
          .from('haca_users')
          .insert({
            ...userData,
            password: values.password,
          });

        if (error) {
          console.error('Error creating user:', error);
          toast.error('Failed to create user: ' + error.message);
          return;
        }
        toast.success('User created successfully');
      }

      onSave();
    } catch (error: any) {
      console.error('Error saving user:', error);
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} user`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-6">
        {isEditing ? 'Edit User' : 'Create New User'}
      </h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {!isEditing && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Required for new users only.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/avatar.jpg" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Role and Department */}
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
            
            {selectedRole === UserRole.PROJECT_LEAD && (
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(SchoolDepartment).map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {selectedRole === UserRole.SALES_EXECUTIVE && (
              <FormField
                control={form.control}
                name="team_lead_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Lead</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a team lead" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {teamLeads.map((lead) => (
                          <SelectItem key={lead.id} value={lead.id}>
                            {lead.name}
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
            
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active Status</FormLabel>
                    <FormDescription>
                      Inactive users cannot log in to the system.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : isEditing ? 'Update User' : 'Create User'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UserForm;
