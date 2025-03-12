
import { Link } from 'react-router-dom';
import { Award } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/20 to-background z-0"></div>
      <div className="container mx-auto container-padding relative z-10">
        <div className="neo-glass p-10 rounded-2xl text-center max-w-3xl mx-auto">
          <div className="bg-primary/30 text-primary w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award size={36} />
          </div>
          <h2 className="text-3xl font-display font-bold mb-4">Ready for Your Next Adventure?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Create your TripGenius account today and start planning your dream vacation with the power of AI.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="btn-gradient">
              Sign Up for Free
            </Link>
            <Link to="/how-it-works" className="btn-outline-gradient">
              Learn How It Works
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
