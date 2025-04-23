
import { BusFront } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#1A1F2C] text-gray-300 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <BusFront className="h-6 w-6 text-smartbus-blue" />
          <span className="font-bold text-lg text-white">SmartBus</span>
          <span className="text-smartbus-orange font-semibold">India</span>
        </div>
        
        <div className="text-sm">
          © {new Date().getFullYear()} SmartBus India
        </div>
      </div>
    </footer>
  );
};

export default Footer;
