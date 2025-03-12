
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">WanderPlan</h3>
            <p className="text-muted-foreground text-sm">
              Your AI-powered travel planning companion that makes trip organization simple and enjoyable.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Pages</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/plan-trip" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Plan a Trip
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/budget" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Budget
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Community</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/community" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Explore Trips
                </Link>
              </li>
              <li>
                <Link to="/local-insights" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Local Insights
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} WanderPlan. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-muted-foreground hover:text-foreground">
              Twitter
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground">
              Facebook
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground">
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
