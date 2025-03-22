
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

const AccountsTeamDashboard = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const form = useForm({
    defaultValues: {
      customerName: '',
      mobile: '',
      email: '',
      batchName: '',
      amountPaid: '',
      totalSaleValue: '',
      remainingAmount: '',
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
      icon: <DollarSign className="h-5 w-5 text-primary" />,
    },
    {
      id: '2',
      title: 'Active Students',
      value: 875,
      percentChange: 8.1,
      trend: 'up' as const,
      icon: <Users className="h-5 w-5 text-primary" />,
    },
    {
      id: '3',
      title: 'Batches',
      value: 42,
      percentChange: 4.5,
      trend: 'up' as const,
      icon: <BookOpen className="h-5 w-5 text-primary" />,
    },
    {
      id: '4',
      title: 'Next Billing',
      value: 56,
      percentChange: 0,
      trend: 'neutral' as const,
      icon: <Calendar className="h-5 w-5 text-primary" />,
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

  const onSubmit = (data: any) => {
    console.log(data);
    setIsFormOpen(false);
    // Here you would normally update the data in your backend
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
                    <FormField
                      control={form.control}
                      name="mobile"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mobile</FormLabel>
                          <FormControl>
                            <Input placeholder="+91 9876543210" {...field} />
                          </FormControl>
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
                            <Input placeholder="john@example.com" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
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
                    <FormField
                      control={form.control}
                      name="amountPaid"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount Paid (₹)</FormLabel>
                          <FormControl>
                            <Input placeholder="25000" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
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
