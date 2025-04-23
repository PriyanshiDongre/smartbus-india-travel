
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import LiveTrackingPreview from "@/components/LiveTrackingPreview";
import Features from "@/components/Features";
import PopularRoutes from "@/components/PopularRoutes";
// Removed AppPromo import
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main>
        <Hero />
        <LiveTrackingPreview />
        <Features />
        <PopularRoutes />
        {/* Removed AppPromo component */}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
