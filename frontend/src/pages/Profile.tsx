
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { User, Settings, MapPin, Calendar, Shield, CreditCard } from "lucide-react";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    location: 'San Francisco, CA',
    bio: 'Travel enthusiast and adventure seeker. Always looking for the next destination to explore.',
    joinDate: 'January 2023'
  });

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-1/4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7" alt="Profile" />
                    <AvatarFallback>AJ</AvatarFallback>
                  </Avatar>
                  
                  <h2 className="text-xl font-bold">{profileData.name}</h2>
                  <p className="text-muted-foreground text-sm">{profileData.email}</p>
                  
                  <div className="flex items-center mt-2 text-muted-foreground text-sm">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{profileData.location}</span>
                  </div>
                  
                  <div className="flex items-center mt-1 text-muted-foreground text-sm">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Joined {profileData.joinDate}</span>
                  </div>

                  <Separator className="my-4" />
                  
                  <nav className="w-full space-y-1">
                    <Button variant="ghost" className="w-full justify-start">
                      <User className="mr-2 h-4 w-4" />
                      Profile Information
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Payment Methods
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Shield className="mr-2 h-4 w-4" />
                      Privacy & Security
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Settings className="mr-2 h-4 w-4" />
                      Account Settings
                    </Button>
                  </nav>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="w-full md:w-3/4">
            <Tabs defaultValue="profile">
              <TabsList className="mb-4">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="trips">My Trips</TabsTrigger>
                <TabsTrigger value="preferences">Travel Preferences</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Profile Information</CardTitle>
                    {!isEditing ? (
                      <Button variant="outline" onClick={() => setIsEditing(true)}>
                        Edit Profile
                      </Button>
                    ) : (
                      <Button onClick={handleSaveProfile}>
                        Save Changes
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isEditing ? (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input 
                            id="name" 
                            value={profileData.name}
                            onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            value={profileData.email}
                            onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input 
                            id="location" 
                            value={profileData.location}
                            onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="bio">Bio</Label>
                          <Input 
                            id="bio" 
                            value={profileData.bio}
                            onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                          />
                        </div>
                      </>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium">Full Name</h3>
                          <p>{profileData.name}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium">Email</h3>
                          <p>{profileData.email}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium">Location</h3>
                          <p>{profileData.location}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium">Bio</h3>
                          <p>{profileData.bio}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="trips">
                <Card>
                  <CardHeader>
                    <CardTitle>My Trips</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">You can view and manage all your trips from the Dashboard page.</p>
                    <Button className="mt-4" asChild>
                      <a href="/dashboard">Go to Dashboard</a>
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="preferences">
                <Card>
                  <CardHeader>
                    <CardTitle>Travel Preferences</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Preferred Travel Style</h3>
                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline" size="sm" className="rounded-full">Adventure</Button>
                          <Button variant="outline" size="sm" className="rounded-full">Cultural</Button>
                          <Button variant="outline" size="sm" className="rounded-full">Relaxation</Button>
                          <Button variant="outline" size="sm" className="rounded-full">Food & Drink</Button>
                          <Button variant="outline" size="sm" className="rounded-full">Nature</Button>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-2">Accommodation Preferences</h3>
                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline" size="sm" className="rounded-full">Hotels</Button>
                          <Button variant="outline" size="sm" className="rounded-full">Hostels</Button>
                          <Button variant="outline" size="sm" className="rounded-full">Boutique</Button>
                          <Button variant="outline" size="sm" className="rounded-full">Apartment</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
