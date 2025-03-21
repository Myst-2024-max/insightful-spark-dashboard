
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/auth/AuthContext';
import { UserRole } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  LayoutDashboard, 
  Users, 
  TrendingUp, 
  DollarSign, 
  BarChart4, 
  Briefcase,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Layers,
  Code,
  Palette,
  Megaphone,
  Landmark
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const { user, logout, checkUserPermission } = useAuth();
  
  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Navigation items with role-based access control
  const navigationItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      roles: Object.values(UserRole), // All roles have access to dashboard
    },
    {
      name: 'Users',
      path: '/users',
      icon: <Users className="h-5 w-5" />,
      roles: [UserRole.MASTER_ADMIN], // Only master admin can manage users
    },
    {
      name: 'Sales',
      path: '/sales',
      icon: <DollarSign className="h-5 w-5" />,
      roles: [UserRole.MASTER_ADMIN, UserRole.SALES_EXECUTIVE],
    },
    {
      name: 'Accounts',
      path: '/accounts',
      icon: <BarChart4 className="h-5 w-5" />,
      roles: [UserRole.MASTER_ADMIN, UserRole.ACCOUNTS_TEAM],
    },
    {
      name: 'Growth',
      path: '/growth',
      icon: <TrendingUp className="h-5 w-5" />,
      roles: [UserRole.MASTER_ADMIN, UserRole.GROWTH_TEAM],
    },
    {
      name: 'Teams',
      path: '/teams',
      icon: <Briefcase className="h-5 w-5" />,
      roles: [UserRole.MASTER_ADMIN, UserRole.TEAM_LEAD],
    },
  ];

  // School departments for project leads
  const schoolDepartments = [
    {
      name: 'Coding School',
      path: '/projects/coding',
      icon: <Code className="h-5 w-5" />,
      department: 'CODING',
    },
    {
      name: 'Design School',
      path: '/projects/design',
      icon: <Palette className="h-5 w-5" />,
      department: 'DESIGN',
    },
    {
      name: 'Marketing School',
      path: '/projects/marketing',
      icon: <Megaphone className="h-5 w-5" />,
      department: 'MARKETING',
    },
    {
      name: 'Finance School',
      path: '/projects/finance',
      icon: <Landmark className="h-5 w-5" />,
      department: 'FINANCE',
    },
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="h-full flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className={cn(
            "flex items-center h-16 px-4", 
            collapsed ? "justify-center" : "justify-between"
          )}>
            {!collapsed && (
              <div className="flex items-center space-x-2">
                <Layers className="h-6 w-6 text-primary" />
                <span className="text-xl font-semibold">HACA Academy</span>
              </div>
            )}
            {collapsed && (
              <Layers className="h-6 w-6 text-primary" />
            )}
            <button 
              onClick={toggleSidebar}
              className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100",
                collapsed && "hidden"
              )}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>
          
          <Separator />
          
          {/* Expand button when collapsed */}
          {collapsed && (
            <button 
              onClick={toggleSidebar}
              className="h-8 w-8 mx-auto mt-4 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
          
          {/* Main navigation */}
          <nav className={cn("px-3 py-4", collapsed && "flex flex-col items-center")}>
            <ul className="space-y-1">
              {navigationItems.map((item) => {
                // Check if user has permission to see this item
                if (!checkUserPermission(item.roles)) return null;
                
                return (
                  <li key={item.path}>
                    <Link 
                      to={item.path}
                      className={cn(
                        "nav-link",
                        isActiveRoute(item.path) && "active",
                        collapsed && "justify-center px-2"
                      )}
                    >
                      {item.icon}
                      {!collapsed && <span className="ml-3">{item.name}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
            
            {/* Project Lead specific navigation */}
            {checkUserPermission(UserRole.PROJECT_LEAD) && (
              <>
                <div className={cn("mt-8 mb-2", collapsed ? "w-full text-center" : "px-3")}>
                  <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    {collapsed ? "Depts" : "Departments"}
                  </span>
                </div>
                <ul className="space-y-1">
                  {schoolDepartments.map((dept) => (
                    <li key={dept.path}>
                      <Link 
                        to={dept.path}
                        className={cn(
                          "nav-link",
                          isActiveRoute(dept.path) && "active",
                          collapsed && "justify-center px-2"
                        )}
                      >
                        {dept.icon}
                        {!collapsed && <span className="ml-3">{dept.name}</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </nav>
        </div>
        
        {/* Footer with user profile and logout */}
        <div className="p-4 mt-auto">
          <Separator className="mb-4" />
          
          {!collapsed ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 border border-gray-200">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback>{user?.name ? getInitials(user.name) : 'U'}</AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.role.replace(/_/g, ' ')}</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={logout}
                className="h-8 w-8 rounded-full"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <Avatar className="h-10 w-10 border border-gray-200">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback>{user?.name ? getInitials(user.name) : 'U'}</AvatarFallback>
              </Avatar>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={logout}
                className="h-8 w-8 rounded-full"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
