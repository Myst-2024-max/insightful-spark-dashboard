import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/components/auth/AuthContext';
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

interface AccountFormProps {
  existingAccount: any | null;
  onSave: () => void;
  onCancel: () => void;
}

const formSchema = z.object({
  customer_name: z.string().min(2, { message: 'Customer name is required' }),
  email: z.string().email({ message: 'Please enter a valid email' }).optional().or(z.literal('')),
  mobile_number: z.string().optional().or(z.literal('')),
  course_name: z.string().min(1, { message: 'Course name is required' }),
  amount_paid: z.coerce.number().min(0, { message: 'Amount must be a positive number' }),
  remaining_amount: z.coerce.number().min(0, { message: 'Amount must be a positive number' }),
  total_sale_value: z.coerce.number().min(0, { message: 'Amount must be a positive number' }),
  date: z.string().min(1, { message: 'Date is required' }),
  batch_name: z.string().optional().or(z.literal('')),
  mode_of_learning: z.string().optional().or(z.literal('')),
  tenure: z.string().optional().or(z.literal('')),
  school_id: z.string().min(1, { message: 'School is required' }),
});

type FormValues = z.infer<typeof formSchema>;

const AccountForm: React.FC<AccountFormProps> = ({ existingAccount, onSave, onCancel }) => {
  const { user } = useAuth();
  const [schools, setSchools] = useState<{ id: string; name: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const isEditing = !!existingAccount;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer_name: existingAccount?.customer_name || '',
      email: existingAccount?.email || '',
      mobile_number: existingAccount?.mobile_number || '',
      course_name: existingAccount?.course_name || '',
      amount_paid: existingAccount?.amount_paid || 0,
      remaining_amount: existingAccount?.remaining_amount || 0,
      total_sale_value: existingAccount?.total_sale_value || 0,
      date: existingAccount?.date || new Date().toISOString().split('T')[0],
      batch_name: existingAccount?.batch_name || '',
      mode_of_learning: existingAccount?.mode_of_learning || '',
      tenure: existingAccount?.tenure || '',
      school_id: existingAccount?.school_id || '',
    },
  });

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const { data, error } = await supabase
        .from('schools')
        .select('id, name')
        .order('name', { ascending: true });

      if (error) throw error;
      setSchools(data || []);
      
      // If there's only one school and no school is selected, select it automatically
      if (data && data.length === 1 && !form.getValues('school_id')) {
        form.setValue('school_id', data[0].id);
      }
    } catch (error) {
      console.error('Error fetching schools:', error);
      toast.error('Failed to load schools');
    }
  };

  const onSubmit = async (values: FormValues) => {
    if (!user) {
      toast.error('You must be logged in to create/edit accounts');
      return;
    }

    setSubmitting(true);
    try {
      const accountData = {
        ...values,
        user_id: user.id,
      };

      if (isEditing) {
        const { error } = await supabase
          .from('accounts_data')
          .update(accountData)
          .eq('id', existingAccount.id);

        if (error) throw error;
        toast.success('Account updated successfully');
      } else {
        const { error } = await supabase
          .from('accounts_data')
          .insert(accountData);

        if (error) throw error;
        toast.success('Account created successfully');
      }

      onSave();
    } catch (error: any) {
      console.error('Error saving account:', error);
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} account: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate total automatically when amount_paid or remaining_amount changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'amount_paid' || name === 'remaining_amount') {
        const amountPaid = parseFloat(value.amount_paid as unknown as string) || 0;
        const remainingAmount = parseFloat(value.remaining_amount as unknown as string) || 0;
        form.setValue('total_sale_value', amountPaid + remainingAmount);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form.watch]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-6">
        {isEditing ? 'Edit Account' : 'Create New Account'}
      </h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="customer_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Name</FormLabel>
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
                  <FormLabel>Email (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="john@example.com" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="mobile_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Number (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="+91 9876543210" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="course_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Full Stack Development" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="batch_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Batch Name (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Morning Batch" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="mode_of_learning"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mode of Learning (Optional)</FormLabel>
                  <Select
                    value={field.value || ''}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select mode" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      <SelectItem value="Online">Online</SelectItem>
                      <SelectItem value="Offline">Offline</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="tenure"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tenure (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="6 months" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="amount_paid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount Paid (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="50000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="remaining_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remaining Amount (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="30000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="total_sale_value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Sale Value (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" readOnly {...field} />
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
                  <FormLabel>School</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select school" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
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
          
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : isEditing ? 'Update Account' : 'Create Account'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AccountForm;
