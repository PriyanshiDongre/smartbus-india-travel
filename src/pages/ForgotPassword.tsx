
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BusFront } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setIsSubmitted(true);
        toast({
          title: "Success",
          description: "Check your email for a password reset link",
        });
      }
    } catch (error) {
      console.error("Password reset error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center gap-2">
            <BusFront className="h-10 w-10 text-smartbus-blue" />
            <span className="font-bold text-2xl text-smartbus-blue">
              SmartBus
            </span>
            <span className="text-smartbus-orange font-semibold text-2xl">
              India
            </span>
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We'll send you an email with a link to reset your password
          </p>
        </div>

        {!isSubmitted ? (
          <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
            <div>
              <Label htmlFor="email-address">Email address</Label>
              <Input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Button
                type="submit"
                className="w-full bg-smartbus-blue hover:bg-smartbus-dark-blue"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send reset link"}
              </Button>
            </div>

            <div className="text-center">
              <Link
                to="/login"
                className="font-medium text-smartbus-blue hover:text-smartbus-dark-blue"
              >
                Back to login
              </Link>
            </div>
          </form>
        ) : (
          <div className="mt-8 space-y-6">
            <div className="bg-green-50 p-4 rounded-md">
              <p className="text-green-800">
                If an account exists with this email, you will receive a password
                reset link shortly.
              </p>
            </div>
            <div className="text-center">
              <Link
                to="/login"
                className="font-medium text-smartbus-blue hover:text-smartbus-dark-blue"
              >
                Back to login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
