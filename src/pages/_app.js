// src/pages/_app.js

import '../styles/style.css';
import '../styles/auth.css';

import { SessionProvider } from "next-auth/react";
import { AnimatePresence } from 'framer-motion'; // <-- IMPORT
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter();
  return (
    <SessionProvider session={session}>
      {/* WRAP THE COMPONENT */}
      <AnimatePresence mode="wait" initial={false}>
        <Component {...pageProps} key={router.asPath} />
      </AnimatePresence>
    </SessionProvider>
  );
}

export default MyApp;