import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import {
  Menu,
  User,
  LogOut,
  X,
  Home,
  Globe,
  Map,
  Users,
  Settings,
  Plus,
  Calendar,
  Compass,
  ChevronDown,
  LogIn,
  UserPlus,
  Briefcase,
  ExternalLink,
  Heart,
  HelpCircle,
} from 'lucide-react';

const Navbar = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);

  // Track scroll position for navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleResources = () => setIsResourcesOpen(!isResourcesOpen);

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Dashboard', href: '/dashboard', icon: Briefcase },
    { name: 'Discover', href: '/discover', icon: Compass },
    { name: 'Plan', href: '/plan', icon: Calendar },
    { name: 'Trips', href: '/trips', icon: Globe },
  ];

  const resourceLinks = [
    { name: 'Travel Guides', href: '/guides', icon: Map },
    { name: 'Saved Places', href: '/saved', icon: Heart },
    { name: 'Help Center', href: '/help', icon: HelpCircle },
  ];

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 shadow-md backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="container-custom">
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link href="/" className="group flex flex-shrink-0 items-center">
              <div className="bg-gradient-primary flex h-10 w-10 items-center justify-center rounded-xl font-bold text-white shadow-lg shadow-primary/20 transition-all duration-300 group-hover:scale-105">
                W
              </div>
              <div className="ml-2.5">
                <span className="text-gradient-primary text-xl font-bold">WanderPlan</span>
                <span className="ml-1 hidden rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary sm:inline-block">
                  Studio
                </span>
              </div>
            </Link>

            {/* Desktop navigation */}
            <div className="hidden lg:ml-10 lg:flex lg:space-x-1">
              {navigation.map((item) => {
                const isActive =
                  router.pathname === item.href || router.pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center rounded-lg px-3 py-2 font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground/80 hover:bg-foreground/5 hover:text-foreground'
                    }`}
                  >
                    <item.icon className="mr-1.5 h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}

              {/* Resources dropdown menu */}
              <div className="relative">
                <button
                  className="flex items-center rounded-lg px-3 py-2 font-medium text-foreground/80 transition-all duration-200 hover:bg-foreground/5 hover:text-foreground"
                  onClick={toggleResources}
                  onMouseEnter={() => setIsResourcesOpen(true)}
                  onMouseLeave={() => setIsResourcesOpen(false)}
                >
                  <Map className="mr-1.5 h-4 w-4" />
                  Resources
                  <ChevronDown
                    className={`ml-1 h-4 w-4 text-foreground/60 transition-transform duration-200 ${isResourcesOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isResourcesOpen && (
                  <div
                    className="absolute left-0 z-10 mt-1 w-56 rounded-xl border border-border/50 bg-white py-2 shadow-xl duration-200 animate-in fade-in slide-in-from-top-5"
                    onMouseEnter={() => setIsResourcesOpen(true)}
                    onMouseLeave={() => setIsResourcesOpen(false)}
                  >
                    {resourceLinks.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center px-4 py-2 text-sm text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                        onClick={() => setIsResourcesOpen(false)}
                      >
                        <item.icon className="mr-3 h-4 w-4 text-primary/70" />
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right side - Profile */}
          <div className="flex items-center space-x-4">
            {/* Create New Trip Button */}
            {session && (
              <Link
                href="/trips/new"
                className="bg-gradient-primary hidden items-center space-x-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white shadow-md shadow-primary/20 transition-all hover:shadow-lg md:flex"
              >
                <Plus className="h-4 w-4" />
                <span>New Trip</span>
              </Link>
            )}

            {/* User profile dropdown */}
            <div className="relative">
              {session ? (
                <div className="flex items-center">
                  <button
                    className="group flex items-center focus:outline-none"
                    onClick={toggleMenu}
                    aria-expanded={isMenuOpen}
                    aria-haspopup="true"
                  >
                    <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-secondary/20 bg-secondary/10 transition-all group-hover:shadow-md">
                      {session.user?.image ? (
                        <img
                          className="h-9 w-9 rounded-full object-cover"
                          src={session.user?.image}
                          alt={session.user?.name || 'User profile'}
                        />
                      ) : (
                        <div className="bg-gradient-primary flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium text-white">
                          {session.user?.name?.charAt(0) || 'U'}
                        </div>
                      )}
                    </div>
                    <span className="hidden md:ml-2.5 md:mr-1 md:flex md:flex-col">
                      <span className="text-sm font-medium leading-tight text-foreground/90">
                        {session.user?.name}
                      </span>
                      <span className="max-w-[120px] truncate text-xs leading-tight text-foreground/60">
                        {session.user?.email}
                      </span>
                    </span>
                    <ChevronDown
                      className={`ml-1 h-4 w-4 text-foreground/60 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Profile dropdown panel */}
                  {isMenuOpen && (
                    <div className="absolute right-0 z-10 mt-2 w-60 rounded-xl border border-border/50 bg-white py-2 shadow-xl duration-200 animate-in fade-in slide-in-from-top-5">
                      <div className="border-b border-border/50 px-4 py-2">
                        <p className="text-sm font-medium text-foreground">{session.user?.name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {session.user?.email}
                        </p>
                      </div>

                      <div className="py-1.5">
                        <Link
                          href="/profile"
                          className="flex items-center px-4 py-2 text-sm text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <User className="mr-3 h-4 w-4 text-primary/70" />
                          Your Profile
                        </Link>
                        <Link
                          href="/dashboard"
                          className="flex items-center px-4 py-2 text-sm text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Briefcase className="mr-3 h-4 w-4 text-primary/70" />
                          Dashboard
                        </Link>
                        <Link
                          href="/trips"
                          className="flex items-center px-4 py-2 text-sm text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Globe className="mr-3 h-4 w-4 text-primary/70" />
                          My Trips
                        </Link>
                        <Link
                          href="/settings"
                          className="flex items-center px-4 py-2 text-sm text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Settings className="mr-3 h-4 w-4 text-primary/70" />
                          Settings
                        </Link>
                      </div>

                      <div className="border-t border-border/50 py-1.5">
                        <button
                          className="flex w-full items-center px-4 py-2 text-left text-sm text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                          onClick={() => {
                            signOut({ redirect: true, callbackUrl: '/' });
                            setIsMenuOpen(false);
                          }}
                        >
                          <LogOut className="mr-3 h-4 w-4 text-destructive/70" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2.5">
                  <Link
                    href="/auth/login"
                    className="btn btn-outline-primary btn-sm hidden sm:inline-flex"
                  >
                    <LogIn className="mr-1.5 h-4 w-4" />
                    Log in
                  </Link>
                  <Link href="/auth/register" className="btn btn-primary btn-sm">
                    <UserPlus className="mr-1.5 h-4 w-4" />
                    <span className="hidden sm:inline">Sign up</span>
                    <span className="sm:hidden">Join</span>
                  </Link>
                  <Link
                    href="/dashboard?test_mode=true"
                    className="btn btn-sm bg-secondary text-white hover:bg-secondary/90"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span className="ml-1.5 hidden sm:inline">Try Demo</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="inline-flex items-center justify-center rounded-md p-2 text-foreground/70 hover:bg-foreground/5 hover:text-foreground focus:outline-none lg:hidden"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="lg:hidden">
          <div className="container-custom border-t border-border/30 pb-3 pt-2">
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive =
                  router.pathname === item.href || router.pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center rounded-lg px-3 py-2 font-medium ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground/80 hover:bg-foreground/5 hover:text-foreground'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}

              {/* Resources section in mobile menu */}
              <div className="mt-2 border-t border-border/30 pt-2">
                <h3 className="px-3 pb-1 text-xs uppercase tracking-wider text-muted-foreground">
                  Resources
                </h3>
                {resourceLinks.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center rounded-lg px-3 py-2 text-foreground/80 hover:bg-foreground/5 hover:text-foreground"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon className="mr-3 h-5 w-5 text-secondary" />
                    {item.name}
                  </Link>
                ))}
              </div>

              {session && (
                <Link
                  href="/trips/new"
                  className="bg-gradient-primary mt-3 flex items-center rounded-lg px-3 py-2.5 font-medium text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Plus className="mr-3 h-5 w-5" />
                  Create New Trip
                </Link>
              )}

              {!session && (
                <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border/30 pt-3">
                  <Link
                    href="/auth/login"
                    className="flex items-center justify-center rounded-lg border border-primary px-3 py-2 text-center font-medium text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link
                    href="/auth/register"
                    className="flex items-center justify-center rounded-lg bg-primary px-3 py-2 text-center font-medium text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
