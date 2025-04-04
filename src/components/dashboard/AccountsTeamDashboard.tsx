
import React, { useState } from 'react';
import { DollarSign, Users, BookOpen, Calendar } from 'lucide-react';
import CustomCard from '@/components/ui/CustomCard';
import DataCard from '@/components/dashboard/DataCard';
import ChartCard from '@/components/dashboard/ChartCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/components/auth/AuthContext';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  paymentDate: z.date({
    required_error: "Date of payment is required",
  }),
  customerName: z.string().min(1, "Customer name is required"),
  mobileNumber: z.string().min(10, "Valid mobile number is required"),
  email: z.string().email("Valid email is required"),
  courseName: z.string().min(1, "Course name is required"),
  courseTenure: z.string().min(1, "Course tenure is required"),
  modeOfLearning: z.string().min(1, "Mode of learning is required"),
  batchName: z.string().min(1, "Batch name is required"),
  amountPaid: z.string().min(1, "Amount paid is required"),
  totalSaleValue: z.string().min(1, "Total sale value is required"),
  remainingAmount: z.string().min(1, "Remaining amount is required"),
});

type FormValues = z.infer<typeof formSchema>;

const AccountsTeamDashboard = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { user } = useAuth();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: '',
      mobileNumber: '',
      email: '',
      batchName: '',
      amountPaid: '',
      totalSaleValue: '',
      remainingAmount: '',
      courseName: '',
      courseTenure: '',
      modeOfLearning: 'online'
    },
  });
  
  const analyticsData = [
    {
      id: '1',
      title: 'Total Payments',
      value: 425000,
      percentChange: 12.5,
      trend: 'up' as const,
      icon: DollarSign,
    },
    {
      id: '2',
      title: 'Active Students',
      value: 875,
      percentChange: 8.1,
      trend: 'up' as const,
      icon: Users,
    },
    {
      id: '3',
      title: 'Batches',
      value: 42,
      percentChange: 4.5,
      trend: 'up' as const,
      icon: BookOpen,
    },
    {
      id: '4',
      title: 'Next Billing',
      value: 56,
      percentChange: 0,
      trend: 'neutral' as const,
      icon: Calendar,
    },
  ];
  
  const paymentHistoryData = [
    { name: 'Jan', amount: 32000 },
    { name: 'Feb', amount: 38000 },
    { name: 'Mar', amount: 41000 },
    { name: 'Apr', amount: 45000 },
    { name: 'May', amount: 48000 },
    { name: 'Jun', amount: 51000 },
    { name: 'Jul', amount: 56000 },
    { name: 'Aug', amount: 62000 },
    { name: 'Sep', amount: 52000 },
  ];
  
  const modeOfLearningData = [
    { name: 'Online', value: 65 },
    { name: 'Hybrid', value: 25 },
    { name: 'Offline', value: 10 },
  ];
  
  const paymentStatusData = [
    { name: 'Full Payment', value: 45 },
    { name: 'Partial Payment', value: 38 },
    { name: 'Pending', value: 17 },
  ];

  const onSubmit = async (data: FormValues) => {
    try {
      // Calculate the remaining amount if needed
      const amountPaid = parseFloat(data.amountPaid);
      const totalSaleValue = parseFloat(data.totalSaleValue);
      const remainingAmount = totalSaleValue - amountPaid;
      
      // Format date as ISO string for database
      const formattedDate = format(data.paymentDate, 'yyyy-MM-dd');
      
      const { error } = await supabase.from('accounts_data').insert({
        date: formattedDate,
        customer_name: data.customerName,
        mobile_number: data.mobileNumber,
        email: data.email,
        course_name: data.courseName,
        tenure: data.courseTenure,
        mode_of_learning: data.modeOfLearning,
        batch_name: data.batchName,
        amount_paid: amountPaid,
        total_sale_value: totalSaleValue,
        remaining_amount: remainingAmount,
        school_id: '00000000-0000-0000-0000-000000000000', // This should be properly set based on selected school
        user_id: user?.id || '00000000-0000-0000-0000-000000000000', // Use logged in user ID
      });
      
      if (error) {
        console.error('Error saving payment data:', error);
        toast.error('Failed to save payment data');
        return;
      }
      
      toast.success('Payment data saved successfully');
      setIsFormOpen(false);
      form.reset();
    } catch (err) {
      console.error('Error processing payment submission:', err);
      toast.error('An error occurred while processing your request');
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsData.map(data => (
          <DataCard key={data.id} data={data} />
        ))}
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card className="p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle>Add Payment Details</CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            {!isFormOpen ? (
              <Button onClick={() => setIsFormOpen(true)}>Add New Payment</Button>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Date of Payment */}
                    <FormField
                      control={form.control}
                      name="paymentDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date of Payment</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Select date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                                className="pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                        </FormItem>
                      )}
                    />
                    
                    {/* Customer Name */}
                    <FormField
                      control={form.control}
                      name="customerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Customer Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    {/* Mobile Number */}
                    <FormField
                      control={form.control}
                      name="mobileNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mobile Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+91 9876543210" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    {/* Email */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email ID</FormLabel>
                          <FormControl>
                            <Input placeholder="john@example.com" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    {/* Course Name */}
                    <FormField
                      control={form.control}
                      name="courseName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Course Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Web Development" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    {/* Course Tenure */}
                    <FormField
                      control={form.control}
                      name="courseTenure"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Course Tenure</FormLabel>
                          <FormControl>
                            <Input placeholder="6 months" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    {/* Mode of Learning */}
                    <FormField
                      control={form.control}
                      name="modeOfLearning"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mode of Learning</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select mode" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="online">Online</SelectItem>
                              <SelectItem value="offline">Offline</SelectItem>
                              <SelectItem value="hybrid">Hybrid</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    
                    {/* Batch Name */}
                    <FormField
                      control={form.control}
                      name="batchName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Batch Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Web Dev Batch 12" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    {/* Amount Paid Now */}
                    <FormField
                      control={form.control}
                      name="amountPaid"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount Paid Now (₹)</FormLabel>
                          <FormControl>
                            <Input placeholder="25000" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    {/* Total Sale Value */}
                    <FormField
                      control={form.control}
                      name="totalSaleValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Sale Value (₹)</FormLabel>
                          <FormControl>
                            <Input placeholder="50000" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    {/* Remaining Amount */}
                    <FormField
                      control={form.control}
                      name="remainingAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Remaining Amount (₹)</FormLabel>
                          <FormControl>
                            <Input placeholder="25000" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button type="submit">Save Payment</Button>
                    <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard 
          title="Payment History" 
          subtitle="Monthly payment history"
          data={paymentHistoryData}
          type="area"
          dataKey="name"
          categories={['amount']}
          colors={['#0159FF']}
        />
        
        <div className="grid grid-cols-1 gap-6">
          <ChartCard 
            title="Mode of Learning" 
            subtitle="Distribution by mode of learning"
            data={modeOfLearningData}
            type="pie"
            dataKey="value"
            colors={['#0159FF', '#3385FF', '#66A3FF']}
            height={150}
          />
          
          <ChartCard 
            title="Payment Status" 
            subtitle="Distribution by payment status"
            data={paymentStatusData}
            type="pie"
            dataKey="value"
            colors={['#0159FF', '#3385FF', '#66A3FF']}
            height={150}
          />
        </div>
      </div>
    </div>
  );
};

export default AccountsTeamDashboard;
