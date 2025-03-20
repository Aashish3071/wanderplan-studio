import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Search, Globe, MapPin, TrendingUp, Users, Tag } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const categories = [
  { name: 'Adventure', icon: <Globe className="h-5 w-5" />, color: 'bg-blue-100' },
  { name: 'Beach', icon: <MapPin className="h-5 w-5" />, color: 'bg-amber-100' },
  { name: 'City', icon: <TrendingUp className="h-5 w-5" />, color: 'bg-violet-100' },
  { name: 'Culture', icon: <Users className="h-5 w-5" />, color: 'bg-green-100' },
  { name: 'Food', icon: <Tag className="h-5 w-5" />, color: 'bg-red-100' },
];

const trendingDestinations = [
  {
    name: 'Santorini',
    country: 'Greece',
    description: 'Iconic white and blue houses with stunning sea views',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff',
  },
  {
    name: 'Kyoto',
    country: 'Japan',
    description: 'Ancient temples and beautiful gardens',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e',
  },
  {
    name: 'Marrakech',
    country: 'Morocco',
    description: 'Vibrant markets and rich cultural heritage',
    image: 'https://images.unsplash.com/photo-1548018560-c7196548326d',
  },
];

const DiscoverPage = () => {
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState('');

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Discover | WanderPlan Studio</title>
        <meta name="description" content="Discover new travel destinations and experiences" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        {/* Hero section */}
        <div className="mb-10 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 p-8 text-white">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold">Discover Amazing Destinations</h1>
            <p className="mb-6 text-lg">
              Find inspiration for your next trip from our curated collection of destinations
            </p>
            <div className="relative mx-auto max-w-xl">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search destinations, experiences, or themes..."
                className="h-12 w-full pl-10 text-black"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">Explore by Category</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {categories.map((category, index) => (
              <Link
                href={`/discover/category/${category.name.toLowerCase()}`}
                key={index}
                className="group"
              >
                <div
                  className={`flex flex-col items-center rounded-lg p-6 transition-all hover:shadow-md ${category.color}`}
                >
                  <div className="mb-3 rounded-full bg-white p-3 text-primary shadow-sm">
                    {category.icon}
                  </div>
                  <span className="text-center font-medium">{category.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Trending destinations */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">Trending Destinations</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {trendingDestinations.map((destination, index) => (
              <Card key={index} className="overflow-hidden">
                <div
                  className="h-48 w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${destination.image})` }}
                />
                <CardHeader className="pb-2">
                  <CardTitle>
                    {destination.name}
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      {destination.country}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{destination.description}</p>
                  <Button className="mt-4" variant="outline" size="sm" asChild>
                    <Link href={`/discover/destination/${destination.name.toLowerCase()}`}>
                      View Details
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Curated collections */}
        <section>
          <h2 className="mb-6 text-2xl font-bold">Curated Collections</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Link href="/discover/collections/family-friendly" className="group">
              <div className="relative h-64 overflow-hidden rounded-lg">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1541280910158-c4e14f9c94a3')",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <h3 className="text-xl font-bold">Family-Friendly Destinations</h3>
                  <p className="mt-2">Perfect places for travelers with children</p>
                </div>
              </div>
            </Link>
            <Link href="/discover/collections/hidden-gems" className="group">
              <div className="relative h-64 overflow-hidden rounded-lg">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd')",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <h3 className="text-xl font-bold">Hidden Gems</h3>
                  <p className="mt-2">Lesser-known destinations that are worth the visit</p>
                </div>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default DiscoverPage;
