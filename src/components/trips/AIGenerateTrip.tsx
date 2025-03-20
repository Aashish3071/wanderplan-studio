import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Sparkles,
  CalendarIcon,
  DollarSign,
  Users,
  MapPin,
  Tag,
  Send,
  Loader2,
  Search,
  Calendar,
  CreditCard,
} from 'lucide-react';

interface FormData {
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  travelers: string;
  interests: string[];
}

const interests = [
  'Adventure',
  'Art & Culture',
  'Beach',
  'Cuisine',
  'Family-friendly',
  'Hiking',
  'History',
  'Luxury',
  'Nature',
  'Nightlife',
  'Photography',
  'Relaxation',
  'Romance',
  'Shopping',
  'Sightseeing',
  'Wildlife',
];

export default function AIGenerateTrip() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    destination: '',
    startDate: '',
    endDate: '',
    budget: 'mid-range',
    travelers: '2',
    interests: ['Sightseeing', 'Cuisine'],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generated, setGenerated] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => {
      const newInterests = prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest];

      return {
        ...prev,
        interests: newInterests,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.destination) {
      setError('Please enter a destination');
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      setError('Please select both start and end dates');
      return;
    }

    // Validate that end date is after start date
    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      setError('End date must be after start date');
      return;
    }

    if (formData.interests.length === 0) {
      setError('Please select at least one interest');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // For demo purposes, we'll simulate a trip creation using localStorage
      // In a real app, this would call an API to generate a trip using AI
      const newTripId = 'ai-' + Date.now().toString();

      // Calculate duration in days
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Create trip object
      const newTrip = {
        id: newTripId,
        title: `Trip to ${formData.destination}`,
        destination: formData.destination,
        startDate: formData.startDate,
        endDate: formData.endDate,
        description: `An AI-generated ${diffDays}-day trip to ${formData.destination} focused on ${formData.interests.join(', ')}.`,
        status: 'PLANNING',
        isPublic: false,
        coverImage: `https://source.unsplash.com/featured/?${encodeURIComponent(formData.destination)}`,
        createdAt: new Date().toISOString(),
        budget: formData.budget,
        travelers: parseInt(formData.travelers),
        interests: formData.interests,
      };

      // Save to localStorage
      const savedTrips = localStorage.getItem('trips');
      const trips = savedTrips ? JSON.parse(savedTrips) : [];
      localStorage.setItem('trips', JSON.stringify([newTrip, ...trips]));

      // Simulate AI processing time
      setTimeout(() => {
        setLoading(false);
        setGenerated(true);
        router.push(`/trips/${newTripId}`);
      }, 1500);
    } catch (err) {
      setLoading(false);
      setError('Failed to generate trip. Please try again.');
      console.error('Error generating trip:', err);
    }
  };

  return (
    <div className="card p-6 shadow-md">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">AI Trip Generator</h2>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/20">
          <Sparkles className="h-5 w-5 text-secondary" />
        </div>
      </div>

      <p className="mb-6 text-muted-foreground">
        Let our AI create a personalized trip itinerary based on your preferences.
      </p>

      {!generated ? (
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
              {error}
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            <div className="floating-label">
              <input
                type="text"
                id="destination"
                name="destination"
                className="form-input peer w-full pr-10 text-foreground"
                placeholder=" "
                value={formData.destination}
                onChange={handleChange}
                required
              />
              <label htmlFor="destination" className="text-foreground/70">
                Destination
              </label>
              <Search className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
            </div>

            <div className="floating-label">
              <input
                type="date"
                id="startDate"
                name="startDate"
                className="form-input peer w-full pr-10 text-foreground"
                placeholder=" "
                value={formData.startDate}
                onChange={handleChange}
                required
              />
              <label htmlFor="startDate" className="text-foreground/70">
                Start Date
              </label>
              <Calendar className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
            </div>

            <div className="floating-label">
              <input
                type="date"
                id="endDate"
                name="endDate"
                className="form-input peer w-full pr-10 text-foreground"
                placeholder=" "
                value={formData.endDate}
                onChange={handleChange}
                required
              />
              <label htmlFor="endDate" className="text-foreground/70">
                End Date
              </label>
              <Calendar className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
            </div>

            <div className="floating-label">
              <select
                id="budget"
                name="budget"
                className="form-input peer w-full appearance-none pr-10 text-foreground"
                value={formData.budget}
                onChange={handleChange}
                required
              >
                <option value=""></option>
                <option value="budget">Budget</option>
                <option value="mid-range">Mid-range</option>
                <option value="luxury">Luxury</option>
              </select>
              <label htmlFor="budget" className="text-foreground/70">
                Budget
              </label>
              <CreditCard className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
            </div>

            <div className="floating-label">
              <input
                type="number"
                id="travelers"
                name="travelers"
                className="form-input peer w-full pr-10 text-foreground"
                placeholder=" "
                min="1"
                max="10"
                value={formData.travelers}
                onChange={handleChange}
                required
              />
              <label htmlFor="travelers" className="text-foreground/70">
                Number of Travelers
              </label>
              <Users className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
            </div>
          </div>

          <div className="mt-6">
            <label className="mb-2 block text-sm font-medium text-foreground">Interests</label>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => handleInterestToggle(interest)}
                  className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm transition-colors ${
                    formData.interests.includes(interest)
                      ? 'bg-primary text-white'
                      : 'bg-muted/50 text-foreground hover:bg-muted'
                  }`}
                >
                  <Tag className="mr-1 h-3 w-3" />
                  {interest}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Select all that apply. We'll tailor your itinerary based on these interests.
            </p>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="btn bg-gradient-primary text-white hover:shadow-lg hover:shadow-primary/20"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Trip Plan
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 p-5">
            <h3 className="mb-3 text-lg font-medium text-foreground">Your AI-Generated Trip</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
                  <Search className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Destination</p>
                  <p className="font-medium text-foreground">{formData.destination}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/20">
                  <Calendar className="h-4 w-4 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Dates</p>
                  <p className="font-medium text-foreground">
                    {new Date(formData.startDate).toLocaleDateString()} -{' '}
                    {new Date(formData.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setGenerated(false)}
                  className="btn btn-sm mr-2 border border-input bg-white text-foreground hover:bg-muted/50"
                >
                  Back
                </button>
                <button className="btn btn-sm bg-primary text-white hover:bg-primary/90">
                  View Full Itinerary
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-white p-4">
            <h4 className="mb-2 font-medium text-foreground">Suggested Activities</h4>
            <ul className="space-y-2 text-foreground">
              <li className="flex items-start">
                <span className="mr-2 text-primary">•</span>
                <span>Visit the popular landmarks and attractions</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-secondary">•</span>
                <span>Experience local cuisine at recommended restaurants</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-accent">•</span>
                <span>Explore hidden gems and local favorites</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
