import { ReactNode } from 'react';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import Navbar from '../navigation/Navbar';
import Footer from '../navigation/Footer';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { status } = useSession();
  const isLoading = status === 'loading';

  return (
    <>
      <Head>
        <title>WanderPlan Studio</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Plan your dream trip with ease. WanderPlan Studio helps you organize your travel itinerary, discover amazing places, and share your plans with friends."
        />
        <meta name="theme-color" content="#4263EB" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />

        {/* Main content with padding for fixed navbar */}
        <main className="flex-1 pt-16 md:pt-20">
          {isLoading ? (
            <div className="flex min-h-[70vh] items-center justify-center">
              <div className="relative h-12 w-12">
                <div className="absolute left-0 top-0 h-full w-full rounded-full border-4 border-primary/30 opacity-50"></div>
                <div className="absolute left-0 top-0 h-full w-full animate-spin rounded-full border-4 border-b-transparent border-l-transparent border-r-transparent border-t-primary"></div>
              </div>
            </div>
          ) : (
            children
          )}
        </main>

        <Footer />
      </div>
    </>
  );
};
