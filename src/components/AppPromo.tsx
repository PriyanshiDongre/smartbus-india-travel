
import { Button } from "@/components/ui/button";

const AppPromo = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-smartbus-blue to-smartbus-light-blue text-white">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* App Image */}
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-white opacity-10 rounded-3xl blur-xl transform -rotate-6"></div>
              <img 
                src="https://images.unsplash.com/photo-1551650992-ee4fd47df41f?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="SmartBus Mobile App" 
                className="relative z-10 max-w-[280px] rounded-3xl shadow-xl mx-auto"
              />
            </div>
          </div>
          
          {/* Content */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl font-bold mb-4">Get the SmartBus App</h2>
            <p className="text-gray-100 mb-6 text-lg">
              Download our mobile app to get real-time updates, track your bus, and book tickets on the go. Available for both Android and iOS.
            </p>
            
            <div className="space-y-4 md:space-y-0 md:space-x-4 flex flex-col md:flex-row items-center md:items-start">
              <Button className="bg-black hover:bg-gray-800 text-white flex items-center gap-2 h-14 px-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <path d="M12 19H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5.5"></path>
                  <path d="M16 19h6"></path>
                  <path d="M19 16v6"></path>
                </svg>
                <div className="flex flex-col items-start">
                  <span className="text-xs">Download on the</span>
                  <span className="font-bold">App Store</span>
                </div>
              </Button>
              
              <Button className="bg-black hover:bg-gray-800 text-white flex items-center gap-2 h-14 px-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <polygon points="5 3 19 12 5 21"></polygon>
                </svg>
                <div className="flex flex-col items-start">
                  <span className="text-xs">GET IT ON</span>
                  <span className="font-bold">Google Play</span>
                </div>
              </Button>
            </div>
            
            <p className="mt-6 text-sm text-gray-200">
              Free to download. Bus booking charges may apply.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppPromo;
