
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/lib/supabase';
import { BusFront, Users, Route as RouteIcon, Settings } from 'lucide-react';

// Sample user and route interfaces
interface RouteData {
  id: string;
  name: string;
  departure: string;
  destination: string;
  distance: number;
  duration: string;
}

interface UserData {
  id: string;
  email: string;
  created_at: string;
  last_sign_in?: string;
}

const AdminPanel = () => {
  const { toast } = useToast();
  const [usersLoading, setUsersLoading] = useState(true);
  const [routesLoading, setRoutesLoading] = useState(true);
  const [users, setUsers] = useState<UserData[]>([]);
  const [routes, setRoutes] = useState<RouteData[]>([]);

  // Fetch users (simulated)
  useEffect(() => {
    const fetchUsers = async () => {
      setUsersLoading(true);
      try {
        // In a real scenario, you would fetch from Auth users or your users table
        // For demo purposes, let's create sample data
        const mockUsers: UserData[] = [
          {
            id: '1',
            email: 'user1@example.com',
            created_at: '2025-02-15T08:00:00',
            last_sign_in: '2025-04-25T14:30:00'
          },
          {
            id: '2',
            email: 'user2@example.com',
            created_at: '2025-03-10T10:15:00',
            last_sign_in: '2025-04-20T09:45:00'
          },
          {
            id: '3',
            email: 'user3@example.com',
            created_at: '2025-04-01T16:20:00',
          },
        ];
        
        setUsers(mockUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          title: 'Failed to load users',
          description: 'There was a problem loading the user data.',
          variant: 'destructive',
        });
      } finally {
        setUsersLoading(false);
      }
    };
    
    fetchUsers();
  }, [toast]);

  // Fetch routes (simulated)
  useEffect(() => {
    const fetchRoutes = async () => {
      setRoutesLoading(true);
      try {
        // In a real scenario, you would fetch from your routes table
        // For demo purposes, let's create sample data
        const mockRoutes: RouteData[] = [
          {
            id: '1',
            name: 'Mumbai to Pune Express',
            departure: 'Mumbai Central',
            destination: 'Pune Station',
            distance: 150,
            duration: '3h 30m'
          },
          {
            id: '2',
            name: 'Delhi to Jaipur Direct',
            departure: 'Delhi ISBT',
            destination: 'Jaipur Bus Stand',
            distance: 280,
            duration: '5h 15m'
          },
          {
            id: '3',
            name: 'Bangalore to Chennai',
            departure: 'Bangalore Bus Station',
            destination: 'Chennai CMBT',
            distance: 350,
            duration: '7h 00m'
          },
          {
            id: '4',
            name: 'Kolkata to Siliguri',
            departure: 'Kolkata Esplanade',
            destination: 'Siliguri Bus Terminal',
            distance: 570,
            duration: '10h 30m'
          }
        ];
        
        setRoutes(mockRoutes);
      } catch (error) {
        console.error('Error fetching routes:', error);
        toast({
          title: 'Failed to load routes',
          description: 'There was a problem loading the route data.',
          variant: 'destructive',
        });
      } finally {
        setRoutesLoading(false);
      }
    };
    
    fetchRoutes();
  }, [toast]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>

          {/* Stats overview */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.length}</div>
                <p className="text-xs text-muted-foreground">
                  +2 new users this week
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Routes</CardTitle>
                <RouteIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{routes.length}</div>
                <p className="text-xs text-muted-foreground">
                  Across 5 states
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Bus Fleet</CardTitle>
                <BusFront className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground">
                  32 active, 10 in maintenance
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Management tabs */}
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid w-full md:w-[400px] grid-cols-2">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="routes">Routes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="users" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>View and manage user accounts.</CardDescription>
                </CardHeader>
                <CardContent>
                  {usersLoading ? (
                    <div className="flex justify-center p-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-smartbus-blue"></div>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Email</TableHead>
                          <TableHead>Registration Date</TableHead>
                          <TableHead>Last Login</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              {new Date(user.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              {user.last_sign_in 
                                ? new Date(user.last_sign_in).toLocaleDateString()
                                : 'Never'
                              }
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600">
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="routes" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Route Management</CardTitle>
                  <CardDescription>
                    View and manage bus routes and schedules.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {routesLoading ? (
                    <div className="flex justify-center p-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-smartbus-blue"></div>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>From</TableHead>
                          <TableHead>To</TableHead>
                          <TableHead>Distance</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {routes.map((route) => (
                          <TableRow key={route.id}>
                            <TableCell>{route.name}</TableCell>
                            <TableCell>{route.departure}</TableCell>
                            <TableCell>{route.destination}</TableCell>
                            <TableCell>{route.distance} km</TableCell>
                            <TableCell>{route.duration}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                Edit
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600">
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminPanel;
