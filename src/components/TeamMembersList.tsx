
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Target, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SalesExecutivePerformance, UserRole } from '@/lib/types';

interface TeamMembersListProps {
  teamLeadId: string;
  onEditTarget?: (memberId: string, name: string, currentTarget: number) => void;
}

const TeamMembersList = ({ teamLeadId, onEditTarget }: TeamMembersListProps) => {
  const [teamMembers, setTeamMembers] = useState<SalesExecutivePerformance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (teamLeadId) {
      fetchTeamMembers();
    }
  }, [teamLeadId]);

  const fetchTeamMembers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Fetching team members for team lead:", teamLeadId);
      
      // Fetch team members (sales executives) that report to this team lead
      const { data, error } = await supabase
        .from('haca_users')
        .select('id, name, avatar')
        .eq('team_lead_id', teamLeadId)
        .eq('role', UserRole.SALES_EXECUTIVE);

      if (error) {
        console.error('Error fetching team members:', error);
        setError('Failed to load team members');
        toast({
          title: "Error",
          description: "Failed to load team members: " + error.message,
          variant: "destructive",
        });
        return;
      }

      console.log("Team members data:", data);

      if (data && data.length > 0) {
        // Transform data to SalesExecutivePerformance format
        const performanceData: SalesExecutivePerformance[] = data.map(member => ({
          id: member.id,
          name: member.name,
          targetValue: 100000, // Default target value (we would fetch actual targets in a real app)
          achievedValue: Math.floor(Math.random() * 100000), // Mock data for demo
          achievementPercentage: Math.floor(Math.random() * 100), // Mock data for demo
          trend: Math.random() > 0.5 ? 'up' : 'down' as 'up' | 'down', // Explicitly typed
          avatar: member.avatar
        }));
        
        setTeamMembers(performanceData);
      } else {
        setTeamMembers([]);
      }
    } catch (err) {
      console.error('Unexpected error fetching team members:', err);
      setError('An unexpected error occurred');
      toast({
        title: "Error",
        description: "Failed to load team members. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading team members...</div>;
  }

  if (error) {
    return (
      <Card className="mt-6 bg-red-50">
        <CardContent className="pt-6">
          <div className="text-center py-6 text-red-500">
            <p>{error}</p>
            <Button 
              onClick={fetchTeamMembers}
              variant="outline" 
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (teamMembers.length === 0) {
    return (
      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="text-center py-6 text-gray-500">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No team members</h3>
            <p className="mt-1 text-sm text-gray-500">You don't have any sales executives assigned to your team yet.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Your Team Members</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {teamMembers.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={member.avatar || undefined} />
                  <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{member.name}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>Target: ₹{member.targetValue.toLocaleString()}</span>
                    <span>•</span>
                    <span>Achieved: ₹{member.achievedValue.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant={member.trend === 'up' ? "default" : "destructive"}>
                  {member.achievementPercentage}%
                </Badge>
                {onEditTarget && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => onEditTarget(member.id, member.name, member.targetValue)}
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    <Target className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamMembersList;
