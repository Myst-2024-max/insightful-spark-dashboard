
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';

interface TeamLeadTargetFormProps {
  isFormOpen: boolean;
  setIsFormOpen: (isOpen: boolean) => void;
  salesExecutives: { id: string; name: string }[];
  onSubmit: (data: any) => void;
  initialData?: {
    salesExecutive: string;
    leadTarget: string;
    incentiveTarget: string;
  };
}

const TeamLeadTargetForm = ({ 
  isFormOpen, 
  setIsFormOpen, 
  salesExecutives, 
  onSubmit,
  initialData 
}: TeamLeadTargetFormProps) => {
  const form = useForm({
    defaultValues: initialData || {
      salesExecutive: '',
      leadTarget: '',
      incentiveTarget: ''
    },
  });

  return (
    <Card className="p-6">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Set Targets</CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        {!isFormOpen ? (
          <Button onClick={() => setIsFormOpen(true)}>Set New Target</Button>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="salesExecutive"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sales Executive</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select executive" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {salesExecutives.map(exec => (
                          <SelectItem key={exec.id} value={exec.id}>{exec.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="leadTarget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lead Target</FormLabel>
                    <FormControl>
                      <Input placeholder="45" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="incentiveTarget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Incentive Target (₹)</FormLabel>
                    <FormControl>
                      <Input placeholder="120000" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex space-x-2">
                <Button type="submit">Save Target</Button>
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamLeadTargetForm;
