
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Bus, Map, Ticket, Clock, Settings, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

// Sample interface for booking data
interface Booking {
  id: string;
  route_name: string;
  departure_time: string;
  departure_location: string;
  arrival_location: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  created_at: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // For demo purposes, let's simulate fetching bookings
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        // Normally you would fetch from Supabase here
        // const { data, error } = await supabase
        //   .from('bookings')
        //   .select('*')
        //   .eq('user_id', user?.id)
        //   .order('created_at', { ascending: false });
        
        // if (error) throw error;
        
        // Simulated data for now
        const sampleBookings: Booking[] = [
          {
            id: '1',
            route_name: 'Mumbai to Pune',
            departure_time: '2025-05-10T08:00:00',
            departure_location: 'Mumbai Central',
            arrival_location: 'Pune Station',
            status: 'upcoming',
            created_at: new Date().toISOString()
          },
          {
            id: '2',
            route_name: 'Delhi to Jaipur',
            departure_time: '2025-05-15T10:30:00',
            departure_location: 'Delhi ISBT',
            arrival_location: 'Jaipur Bus Stand',
            status: 'upcoming',
            created_at: new Date().toISOString()
          },
          {
            id: '3',
            route_name: 'Bangalore to Chennai',
            departure_time: '2025-04-01T07:15:00',
            departure_location: 'Bangalore Bus Station',
            arrival_location: 'Chennai CMBT',
            status: 'completed',
            created_at: new Date().toISOString()
          }
        ];
        
        setBookings(sampleBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast({
          title: 'Failed to load bookings',
          description: 'There was a problem loading your booking history.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, [user, toast]);

  // Filter bookings by status
  const upcomingBookings = bookings.filter(booking => booking.status === 'upcoming');
  const completedBookings = bookings.filter(booking => booking.status === 'completed');

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <Button variant="outline" asChild>
              <Link to="/profile">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </Button>
          </div>

          {/* User welcome card */}
          <Card className="bg-smartbus-blue text-white">
            <CardHeader>
              <CardTitle>Welcome back, {user?.user_metadata?.name || 'Traveler'}</CardTitle>
              <CardDescription className="text-smartbus-text-light">
                Manage your bookings and travel plans from your personal dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button variant="secondary" className="bg-white text-smartbus-blue hover:bg-smartbus-text-light" asChild>
                  <Link to="/book-ticket">
                    <Bus className="mr-2 h-4 w-4" />
                    Book Ticket
                  </Link>
                </Button>
                <Button variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                  <Map className="mr-2 h-4 w-4" />
                  Track Bus
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Bookings tabs */}
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full md:w-[400px] grid-cols-2">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming" className="mt-4">
              {loading ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-smartbus-blue"></div>
                </div>
              ) : upcomingBookings.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {upcomingBookings.map((booking) => (
                    <Card key={booking.id}>
                      <CardHeader>
                        <CardTitle>{booking.route_name}</CardTitle>
                        <CardDescription>
                          {new Date(booking.departure_time).toLocaleString('en-US', {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          })}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">From:</span>
                            <span className="font-medium">{booking.departure_location}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">To:</span>
                            <span className="font-medium">{booking.arrival_location}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Status:</span>
                            <span className="font-medium text-green-600">Confirmed</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/ticket/${booking.id}`}>
                            <Ticket className="mr-2 h-4 w-4" />
                            View
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                          Cancel
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-center">No Upcoming Bookings</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground mb-4">You don't have any upcoming bus trips booked.</p>
                    <Button asChild>
                      <Link to="/book-ticket">
                        <Bus className="mr-2 h-4 w-4" />
                        Book a Trip
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="completed" className="mt-4">
              {loading ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-smartbus-blue"></div>
                </div>
              ) : completedBookings.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {completedBookings.map((booking) => (
                    <Card key={booking.id}>
                      <CardHeader>
                        <CardTitle>{booking.route_name}</CardTitle>
                        <CardDescription>
                          {new Date(booking.departure_time).toLocaleString('en-US', {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          })}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">From:</span>
                            <span className="font-medium">{booking.departure_location}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">To:</span>
                            <span className="font-medium">{booking.arrival_location}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Status:</span>
                            <span className="font-medium text-blue-600">Completed</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/ticket/${booking.id}`}>
                            <Ticket className="mr-2 h-4 w-4" />
                            View
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link to="/book-ticket">
                            Book Again
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-center">No Trip History</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">You haven't completed any trips yet.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
