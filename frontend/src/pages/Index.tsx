
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import PopularDestinationsSection from '../components/PopularDestinationsSection';
import FeaturesSection from '../components/FeaturesSection';
import CommunityTripsSection from '../components/CommunityTripsSection';
import CTASection from '../components/CTASection';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <Hero />
        
        {/* Popular Destinations */}
        <PopularDestinationsSection />
        
        {/* Features Section */}
        <FeaturesSection />
        
        {/* Community Trips */}
        <CommunityTripsSection />
        
        {/* CTA Section */}
        <CTASection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
