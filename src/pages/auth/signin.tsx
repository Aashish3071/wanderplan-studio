import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Button } from '@/components/ui/button';

export default function SignIn() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { callbackUrl } = router.query;

  const handleSignIn = async (provider: string) => {
    setIsLoading(true);

    // In development, use the credentials provider with default test user
    if (process.env.NODE_ENV !== 'production') {
      await signIn('credentials', {
        email: 'test@example.com',
        password: 'password',
        callbackUrl: (callbackUrl as string) || '/dashboard',
      });
    } else {
      await signIn(provider, {
        callbackUrl: (callbackUrl as string) || '/dashboard',
      });
    }

    setIsLoading(false);
  };

  return (
    <>
      <Head>
        <title>Sign In | WanderPlan Studio</title>
        <meta name="description" content="Sign in to your WanderPlan Studio account" />
      </Head>

      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-primary/5 to-background p-4">
        <div className="w-full max-w-md space-y-8 rounded-lg border bg-white p-6 shadow-lg">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="mt-2 text-gray-600">Sign in to continue to WanderPlan Studio</p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={() => handleSignIn('credentials')}
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in (Development)'}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" onClick={() => handleSignIn('google')} disabled={isLoading}>
                Google
              </Button>
              <Button variant="outline" onClick={() => handleSignIn('github')} disabled={isLoading}>
                GitHub
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
