import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
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

export default function Home() {
  const { status } = useSession();
  const isAuthenticated = status === 'authenticated';

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
      <section className="bg-gradient-primary relative overflow-hidden pb-20 pt-32 text-white lg:pb-32 lg:pt-40">
        {/* Decorative shapes */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-full overflow-hidden">
          <div className="absolute -right-40 top-0 h-[600px] w-[600px] rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full bg-white/5 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-secondary/40 blur-3xl"></div>
        </div>

        <div className="container-custom relative z-10">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="max-w-xl">
              <div className="mb-4 inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-sm backdrop-blur-sm">
                <Star className="mr-1.5 h-3.5 w-3.5 text-secondary" />
                <span>AI-powered travel planning made simple</span>
              </div>

              <h1 className="mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
                Create unforgettable journeys with ease
              </h1>

              <p className="mb-8 text-xl leading-relaxed text-white/90">
                WanderPlan Studio helps you organize your travel itinerary, discover amazing places,
                and share your adventures with friends.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row">
                {isAuthenticated ? (
                  <Link
                    href="/dashboard"
                    className="btn btn-lg bg-white font-semibold text-primary shadow-lg hover:bg-white/90"
                  >
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/auth/register"
                      className="btn btn-lg bg-white font-semibold text-primary shadow-lg hover:bg-white/90"
                    >
                      <UserPlus className="mr-2 h-5 w-5" />
                      Get Started Free
                    </Link>

                    <Link
                      href="/dashboard?test_mode=true"
                      className="btn btn-lg bg-secondary/90 text-white backdrop-blur-sm hover:bg-secondary"
                    >
                      <ExternalLink className="mr-2 h-5 w-5" />
                      Try Demo Without Login
                    </Link>
                  </>
                )}
              </div>

              <div className="mt-8 flex items-center text-sm text-white/80">
                <div className="mr-3 flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-gradient-to-b from-purple-400 to-purple-600 text-xs font-medium"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <span>Joined by 10,000+ travel enthusiasts</span>
              </div>
            </div>

            <div className="relative hidden md:block">
              <div className="absolute inset-0 rotate-6 transform rounded-3xl bg-gradient-to-r from-primary to-accent opacity-20 blur-xl"></div>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&q=80"
                  alt="Travel planning"
                  className="rotate-2 transform rounded-3xl shadow-2xl transition-transform duration-500 hover:rotate-0"
                />

                <div className="absolute -bottom-8 -right-10 max-w-[250px] -rotate-3 transform rounded-2xl bg-white p-4 shadow-xl">
                  <div className="mb-2 flex items-center">
                    <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <span className="font-semibold text-foreground">Paris, France</span>
                  </div>
                  <div className="mb-2 flex justify-between text-sm text-muted-foreground">
                    <span>8 days trip</span>
                    <span>$1,650</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div className="bg-gradient-primary h-full w-3/4 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            <div className="transform rounded-xl bg-white/10 p-6 backdrop-blur-md transition-transform hover:scale-105">
              <div className="mb-2 text-3xl font-bold">10k+</div>
              <div className="text-white/80">Happy Travelers</div>
            </div>
            <div className="transform rounded-xl bg-white/10 p-6 backdrop-blur-md transition-transform hover:scale-105">
              <div className="mb-2 text-3xl font-bold">150+</div>
              <div className="text-white/80">Countries Covered</div>
            </div>
            <div className="transform rounded-xl bg-white/10 p-6 backdrop-blur-md transition-transform hover:scale-105">
              <div className="mb-2 text-3xl font-bold">98%</div>
              <div className="text-white/80">Customer Satisfaction</div>
            </div>
            <div className="transform rounded-xl bg-white/10 p-6 backdrop-blur-md transition-transform hover:scale-105">
              <div className="mb-2 text-3xl font-bold">24/7</div>
              <div className="text-white/80">Customer Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-background py-24">
        <div className="container-custom">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">
              Everything you need for perfect travel planning
            </h2>
            <p className="text-lg text-muted-foreground">
              Our comprehensive set of tools makes trip planning effortless and enjoyable.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="card card-hover p-8">
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

            <div className="card card-hover p-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                <Map className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">Interactive Maps</h3>
              <p className="mb-4 text-muted-foreground">
                Visualize your entire journey with rich, interactive maps and location-based
                recommendations.
              </p>
              <Link
                href="/map"
                className="inline-flex items-center text-primary hover:text-primary/80"
              >
                Learn more <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <div className="card card-hover p-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">Seamless Collaboration</h3>
              <p className="mb-4 text-muted-foreground">
                Plan trips together with real-time collaboration and sharing features for groups.
              </p>
              <Link
                href="/collaboration"
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
        <div className="container-custom">
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
                <div className="bg-gradient-primary relative z-10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white shadow-lg shadow-primary/20">
                  1
                </div>
                <h3 className="mb-3 text-xl font-semibold">Create an account</h3>
                <p className="text-muted-foreground">
                  Sign up for free and access all our trip planning features.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-gradient-primary relative z-10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white shadow-lg shadow-primary/20">
                  2
                </div>
                <h3 className="mb-3 text-xl font-semibold">Start a new trip</h3>
                <p className="text-muted-foreground">
                  Set your destination, dates, and basic trip details.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-gradient-primary relative z-10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white shadow-lg shadow-primary/20">
                  3
                </div>
                <h3 className="mb-3 text-xl font-semibold">Plan your itinerary</h3>
                <p className="text-muted-foreground">
                  Add activities, accommodations, and transportation to your schedule.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-gradient-primary relative z-10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white shadow-lg shadow-primary/20">
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
        <div className="container-custom">
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
      <section className="bg-gradient-primary py-24 text-white">
        <div className="container-custom text-center">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">
              Ready to plan your next adventure?
            </h2>
            <p className="mb-10 text-xl text-white/90">
              Join thousands of travelers who use WanderPlan Studio to create memorable experiences.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  className="btn btn-lg bg-white font-semibold text-primary hover:bg-white/90"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/auth/register"
                    className="btn btn-lg bg-white font-semibold text-primary hover:bg-white/90"
                  >
                    <UserPlus className="mr-2 h-5 w-5" />
                    Get Started Free
                  </Link>

                  <Link
                    href="/dashboard?test_mode=true"
                    className="btn btn-lg bg-secondary/90 text-white backdrop-blur-sm hover:bg-secondary"
                  >
                    <ExternalLink className="mr-2 h-5 w-5" />
                    Try Demo Without Login
                  </Link>
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
