import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import {
  Calendar,
  Map,
  Users,
  ArrowRight,
  Globe,
  Search,
  ChevronRight,
  Star,
  MapPin,
  Shield,
  Compass,
  UserPlus,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isAuthenticated = status === 'authenticated';

  // Use useEffect to handle redirects after the component has mounted on the client
  useEffect(() => {
    // Redirect authenticated users to dashboard after component mounts
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="relative h-12 w-12">
          <div className="absolute left-0 top-0 h-full w-full rounded-full border-4 border-primary/30 opacity-50"></div>
          <div className="absolute left-0 top-0 h-full w-full animate-spin rounded-full border-4 border-b-transparent border-l-transparent border-r-transparent border-t-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>WanderPlan Studio - Plan Your Perfect Trip</title>
        <meta
          name="description"
          content="Create and manage your travel plans with ease. AI-powered itinerary generation, interactive maps, and collaboration tools."
        />
      </Head>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/90 to-primary/70 pb-16 pt-24 text-white md:pb-20 md:pt-32 lg:pb-28 lg:pt-36">
        {/* Decorative shapes */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-full overflow-hidden">
          <div className="absolute -right-40 top-0 h-[600px] w-[600px] rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full bg-white/5 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-secondary/40 blur-3xl"></div>
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
            <div className="max-w-xl">
              <div className="mb-4 inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-sm backdrop-blur-sm">
                <Star className="mr-1.5 h-3.5 w-3.5 text-secondary" />
                <span>AI-powered travel planning made simple</span>
              </div>

              <h1 className="mb-4 text-3xl font-bold leading-tight md:mb-6 md:text-4xl lg:text-5xl xl:text-6xl">
                Create unforgettable journeys with ease
              </h1>

              <p className="mb-6 text-lg leading-relaxed text-white/90 md:mb-8 md:text-xl">
                WanderPlan Studio helps you organize your travel itinerary, discover amazing places,
                and share your adventures with friends.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row">
                {isAuthenticated ? (
                  <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                    <Link href="/dashboard">
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                      <Link href="/auth/signin">
                        <UserPlus className="mr-2 h-5 w-5" />
                        Get Started Free
                      </Link>
                    </Button>

                    <Button asChild size="lg" variant="secondary">
                      <Link href="/dashboard?test_mode=true">
                        <ExternalLink className="mr-2 h-5 w-5" />
                        Try Demo Without Login
                      </Link>
                    </Button>
                  </>
                )}
              </div>

              <div className="mt-6 flex items-center text-sm text-white/80 md:mt-8">
                <div className="mr-3 flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-primary bg-gradient-to-b from-purple-400 to-purple-600 text-xs font-medium md:h-8 md:w-8"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <span>Joined by 10,000+ travel enthusiasts</span>
              </div>
            </div>

            <div className="relative mt-8 md:mt-0 md:hidden">
              <div className="relative mx-auto max-w-sm">
                <img
                  src="https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&q=80&w=800"
                  alt="Travel planning"
                  className="aspect-[4/3] h-auto w-full rounded-3xl object-cover shadow-xl"
                />
              </div>
            </div>

            <div className="relative mt-8 hidden md:mt-0 md:block">
              <div className="absolute inset-0 rotate-6 transform rounded-3xl bg-gradient-to-r from-primary to-accent opacity-20 blur-xl"></div>
              <div className="relative mx-auto md:max-w-lg lg:max-w-2xl xl:max-w-3xl">
                <img
                  src="https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&q=85&w=1200"
                  alt="Travel planning"
                  className="aspect-[4/3] h-auto w-full rotate-2 transform rounded-3xl object-cover shadow-2xl transition-transform duration-500 hover:rotate-0"
                />

                <div className="absolute max-w-[180px] -rotate-3 transform rounded-2xl bg-white p-3 shadow-xl md:-bottom-6 md:-right-6 md:max-w-[200px] lg:-bottom-8 lg:-right-10 lg:max-w-[250px] lg:p-4">
                  <div className="mb-1 flex items-center lg:mb-2">
                    <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white lg:h-8 lg:w-8">
                      <MapPin className="h-3 w-3 lg:h-4 lg:w-4" />
                    </div>
                    <span className="text-sm font-semibold text-foreground lg:text-base">
                      Paris, France
                    </span>
                  </div>
                  <div className="mb-1 flex justify-between text-xs text-muted-foreground lg:mb-2 lg:text-sm">
                    <span>8 days trip</span>
                    <span>$1,650</span>
                  </div>
                  <div className="h-1 w-full overflow-hidden rounded-full bg-muted lg:h-1.5">
                    <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-primary to-secondary"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 gap-4 text-center md:mt-16 md:grid-cols-4 md:gap-5 lg:mt-20">
            <div className="transform rounded-xl bg-white/10 p-4 backdrop-blur-md transition-transform hover:scale-105 md:p-6">
              <div className="mb-1 text-2xl font-bold md:mb-2 md:text-3xl">10k+</div>
              <div className="text-sm text-white/80 md:text-base">Happy Travelers</div>
            </div>
            <div className="transform rounded-xl bg-white/10 p-4 backdrop-blur-md transition-transform hover:scale-105 md:p-6">
              <div className="mb-1 text-2xl font-bold md:mb-2 md:text-3xl">150+</div>
              <div className="text-sm text-white/80 md:text-base">Countries Covered</div>
            </div>
            <div className="transform rounded-xl bg-white/10 p-4 backdrop-blur-md transition-transform hover:scale-105 md:p-6">
              <div className="mb-1 text-2xl font-bold md:mb-2 md:text-3xl">98%</div>
              <div className="text-sm text-white/80 md:text-base">Customer Satisfaction</div>
            </div>
            <div className="transform rounded-xl bg-white/10 p-4 backdrop-blur-md transition-transform hover:scale-105 md:p-6">
              <div className="mb-1 text-2xl font-bold md:mb-2 md:text-3xl">24/7</div>
              <div className="text-sm text-white/80 md:text-base">Customer Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-background py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">
              Everything you need for perfect travel planning
            </h2>
            <p className="text-lg text-muted-foreground">
              Our comprehensive set of tools makes trip planning effortless and enjoyable.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg border border-border p-8 shadow-sm transition-all hover:shadow-md">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">Smart Itineraries</h3>
              <p className="mb-4 text-muted-foreground">
                Build comprehensive day-by-day travel plans with activities, reservations, and
                transportation.
              </p>
              <Link
                href="/plan"
                className="inline-flex items-center text-primary hover:text-primary/80"
              >
                Learn more <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <div className="rounded-lg border border-border p-8 shadow-sm transition-all hover:shadow-md">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                <Map className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">Interactive Maps</h3>
              <p className="mb-4 text-muted-foreground">
                Visualize your entire journey with rich, interactive maps and location-based
                recommendations.
              </p>
              <Link
                href="/explore"
                className="inline-flex items-center text-primary hover:text-primary/80"
              >
                Learn more <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <div className="rounded-lg border border-border p-8 shadow-sm transition-all hover:shadow-md">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-primary">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">Seamless Collaboration</h3>
              <p className="mb-4 text-muted-foreground">
                Plan trips together with real-time collaboration and sharing features for groups.
              </p>
              <Link
                href="/trips"
                className="inline-flex items-center text-primary hover:text-primary/80"
              >
                Learn more <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-muted/50 py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">How WanderPlan Works</h2>
            <p className="text-lg text-muted-foreground">
              Our simple 4-step process makes trip planning effortless and enjoyable.
            </p>
          </div>

          <div className="relative">
            {/* Connection line */}
            <div className="absolute left-0 top-24 hidden h-0.5 w-full bg-primary/20 md:block"></div>

            <div className="relative grid gap-8 md:grid-cols-4">
              <div className="text-center">
                <div className="relative z-10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-primary to-primary/80 text-xl font-bold text-white shadow-lg shadow-primary/20">
                  1
                </div>
                <h3 className="mb-3 text-xl font-semibold">Create an account</h3>
                <p className="text-muted-foreground">
                  Sign up for free and access all our trip planning features.
                </p>
              </div>

              <div className="text-center">
                <div className="relative z-10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-primary to-primary/80 text-xl font-bold text-white shadow-lg shadow-primary/20">
                  2
                </div>
                <h3 className="mb-3 text-xl font-semibold">Start a new trip</h3>
                <p className="text-muted-foreground">
                  Set your destination, dates, and basic trip details.
                </p>
              </div>

              <div className="text-center">
                <div className="relative z-10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-primary to-primary/80 text-xl font-bold text-white shadow-lg shadow-primary/20">
                  3
                </div>
                <h3 className="mb-3 text-xl font-semibold">Plan your itinerary</h3>
                <p className="text-muted-foreground">
                  Add activities, accommodations, and transportation to your schedule.
                </p>
              </div>

              <div className="text-center">
                <div className="relative z-10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-primary to-primary/80 text-xl font-bold text-white shadow-lg shadow-primary/20">
                  4
                </div>
                <h3 className="mb-3 text-xl font-semibold">Share and enjoy!</h3>
                <p className="text-muted-foreground">
                  Invite travel companions and access your itinerary on the go.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-background py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">What our users are saying</h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of travelers who use WanderPlan Studio to create memorable experiences.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-xl border border-border/40 bg-muted/30 p-8 transition-transform hover:shadow-lg">
              <div className="mb-4 flex items-center">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="mb-6 text-foreground/80">
                "WanderPlan Studio transformed our family vacation planning. The collaborative
                features made it easy to create a trip everyone loved!"
              </p>
              <div className="flex items-center">
                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                  JS
                </div>
                <div>
                  <h4 className="font-semibold">Jennifer Smith</h4>
                  <p className="text-sm text-muted-foreground">Family Traveler</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border/40 bg-muted/30 p-8 transition-transform hover:shadow-lg">
              <div className="mb-4 flex items-center">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="mb-6 text-foreground/80">
                "The interactive maps and AI recommendations helped me discover hidden gems I would
                have never found otherwise. Absolutely fantastic!"
              </p>
              <div className="flex items-center">
                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                  MJ
                </div>
                <div>
                  <h4 className="font-semibold">Michael Johnson</h4>
                  <p className="text-sm text-muted-foreground">Adventure Traveler</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border/40 bg-muted/30 p-8 transition-transform hover:shadow-lg">
              <div className="mb-4 flex items-center">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="mb-6 text-foreground/80">
                "As a business traveler, I need efficiency. WanderPlan Studio helps me organize my
                trips quickly and keeps everything in one place."
              </p>
              <div className="flex items-center">
                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                  SL
                </div>
                <div>
                  <h4 className="font-semibold">Sarah Lee</h4>
                  <p className="text-sm text-muted-foreground">Business Traveler</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-primary/90 to-primary/70 py-24 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">
              Ready to plan your next adventure?
            </h2>
            <p className="mb-10 text-xl text-white/90">
              Join thousands of travelers who use WanderPlan Studio to create memorable experiences.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              {isAuthenticated ? (
                <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                  <Link href="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                    <Link href="/auth/signin">
                      <UserPlus className="mr-2 h-5 w-5" />
                      Get Started Free
                    </Link>
                  </Button>

                  <Button asChild size="lg" variant="secondary">
                    <Link href="/dashboard?test_mode=true">
                      <ExternalLink className="mr-2 h-5 w-5" />
                      Try Demo Without Login
                    </Link>
                  </Button>
                </>
              )}
            </div>

            <div className="mt-8 inline-flex items-center text-sm text-white/80">
              <Shield className="mr-2 h-4 w-4" />
              No credit card required. Free plan available.
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
