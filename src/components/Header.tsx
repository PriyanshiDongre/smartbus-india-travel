
import { BusFront, MapPin, Menu, Route, Search, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
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
        </nav>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="hidden md:flex">
            <Search className="h-4 w-4" />
          </Button>
          
          <Button className="bg-smartbus-blue hover:bg-smartbus-dark-blue hidden md:flex">
            Book Now
          </Button>
          
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
            
            <div className="pt-2 border-t">
              <Button className="w-full bg-smartbus-blue hover:bg-smartbus-dark-blue">
                Book Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
