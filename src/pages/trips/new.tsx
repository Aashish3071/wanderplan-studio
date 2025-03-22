import { useSession } from 'next-auth/react';
import Head from 'next/head';
import UnifiedTripPlanner from '@/components/trips/UnifiedTripPlanner';

export default function NewTrip() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      // This redirects to the login page by default
    },
  });

  if (status === 'loading') {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Create New Trip | WanderPlan Studio</title>
        <meta name="description" content="Create a new trip with AI-powered planning" />
      </Head>
      <UnifiedTripPlanner />
    </>
  );
}
