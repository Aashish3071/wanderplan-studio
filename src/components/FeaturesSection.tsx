
import { Clock, DollarSign, Users, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeaturesSection = () => {
  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Itineraries',
      description: 'Get personalized itineraries based on your preferences, budget, and travel style.',
    },
    {
      icon: Clock,
      title: 'Save Time Planning',
      description: 'Create comprehensive travel plans in minutes instead of hours or days.',
    },
    {
      icon: DollarSign,
      title: 'Smart Budget Tracking',
      description: 'Track expenses and get alerts when you\'re approaching your budget limits.',
    },
    {
      icon: Users,
      title: 'Collaborate with Friends',
      description: 'Plan trips together with friends and family in real-time.',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/30">
      <div className="container mx-auto container-padding">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="bg-primary/20 text-primary px-4 py-1.5 rounded-full text-sm font-medium">Why Choose TripGenius</span>
          <h2 className="text-3xl font-display font-bold mt-3 mb-4 text-gradient-primary">Plan Your Perfect Trip with <span className="text-primary">AI</span></h2>
          <p className="text-muted-foreground">
            Our AI-powered platform streamlines travel planning, helps you stay on budget, and provides personalized recommendations.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index} 
                className="neo-glass p-6 rounded-xl text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-primary/10"
              >
                <div className="bg-primary/20 text-primary w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon size={28} />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>
        
        <div className="mt-12 text-center">
          <Link to="/dashboard" className="btn-gradient px-8 py-3 rounded-full inline-flex items-center gap-2 font-medium text-white transform transition-transform hover:scale-105">
            Start Planning <Sparkles size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
