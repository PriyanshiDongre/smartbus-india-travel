
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2, CreditCard, Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaymentFormProps {
  amount: number;
  onPaymentComplete: (paymentInfo: any) => void;
  onBack: () => void;
}

const paymentSchema = z.object({
  paymentMethod: z.enum(['card', 'upi']),
  nameOnCard: z.string().min(1, 'Name is required').optional(),
  cardNumber: z.string()
    .regex(/^\d{16}$/, 'Card number must be 16 digits')
    .optional(),
  expiryDate: z.string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expiry date must be in MM/YY format')
    .optional(),
  cvv: z.string()
    .regex(/^\d{3}$/, 'CVV must be 3 digits')
    .optional(),
  upiId: z.string()
    .regex(/^[a-zA-Z0-9._-]+@[a-zA-Z]+$/, 'Please enter a valid UPI ID')
    .optional(),
}).superRefine((data, ctx) => {
  if (data.paymentMethod === 'card') {
    if (!data.nameOnCard) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Name on card is required',
        path: ['nameOnCard'],
      });
    }
    if (!data.cardNumber) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Card number is required',
        path: ['cardNumber'],
      });
    }
    if (!data.expiryDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Expiry date is required',
        path: ['expiryDate'],
      });
    }
    if (!data.cvv) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'CVV is required',
        path: ['cvv'],
      });
    }
  } else if (data.paymentMethod === 'upi') {
    if (!data.upiId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'UPI ID is required',
        path: ['upiId'],
      });
    }
  }
});

const PaymentForm = ({ amount, onPaymentComplete, onBack }: PaymentFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentMethod: 'card',
      nameOnCard: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      upiId: '',
    },
  });

  const paymentMethod = form.watch('paymentMethod');

  const onSubmit = async (values: z.infer<typeof paymentSchema>) => {
    try {
      setIsProcessing(true);
      
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real application, you would send the payment details to your server/payment processor
      
      toast({
        title: 'Payment Successful',
        description: `Payment of ₹${amount.toFixed(2)} has been processed successfully.`,
      });
      
      onPaymentComplete({
        method: values.paymentMethod,
        status: 'success',
        transactionId: 'TXN' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      });
      
    } catch (error) {
      toast({
        title: 'Payment Failed',
        description: 'There was a problem processing your payment. Please try again.',
        variant: 'destructive',
      });
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (input: string) => {
    return input.replace(/\D/g, '').slice(0, 16);
  };

  const formatExpiryDate = (input: string) => {
    const cleaned = input.replace(/\D/g, '');
    if (cleaned.length <= 2) return cleaned;
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
        <CardDescription>
          Complete your payment to confirm your booking
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Payment Method</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2 p-3 border rounded-md hover:bg-muted/50 cursor-pointer">
                        <RadioGroupItem value="card" id="card" />
                        <label htmlFor="card" className="flex items-center cursor-pointer w-full">
                          <CreditCard className="mr-2 h-4 w-4" />
                          <div>Credit/Debit Card</div>
                        </label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-md hover:bg-muted/50 cursor-pointer">
                        <RadioGroupItem value="upi" id="upi" />
                        <label htmlFor="upi" className="flex items-center cursor-pointer w-full">
                          <Wallet className="mr-2 h-4 w-4" />
                          <div>UPI Payment</div>
                        </label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {paymentMethod === 'card' && (
              <>
                <FormField
                  control={form.control}
                  name="nameOnCard"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name on Card</FormLabel>
                      <FormControl>
                        <Input placeholder="John Smith" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Card Number</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="1234 5678 9012 3456" 
                          {...field} 
                          onChange={(e) => {
                            field.onChange(formatCardNumber(e.target.value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="expiryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Date</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="MM/YY" 
                            {...field} 
                            onChange={(e) => {
                              field.onChange(formatExpiryDate(e.target.value));
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cvv"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CVV</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="123" 
                            maxLength={3}
                            {...field} 
                            onChange={(e) => {
                              field.onChange(e.target.value.replace(/\D/g, '').slice(0, 3));
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}

            {paymentMethod === 'upi' && (
              <FormField
                control={form.control}
                name="upiId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>UPI ID</FormLabel>
                    <FormControl>
                      <Input placeholder="yourname@bankname" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Separator />
            
            <div className="flex justify-between items-center py-2">
              <div className="text-sm text-muted-foreground">Amount to Pay:</div>
              <div className="text-lg font-bold">₹{amount.toFixed(2)}</div>
            </div>

            <div className="flex justify-between gap-4">
              <Button type="button" variant="outline" onClick={onBack} disabled={isProcessing}>
                Back
              </Button>
              <Button type="submit" className="flex-1" disabled={isProcessing}>
                {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isProcessing ? 'Processing...' : 'Pay Now'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PaymentForm;
