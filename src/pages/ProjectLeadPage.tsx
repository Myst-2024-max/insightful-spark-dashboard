
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { UserRole, SchoolDepartment } from '@/lib/types';
import { Navigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProjectLeadDashboard from '@/components/dashboard/ProjectLeadDashboard';
import TeamMembersList from '@/components/TeamMembersList';
import { fetchTeamLeads } from '@/utils/teamUtils';

const ProjectLeadPage = () => {
  const { user, checkUserPermission } = useAuth();
  const { toast } = useToast();
  const { department } = useParams<{ department: string }>();
  const [teamLeads, setTeamLeads] = useState<{ id: string, name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Redirect if not a project lead
  if (!user || !checkUserPermission(UserRole.PROJECT_LEAD)) {
    return <Navigate to="/unauthorized" replace />;
  }

  useEffect(() => {
    const loadTeamLeads = async () => {
      setIsLoading(true);
      try {
        if (user?.department) {
          // Fetch team leads that belong to this project lead's department
          const teamLeadsData = await fetchTeamLeads();
          const departmentTeamLeads = teamLeadsData.filter(lead => 
            lead.department === user.department
          );
          setTeamLeads(departmentTeamLeads);
        }
      } catch (error) {
        console.error("Error loading team leads:", error);
        toast({
          title: "Error",
          description: "Failed to load team data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadTeamLeads();
  }, [user]);

  const departmentName = user?.department ? `${user.department} School` : '';
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Project Lead Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Managing {departmentName}
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="team-leads">Team Leads</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-4">
          <ProjectLeadDashboard />
        </TabsContent>
        
        <TabsContent value="team-leads" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Team Leads</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-4">Loading team leads...</div>
              ) : teamLeads.length > 0 ? (
                <div className="space-y-4">
                  {teamLeads.map((lead) => (
                    <div key={lead.id} className="border rounded-md p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">{lead.name}</h3>
                      </div>
                      <TeamMembersList teamLeadId={lead.id} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <p>No team leads assigned yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center py-4">Performance metrics for {departmentName} will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectLeadPage;
