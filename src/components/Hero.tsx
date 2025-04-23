
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search } from "lucide-react";

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
      
      <div className="container relative z-10 pt-8 pb-14 px-4">
        <div className="max-w-md mx-auto text-center">
          <h1 className="font-bold text-3xl text-white mb-4 animate-fade-in-up">
            Smart Way to Travel Across India
          </h1>
          <p className="text-base text-gray-100 mb-6 animate-fade-in-up delay-100">
            Track buses, check seat availability, and find the best routes
          </p>
          
          {/* Search Box */}
          <div className="search-box p-4 rounded-xl backdrop-blur-md bg-white/20 shadow-lg border border-white/30 animate-fade-in-up delay-200">
            <div className="space-y-3">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-100" size={18} />
                <Input 
                  placeholder="From: City, Bus Stop"
                  className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-gray-200"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-100" size={18} />
                <Input 
                  placeholder="To: City, Bus Stop"
                  className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-gray-200"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                />
              </div>
              <Button 
                className="w-full bg-smartbus-orange hover:bg-smartbus-light-orange flex items-center justify-center gap-2"
                onClick={handleSearch}
              >
                <Search className="w-4 h-4" />
                <span>Find Buses</span>
              </Button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              <Button variant="outline" size="sm" className="bg-white/20 border-white/30 text-white hover:bg-white/30 text-xs px-2">Delhi ⇄ Jaipur</Button>
              <Button variant="outline" size="sm" className="bg-white/20 border-white/30 text-white hover:bg-white/30 text-xs px-2">Mumbai ⇄ Pune</Button>
              <Button variant="outline" size="sm" className="bg-white/20 border-white/30 text-white hover:bg-white/30 text-xs px-2">Bangalore ⇄ Chennai</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
