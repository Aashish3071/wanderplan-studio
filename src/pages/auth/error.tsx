import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AuthError() {
  const router = useRouter();
  const { error } = router.query;

  const errorMessages: Record<string, string> = {
    default: 'An error occurred during authentication.',
    configuration: 'There is a problem with the server configuration.',
    accessdenied: 'You do not have permission to sign in.',
    verification: 'The verification link may have been used or is no longer valid.',
    sessionrequired: 'Please sign in to access this page.',
  };

  const errorMessage = error
    ? errorMessages[error as string] || errorMessages.default
    : errorMessages.default;

  return (
    <>
      <Head>
        <title>Authentication Error | WanderPlan Studio</title>
        <meta name="description" content="Authentication error" />
      </Head>

      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-primary/5 to-background p-4">
        <div className="w-full max-w-md space-y-8 rounded-lg border bg-white p-6 shadow-lg">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-8 w-8 text-red-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Authentication Error</h1>
            <p className="mt-2 text-gray-600">{errorMessage}</p>
          </div>

          <div className="space-y-4">
            <Button asChild className="w-full">
              <Link href="/auth/signin">Try Again</Link>
            </Button>

            <Button variant="outline" asChild className="w-full">
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
