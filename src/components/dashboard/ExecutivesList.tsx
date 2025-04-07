
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ExecutivesListProps {
  salesExecutives: { id: string; name: string; avatar?: string }[];
  selectedExecutive: string | null;
  onSelectExecutive: (id: string) => void;
}

const ExecutivesList = ({ 
  salesExecutives, 
  selectedExecutive, 
  onSelectExecutive 
}: ExecutivesListProps) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  
  const filteredExecutives = salesExecutives.filter(exec => 
    exec.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getInitials = (name: string) => {
    return name.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center justify-between">
          <span>Sales Executives</span>
          <span className="text-sm text-muted-foreground font-normal">
            {filteredExecutives.length} executives
          </span>
        </CardTitle>
        <div className="relative mt-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search executives..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-2">
            {filteredExecutives.length > 0 ? (
              filteredExecutives.map(exec => (
                <Button 
                  key={exec.id} 
                  variant={selectedExecutive === exec.id ? "default" : "outline"} 
                  className="w-full justify-start transition-all duration-200 hover:shadow-sm"
                  onClick={() => onSelectExecutive(exec.id)}
                >
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src={exec.avatar} />
                    <AvatarFallback className="text-xs">
                      {getInitials(exec.name)}
                    </AvatarFallback>
                  </Avatar>
                  {exec.name}
                </Button>
              ))
            ) : (
              <div className="py-4 text-center text-muted-foreground">
                No executives found
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ExecutivesList;
