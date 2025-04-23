import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Route, Search } from "lucide-react";

const Hero = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  
  const handleSearch = () => {
    console.log("Searching for routes from", from, "to", to);
    // In a real app, this would navigate to search results
  };
  
  return (
    <div className="relative w-full">
      <div className="absolute inset-0 hero-gradient opacity-90 z-0"></div>
      
      {/* Hero background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-[-1] scale-105 animate-subtle-zoom"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`
        }}
      ></div>
      
      <div className="container relative z-10 py-20 md:py-28">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-bold text-4xl md:text-6xl text-white mb-6 animate-fade-in-up">
            Smart Way to Travel Across India
          </h1>
          <p className="text-xl md:text-2xl text-gray-100 mb-10 animate-fade-in-up delay-100">
            Real-time bus tracking, seat availability, and the best routes for your journey
          </p>
          
          {/* Search Box */}
          <div className="search-box p-6 md:p-8 rounded-2xl animate-fade-in-up delay-200">
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              <div className="md:col-span-3 relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input 
                  placeholder="From: City, Bus Stop"
                  className="pl-10"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                />
              </div>
              <div className="md:col-span-3 relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input 
                  placeholder="To: City, Bus Stop"
                  className="pl-10"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                />
              </div>
              <Button 
                className="md:col-span-1 bg-smartbus-orange hover:bg-smartbus-light-orange"
                onClick={handleSearch}
              >
                <Search className="w-5 h-5" />
              </Button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              <Button variant="outline" size="sm" className="bg-white text-smartbus-text-dark">
                <Route className="mr-1 h-4 w-4" /> Popular Routes
              </Button>
              <Button variant="outline" size="sm" className="bg-white text-smartbus-text-dark">Delhi ⇄ Jaipur</Button>
              <Button variant="outline" size="sm" className="bg-white text-smartbus-text-dark">Mumbai ⇄ Pune</Button>
              <Button variant="outline" size="sm" className="bg-white text-smartbus-text-dark">Bangalore ⇄ Chennai</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
