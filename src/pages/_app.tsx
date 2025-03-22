import '@/styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { ToastProvider } from '@/components/toast/ToastContext';
import { Layout } from '@/components/layout/Layout';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

export type NextPageWithLayout = {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const router = useRouter();

  // Configure NProgress
  NProgress.configure({ showSpinner: false });

  useEffect(() => {
    // Handle route change start event with NProgress
    const handleStart = (url: string) => {
      NProgress.start();
    };

    // Handle route change complete event with NProgress
    const handleComplete = (url: string) => {
      NProgress.done();
    };

    // Handle route change error event with NProgress
    const handleError = () => {
      NProgress.done();
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleError);

    // Cleanup event listeners on component unmount
    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleError);
    };
  }, [router]);

  // Use the getLayout function if available or use default Layout
  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);

  return (
    <SessionProvider session={pageProps.session}>
      <ThemeProvider>
        <ToastProvider>{getLayout(<Component {...pageProps} />)}</ToastProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
