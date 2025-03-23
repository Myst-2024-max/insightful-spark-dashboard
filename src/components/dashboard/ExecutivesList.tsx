
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserCircle } from 'lucide-react';

interface ExecutivesListProps {
  salesExecutives: { id: string; name: string }[];
  selectedExecutive: string | null;
  onSelectExecutive: (id: string) => void;
}

const ExecutivesList = ({ 
  salesExecutives, 
  selectedExecutive, 
  onSelectExecutive 
}: ExecutivesListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Executives</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {salesExecutives.map(exec => (
            <Button 
              key={exec.id} 
              variant={selectedExecutive === exec.id ? "default" : "outline"} 
              className="w-full justify-start"
              onClick={() => onSelectExecutive(exec.id)}
            >
              <UserCircle className="mr-2 h-4 w-4" />
              {exec.name}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExecutivesList;
