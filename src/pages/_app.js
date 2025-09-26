// src/pages/_app.js

// Import the main stylesheet globally for all pages
import '../styles/style.css';

// Import the auth-specific stylesheet globally as well
// Next.js is smart enough to bundle these efficiently.
import '../styles/auth.css';

import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;