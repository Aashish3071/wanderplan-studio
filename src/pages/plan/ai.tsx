import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import UnifiedTripPlanner from '@/components/trips/UnifiedTripPlanner';

export default function AiItineraryPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      // This redirects to the login page by default
    },
  });
  const router = useRouter();

  if (status === 'loading') {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>AI Trip Planner | WanderPlan Studio</title>
        <meta
          name="description"
          content="Generate personalized trip itineraries with AI based on your preferences"
        />
      </Head>
      <UnifiedTripPlanner />
    </>
  );
}
