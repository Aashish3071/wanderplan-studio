import Link from 'next/link';
import {
  Facebook,
  Twitter,
  Instagram,
  Github,
  Mail,
  Heart,
  Globe,
  MapPin,
  Users,
  Calendar,
  ChevronRight,
  Send,
  Compass,
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/30 bg-background">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          {/* Logo and description */}
          <div className="space-y-6 md:col-span-4">
            <Link href="/" className="flex items-center">
              <div className="bg-gradient-primary flex h-10 w-10 items-center justify-center rounded-xl font-bold text-white shadow-md">
                W
              </div>
              <div className="ml-2.5">
                <span className="text-gradient-primary text-xl font-bold">WanderPlan</span>
                <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  Studio
                </span>
              </div>
            </Link>

            <p className="text-muted-foreground">
              Your all-in-one travel planning companion. Create beautiful itineraries, discover
              amazing places, and share your adventures with friends.
            </p>

            <div className="flex items-center space-x-4">
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-foreground/60 transition-colors hover:bg-primary/10 hover:text-primary"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-foreground/60 transition-colors hover:bg-primary/10 hover:text-primary"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-foreground/60 transition-colors hover:bg-primary/10 hover:text-primary"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-foreground/60 transition-colors hover:bg-primary/10 hover:text-primary"
                aria-label="Github"
              >
                <Github size={18} />
              </a>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide">Features</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/plan"
                  className="flex items-center text-muted-foreground transition-colors hover:text-primary"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Trip Planning</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/discover"
                  className="flex items-center text-muted-foreground transition-colors hover:text-primary"
                >
                  <Compass className="mr-2 h-4 w-4" />
                  <span>Discover Places</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/map"
                  className="flex items-center text-muted-foreground transition-colors hover:text-primary"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  <span>Interactive Maps</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/collaboration"
                  className="flex items-center text-muted-foreground transition-colors hover:text-primary"
                >
                  <Users className="mr-2 h-4 w-4" />
                  <span>Collaboration</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/help"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/community"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide">Stay Updated</h3>
            <p className="text-sm text-muted-foreground">
              Subscribe to our newsletter for travel tips and special offers.
            </p>
            <form className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="form-input pr-10"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md bg-primary text-white"
                  aria-label="Subscribe"
                >
                  <Send size={14} />
                </button>
              </div>
              <p className="text-xs text-muted-foreground/70">
                We'll never share your email with anyone else.
              </p>
            </form>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-16 flex flex-col items-center justify-between border-t border-border/30 pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} WanderPlan Studio. All rights reserved.
          </p>

          <div className="mt-4 flex items-center md:mt-0">
            <p className="flex items-center text-sm text-muted-foreground">
              Made with <Heart size={12} className="mx-1 text-destructive" /> by the WanderPlan Team
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
