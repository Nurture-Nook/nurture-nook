import { AppProps } from 'next/app';
import { CurrentUserProvider } from '@/contexts/CurrentUserContextProvider';
import '../app/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CurrentUserProvider>
      <Component {...pageProps} />
    </CurrentUserProvider>
  );
}

export default MyApp;
