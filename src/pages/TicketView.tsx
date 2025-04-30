
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Bus, Calendar, MapPin, User, Clock, Ticket, ArrowLeft } from 'lucide-react';

interface TicketDetails {
  id: string;
  route_name: string;
  departure_time: string;
  departure_location: string;
  arrival_location: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  passengers: number;
  seat_numbers?: string[];
  price: number;
  booking_reference: string;
}

const TicketView = () => {
  const { ticketId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [ticket, setTicket] = useState<TicketDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicketDetails = async () => {
      setLoading(true);
      try {
        // In a real app, you would fetch from Supabase here
        // const { data, error } = await supabase
        //   .from('bookings')
        //   .select('*')
        //   .eq('id', ticketId)
        //   .eq('user_id', user?.id)
        //   .single();
        
        // if (error) throw error;
        
        // For demonstration purposes, we're using mock data
        const mockTicket: TicketDetails = {
          id: ticketId || '1',
          route_name: 'Mumbai to Pune',
          departure_time: '2025-05-10T08:00:00',
          departure_location: 'Mumbai Central',
          arrival_location: 'Pune Station',
          status: 'upcoming',
          passengers: 2,
          seat_numbers: ['A4', 'A5'],
          price: 700, // ₹350 per passenger for 2 passengers
          booking_reference: 'SMART' + Math.random().toString(36).substring(2, 8).toUpperCase()
        };
        
        setTicket(mockTicket);
      } catch (error) {
        console.error('Error fetching ticket:', error);
        toast({
          title: 'Failed to load ticket',
          description: 'There was a problem loading your ticket details.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (ticketId) {
      fetchTicketDetails();
    }
  }, [ticketId, user, toast]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center mb-6">
            <Button variant="ghost" className="mr-4" asChild>
              <Link to="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">Ticket Details</h1>
          </div>
          
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-smartbus-blue"></div>
            </div>
          ) : ticket ? (
            <Card className="shadow-lg border-2 border-smartbus-blue/20">
              <CardHeader className="bg-smartbus-blue text-white rounded-t-lg">
                <CardTitle className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Ticket className="mr-2 h-5 w-5" />
                    <span>E-Ticket</span>
                  </div>
                  <span className="text-sm bg-white text-smartbus-blue px-3 py-1 rounded-full">
                    {ticket.status.toUpperCase()}
                  </span>
                </CardTitle>
                <div className="text-xl font-bold mt-2">{ticket.route_name}</div>
                <div className="text-xs opacity-80">Booking Reference: {ticket.booking_reference}</div>
              </CardHeader>
              
              <CardContent className="pt-6 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex items-start space-x-2">
                    <Clock className="h-5 w-5 text-smartbus-blue mt-0.5" />
                    <div>
                      <div className="text-sm text-muted-foreground">Departure Time</div>
                      <div className="font-medium">{formatDate(ticket.departure_time)}</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2 mt-4 md:mt-0">
                    <User className="h-5 w-5 text-smartbus-blue mt-0.5" />
                    <div>
                      <div className="text-sm text-muted-foreground">Passengers</div>
                      <div className="font-medium">{ticket.passengers} {ticket.passengers > 1 ? 'People' : 'Person'}</div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-5 w-5 text-smartbus-blue mt-0.5" />
                      <div>
                        <div className="text-sm text-muted-foreground">From</div>
                        <div className="font-medium">{ticket.departure_location}</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-5 w-5 text-smartbus-blue mt-0.5" />
                      <div>
                        <div className="text-sm text-muted-foreground">To</div>
                        <div className="font-medium">{ticket.arrival_location}</div>
                      </div>
                    </div>
                  </div>
                  
                  {ticket.seat_numbers && ticket.seat_numbers.length > 0 && (
                    <div className="mt-4">
                      <div className="text-sm text-muted-foreground mb-1">Seat Numbers</div>
                      <div className="flex flex-wrap gap-2">
                        {ticket.seat_numbers.map((seat, index) => (
                          <div 
                            key={index}
                            className="bg-smartbus-blue/10 border border-smartbus-blue/30 text-smartbus-blue px-3 py-1 rounded-md font-medium"
                          >
                            {seat}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-muted-foreground">Total Price</div>
                    <div className="text-xl font-bold">₹{ticket.price.toFixed(2)}</div>
                  </div>
                  <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-1 rounded-md">
                    Paid
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col sm:flex-row justify-between gap-3 bg-muted/50 p-4 rounded-b-lg">
                <Button className="w-full sm:w-auto">
                  <Bus className="mr-2 h-4 w-4" />
                  Track Bus
                </Button>
                <Button variant="outline" className="w-full sm:w-auto">
                  Download Ticket
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">Ticket not found or you don't have permission to view it.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TicketView;
