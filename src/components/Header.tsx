
import { BusFront, MapPin, Menu, Route, Search, X, User, Settings } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useRole } from "@/contexts/RoleContext";
import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { isAdmin } = useRole();
  const { toast } = useToast();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    }
  };
  
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <BusFront className="h-8 w-8 text-smartbus-blue" />
            <span className="font-bold text-xl text-smartbus-blue">SmartBus</span>
            <span className="text-smartbus-orange font-semibold">India</span>
          </Link>
        </div>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-smartbus-text-dark font-medium hover:text-smartbus-blue transition-colors">
            Home
          </Link>
          <Link to="/routes" className="text-smartbus-text-dark font-medium hover:text-smartbus-blue transition-colors">
            Routes
          </Link>
          <Link to="/live-tracking" className="text-smartbus-text-dark font-medium hover:text-smartbus-blue transition-colors">
            Live Tracking
          </Link>
          <Link to="/schedule" className="text-smartbus-text-dark font-medium hover:text-smartbus-blue transition-colors">
            Schedules
          </Link>
          {user && (
            <Link to="/dashboard" className="text-smartbus-text-dark font-medium hover:text-smartbus-blue transition-colors">
              Dashboard
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" className="text-smartbus-text-dark font-medium hover:text-smartbus-blue transition-colors">
              Admin
            </Link>
          )}
        </nav>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="hidden md:flex">
            <Search className="h-4 w-4" />
          </Button>
          
          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/profile">
                <Button variant="outline" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">Profile</span>
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                onClick={handleSignOut}
                className="text-smartbus-text-dark hover:text-smartbus-blue"
              >
                Sign Out
              </Button>
              <Button className="bg-smartbus-blue hover:bg-smartbus-dark-blue">
                Book Now
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" className="text-smartbus-text-dark hover:text-smartbus-blue">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-smartbus-blue hover:bg-smartbus-dark-blue">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
          
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t animate-slide-in-bottom">
          <div className="container py-4 space-y-4">
            <Link 
              to="/" 
              className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              <BusFront className="h-5 w-5 text-smartbus-blue" />
              <span>Home</span>
            </Link>
            <Link 
              to="/routes" 
              className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              <Route className="h-5 w-5 text-smartbus-blue" />
              <span>Routes</span>
            </Link>
            <Link 
              to="/live-tracking" 
              className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              <MapPin className="h-5 w-5 text-smartbus-blue" />
              <span>Live Tracking</span>
            </Link>
            <Link 
              to="/schedule" 
              className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              <Route className="h-5 w-5 text-smartbus-blue" />
              <span>Schedules</span>
            </Link>
            
            {user && (
              <Link 
                to="/dashboard" 
                className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="h-5 w-5 text-smartbus-blue" />
                <span>Dashboard</span>
              </Link>
            )}
            
            {isAdmin && (
              <Link 
                to="/admin" 
                className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                <Settings className="h-5 w-5 text-smartbus-blue" />
                <span>Admin</span>
              </Link>
            )}
            
            <div className="pt-2 border-t">
              {user ? (
                <>
                  <div className="p-2 mb-2 text-sm">
                    Signed in as: <span className="font-medium">{user.email}</span>
                  </div>
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full mb-2" variant="outline">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Button>
                  </Link>
                  <Button 
                    className="w-full mb-2"
                    variant="outline"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </Button>
                  <Button className="w-full bg-smartbus-blue hover:bg-smartbus-dark-blue">
                    Book Now
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full mb-2" variant="outline">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-smartbus-blue hover:bg-smartbus-dark-blue">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
