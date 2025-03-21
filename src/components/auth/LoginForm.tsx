
import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'Error',
        description: 'Please enter both email and password',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(email, password);
      toast({
        title: 'Success',
        description: 'You have successfully logged in',
      });
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to login',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // For demonstration purposes - quick login buttons
  const quickLogin = async (userType: string) => {
    let demoEmail;
    
    switch (userType) {
      case 'admin':
        demoEmail = 'admin@haca.academy';
        break;
      case 'sales':
        demoEmail = 'sales@haca.academy';
        break;
      case 'accounts':
        demoEmail = 'accounts@haca.academy';
        break;
      case 'growth':
        demoEmail = 'growth@haca.academy';
        break;
      case 'team':
        demoEmail = 'team@haca.academy';
        break;
      case 'project':
        demoEmail = 'project@haca.academy';
        break;
      default:
        demoEmail = 'admin@haca.academy';
    }
    
    setEmail(demoEmail);
    setPassword('password');
    
    try {
      await login(demoEmail, 'password');
      toast({
        title: 'Demo Login',
        description: `Logged in as ${userType} user`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to login with demo account',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@haca.academy"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
            autoComplete="email"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full"
            autoComplete="current-password"
            required
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary-600"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
      
      {/* Demo quick login section */}
      <div className="mt-8">
        <p className="text-sm text-gray-500 mb-3 text-center">For demonstration, login as:</p>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" onClick={() => quickLogin('admin')}>
            Master Admin
          </Button>
          <Button variant="outline" size="sm" onClick={() => quickLogin('sales')}>
            Sales Executive
          </Button>
          <Button variant="outline" size="sm" onClick={() => quickLogin('accounts')}>
            Accounts Team
          </Button>
          <Button variant="outline" size="sm" onClick={() => quickLogin('growth')}>
            Growth Team
          </Button>
          <Button variant="outline" size="sm" onClick={() => quickLogin('team')}>
            Team Lead
          </Button>
          <Button variant="outline" size="sm" onClick={() => quickLogin('project')}>
            Project Lead
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
