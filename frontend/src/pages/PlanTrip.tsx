import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { DatePickerWithRange } from "@/components/DatePickerWithRange";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import strapiService from "../services/strapiService";

const PlanTrip = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState({ from: undefined, to: undefined });
  const [budget, setBudget] = useState(1000);
  const [interests, setInterests] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting = useState(false);

  const handleInterestToggle = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const handleSubmit = async () => {
    if (!destination) {
      toast.error("Please enter a destination");
      return;
    }

    if (!date.from || !date.to) {
      toast.error("Please select travel dates");
      return;
    }

    setIsSubmitting(true);

    try {
      // Try to create the itinerary with Strapi
      const itineraryData = {
        title: `Trip to ${destination}`,
        destinations: destination,
        dates: date,
        budget: budget,
        tags: interests.length > 0 ? interests[0] : "nature",
        dailyPlan: []
      };

      let response;
      try {
        // First try Strapi
        response = await strapiService.createItinerary(itineraryData);
      } catch (strapiError) {
        console.error("Error creating trip with Strapi:", strapiError);
        // Fall back to the API endpoint
        response = await axios.post('http://localhost:5000/api/itineraries', itineraryData);
      }

      toast.success("Trip plan created successfully!");
      navigate(`/itinerary/${response.id}`);
    } catch (error) {
      console.error("Error creating trip plan:", error);
      toast.error("Failed to create trip plan. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto py-10 flex-grow">
        <h1 className="text-3xl font-bold mb-8 text-center">Plan Your Perfect Trip</h1>
        
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Trip Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="destination">Where do you want to go?</Label>
              <Input 
                id="destination" 
                placeholder="Enter city, country, or region" 
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>When are you traveling?</Label>
              <DatePickerWithRange date={date} setDate={setDate} />
            </div>
            
            <div className="space-y-2">
              <Label>Budget (USD)</Label>
              <div className="flex items-center gap-4">
                <Slider 
                  value={[budget]} 
                  min={100} 
                  max={10000} 
                  step={100} 
                  onValueChange={(value) => setBudget(value[0])}
                />
                <span className="min-w-[80px] text-right font-medium">${budget}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>What are you interested in?</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {["Family", "Adventure", "Culture", "Food", "Relaxation", "Nightlife", "Shopping", "Nature"].map((interest) => (
                  <Button 
                    key={interest}
                    variant={interests.includes(interest) ? "default" : "outline"}
                    onClick={() => handleInterestToggle(interest)}
                    className="rounded-full"
                  >
                    {interest}
                  </Button>
                ))}
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <Button 
              className="w-full" 
              size="lg"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating your plan..." : "Create My Trip Plan"}
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default PlanTrip;
