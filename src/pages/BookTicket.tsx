
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, ArrowRight, Bus } from 'lucide-react';
import { cn } from '@/lib/utils';

// Sample data for popular routes
const popularRoutes = [
  {
    id: '1',
    from: 'Mumbai',
    to: 'Pune',
    price: 350,
    duration: '3 hrs'
  },
  {
    id: '2',
    from: 'Delhi',
    to: 'Jaipur',
    price: 450,
    duration: '4.5 hrs'
  },
  {
    id: '3',
    from: 'Bangalore',
    to: 'Chennai',
    price: 550,
    duration: '6 hrs'
  },
  {
    id: '4',
    from: 'Hyderabad',
    to: 'Vijayawada',
    price: 400,
    duration: '5 hrs'
  },
  {
    id: '5',
    from: 'Kolkata',
    to: 'Bhubaneswar',
    price: 650,
    duration: '7 hrs'
  },
];

const formSchema = z.object({
  departure: z.string().min(1, "Departure city is required"),
  arrival: z.string().min(1, "Arrival city is required"),
  date: z.date({
    required_error: "Please select a date",
  }),
  // Change: Fix the passengers field to properly handle number type
  passengers: z.coerce.number().int().min(1).max(6)
    .refine(val => val > 0 && val <= 6, {
      message: "Number of passengers must be between 1 and 6",
    }),
});

const BookTicket = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      departure: "",
      arrival: "",
      passengers: 1, // Changed from string "1" to number 1
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // In a real app, you would save this booking to Supabase
      // const { data, error } = await supabase
      //   .from('bookings')
      //   .insert({
      //     user_id: user?.id,
      //     route_name: `${values.departure} to ${values.arrival}`,
      //     departure_location: values.departure,
      //     arrival_location: values.arrival,
      //     departure_time: values.date.toISOString(),
      //     status: 'upcoming',
      //     passengers: values.passengers,
      //   });
      
      // if (error) throw error;
      
      toast({
        title: "Booking Confirmed",
        description: `Your journey from ${values.departure} to ${values.arrival} has been booked.`,
      });
      
      // Redirect to dashboard after booking
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error booking ticket:', error);
      toast({
        title: "Booking Failed",
        description: error.message || "There was a problem with your booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Book a Bus Ticket</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>Trip Details</CardTitle>
              <CardDescription>
                Fill in the details for your journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="departure"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>From</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select departure city" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Mumbai">Mumbai</SelectItem>
                              <SelectItem value="Delhi">Delhi</SelectItem>
                              <SelectItem value="Bangalore">Bangalore</SelectItem>
                              <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                              <SelectItem value="Kolkata">Kolkata</SelectItem>
                              <SelectItem value="Chennai">Chennai</SelectItem>
                              <SelectItem value="Pune">Pune</SelectItem>
                              <SelectItem value="Jaipur">Jaipur</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="arrival"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>To</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select arrival city" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Mumbai">Mumbai</SelectItem>
                              <SelectItem value="Delhi">Delhi</SelectItem>
                              <SelectItem value="Bangalore">Bangalore</SelectItem>
                              <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                              <SelectItem value="Kolkata">Kolkata</SelectItem>
                              <SelectItem value="Chennai">Chennai</SelectItem>
                              <SelectItem value="Pune">Pune</SelectItem>
                              <SelectItem value="Jaipur">Jaipur</SelectItem>
                              <SelectItem value="Bhubaneswar">Bhubaneswar</SelectItem>
                              <SelectItem value="Vijayawada">Vijayawada</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Departure Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date() || date > new Date(new Date().setMonth(new Date().getMonth() + 2))
                                }
                                initialFocus
                                className={cn("p-3 pointer-events-auto")}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="passengers"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Passengers</FormLabel>
                          <Select 
                            onValueChange={(value) => field.onChange(Number(value))}
                            value={field.value.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select number of passengers" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">1</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3</SelectItem>
                              <SelectItem value="4">4</SelectItem>
                              <SelectItem value="5">5</SelectItem>
                              <SelectItem value="6">6</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    <Bus className="mr-2 h-4 w-4" />
                    Search Buses
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Popular Routes</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularRoutes.map((route) => (
                <Card 
                  key={route.id} 
                  className={cn(
                    "cursor-pointer transition-all hover:border-smartbus-blue",
                    selectedRoute === route.id ? "border-2 border-smartbus-blue" : ""
                  )}
                  onClick={() => setSelectedRoute(route.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{route.from}</span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground mx-2" />
                      <span className="font-medium">{route.to}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">₹{route.price}</span>
                      <span className="text-muted-foreground">{route.duration}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookTicket;
