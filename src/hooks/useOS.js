// src/hooks/useOS.js

import { useState, useEffect } from 'react';

// A simple hook to detect if the user is on a Mac-like platform.
export default function useOS() {
    const [isMac, setIsMac] = useState(false);

    useEffect(() => {
        // This code only runs in the browser environment, where 'navigator' is available.
        // During Server-Side Rendering, 'navigator' is undefined.
        if (typeof window !== 'undefined' && navigator.platform) {
            // "MacIntel" is the platform string for Mac on most browsers.
            // We also check for iPad/iPhone/iPod which also use Cmd key on external keyboards.
            const isMacPlatform = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
            setIsMac(isMacPlatform);
        }
    }, []); // The empty dependency array ensures this effect runs only once after the component mounts.

    return { isMac };
}