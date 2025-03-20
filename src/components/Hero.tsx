import { useState } from "react";
import {
  Zap,
  Sparkles,
  ArrowRight,
  Users,
  Globe,
  Calendar,
  MapPin,
} from "lucide-react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const router = useRouter();

  const handleQuickStart = () => {
    router.push("/itinerary-planner");
  };

  return (
    <div className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-indigo-50/30 to-white z-0"></div>
      <div className="absolute top-1/4 left-10 w-64 h-64 bg-primary/10 rounded-full filter blur-3xl animate-spin-slow"></div>
      <div className="absolute bottom-10 right-20 w-72 h-72 bg-accent/80 rounded-full filter blur-3xl opacity-70 animate-spin-slow"></div>
      <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-pink-200/30 rounded-full filter blur-3xl animate-pulse"></div>

      {/* Decorative Elements */}
      <div className="absolute top-[15%] right-[10%] w-6 h-6 bg-yellow-300 rounded-full animate-bounce hidden md:block"></div>
      <div className="absolute bottom-[20%] left-[15%] w-4 h-4 bg-primary rounded-full animate-ping opacity-70 hidden md:block"></div>

      {/* Foreground Content */}
      <div className="container mx-auto px-4 sm:px-6 pt-20 md:pt-32 pb-16 md:pb-20 relative z-10">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto animate-slide-up">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full mb-6 sm:mb-8 shadow-sm">
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-xs sm:text-sm font-medium text-gray-800">
              Your Entire Trip Planned in Seconds
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-primary to-gray-900">
            Plan Your Trip in{" "}
            <span className="text-primary relative inline-block">
              Seconds
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-primary/30 rounded-full"></span>
            </span>{" "}
            with AI
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-10 max-w-2xl px-2 leading-relaxed">
            Tell us your destination, dates, and interests, and our AI will
            create a{" "}
            <span className="font-semibold text-primary">
              personalized itinerary
            </span>{" "}
            with embedded maps and visual location guides.
          </p>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 sm:mb-10 w-full max-w-2xl">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col items-center">
              <div className="bg-primary/10 p-2 rounded-full mb-2">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-medium text-sm">Personalized Planning</h3>
              <p className="text-xs text-gray-600">
                Custom itineraries based on your interests
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col items-center">
              <div className="bg-primary/10 p-2 rounded-full mb-2">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-medium text-sm">Visual Itineraries</h3>
              <p className="text-xs text-gray-600">
                Maps and location highlights
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col items-center">
              <div className="bg-primary/10 p-2 rounded-full mb-2">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-medium text-sm">Budget Tracking</h3>
              <p className="text-xs text-gray-600">
                Monitor expenses as you travel
              </p>
            </div>
          </div>

          {/* Enhanced CTA Button */}
          <Button
            size="lg"
            className="mb-8 sm:mb-10 text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto max-w-xs rounded-xl group"
            onClick={handleQuickStart}
            aria-label="Plan your trip in seconds with AI"
          >
            <Zap className="mr-2 h-5 w-5 sm:h-6 sm:w-6 group-hover:animate-pulse" />
            <span>Plan Your Trip in Seconds</span>
            <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
          </Button>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
            <span className="font-medium">Popular Destinations: </span>
            {["Tokyo", "Bali", "Paris", "New York", "Santorini"].map(
              (place) => (
                <button
                  key={place}
                  className="hover:text-primary hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-1 rounded-sm"
                  aria-label={`Explore ${place}`}
                  onClick={() => {
                    router.push({
                      pathname: "/itinerary-planner",
                      query: { destination: place },
                    });
                  }}
                >
                  {place}
                </button>
              )
            )}
          </div>

          {/* Enhanced Social Proof with Collaboration Focus */}
          <div className="mt-10 flex flex-col items-center">
            <div className="flex -space-x-2 overflow-hidden mb-3">
              {[1, 2, 3, 4, 5].map((num) => (
                <img
                  key={num}
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                  src={`https://i.pravatar.cc/150?img=${20 + num}`}
                  alt={`User avatar ${num}`}
                />
              ))}
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">
                Trusted by 10,000+ travelers worldwide
              </p>
              <p className="text-xs font-medium text-primary">
                4-step process takes less than 60 seconds
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Hide on small screens */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 hidden sm:flex flex-col items-center animate-bounce">
        <span className="text-xs text-muted-foreground mb-2">
          Scroll to explore
        </span>
        <div className="w-0.5 h-6 bg-muted-foreground/30 rounded-full"></div>
      </div>
    </div>
  );
};

export default Hero; 