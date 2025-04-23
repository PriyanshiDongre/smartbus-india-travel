
import { BusFront, Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BusFront className="h-8 w-8 text-smartbus-blue" />
              <span className="font-bold text-xl text-white">SmartBus</span>
              <span className="text-smartbus-orange font-semibold">India</span>
            </div>
            <p className="mb-4 text-sm">
              Making bus travel in India smarter, efficient, and more convenient with real-time tracking and journey planning.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-smartbus-blue transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-smartbus-blue transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-smartbus-blue transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-smartbus-blue transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/routes" className="hover:text-smartbus-blue transition-colors">Bus Routes</Link>
              </li>
              <li>
                <Link to="/live-tracking" className="hover:text-smartbus-blue transition-colors">Live Tracking</Link>
              </li>
              <li>
                <Link to="/schedule" className="hover:text-smartbus-blue transition-colors">Bus Schedules</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-smartbus-blue transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-smartbus-blue transition-colors">Contact</Link>
              </li>
            </ul>
          </div>
          
          {/* Popular Routes */}
          <div>
            <h3 className="font-bold text-white mb-4">Popular Routes</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/routes/delhi-jaipur" className="hover:text-smartbus-blue transition-colors">Delhi - Jaipur</Link>
              </li>
              <li>
                <Link to="/routes/mumbai-pune" className="hover:text-smartbus-blue transition-colors">Mumbai - Pune</Link>
              </li>
              <li>
                <Link to="/routes/bangalore-chennai" className="hover:text-smartbus-blue transition-colors">Bangalore - Chennai</Link>
              </li>
              <li>
                <Link to="/routes/kolkata-siliguri" className="hover:text-smartbus-blue transition-colors">Kolkata - Siliguri</Link>
              </li>
              <li>
                <Link to="/routes/ahmedabad-surat" className="hover:text-smartbus-blue transition-colors">Ahmedabad - Surat</Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex gap-2">
                <MapPin className="h-5 w-5 text-smartbus-blue" />
                <span>123 Startup Hub, Koramangala, Bangalore - 560034</span>
              </li>
              <li className="flex gap-2">
                <Phone className="h-5 w-5 text-smartbus-blue" />
                <span>+91 9876 543 210</span>
              </li>
              <li className="flex gap-2">
                <Mail className="h-5 w-5 text-smartbus-blue" />
                <span>info@smartbus-india.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-6 mt-6 text-sm">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-4 md:mb-0 text-center md:text-left">
              &copy; {new Date().getFullYear()} SmartBus India. All rights reserved.
            </div>
            <div className="flex space-x-6 justify-center md:justify-end">
              <Link to="/privacy" className="hover:text-smartbus-blue transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-smartbus-blue transition-colors">Terms of Service</Link>
              <Link to="/faq" className="hover:text-smartbus-blue transition-colors">FAQ</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
