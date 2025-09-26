// src/pages/embed/[botId].js

import Head from 'next/head';
import { useRouter } from 'next/router';
import { chatbotData } from '../../data/bots';
import { useEffect, useState } from 'react';
import { useSession, signIn } from "next-auth/react";
import Link from 'next/link';

const getBotData = (botId) => chatbotData.find(bot => bot.id === botId);

export default function EmbedPage() {
    const router = useRouter();
    const { botId } = router.query;
    const [bot, setBot] = useState(null);
    const { data: session, status } = useSession();

    useEffect(() => {
        if (botId) {
            setBot(getBotData(botId));
        }
    }, [botId]);

    useEffect(() => {
        // If not loading and no session, redirect them to login.
        // After login, they will be sent back to this embed page.
        if (status !== "loading" && !session) {
            signIn(undefined, { callbackUrl: router.asPath });
        }
    }, [session, status, router]);
    
    // Show a loading screen while session is checked
    if (status === "loading" || !session) {
        return (
            <div className="full-page-message-wrapper">
                <p>Authenticating...</p>
            </div>
        );
    }

    if (!bot || !bot.embedUrl) {
        return (
            <div className="full-page-message-wrapper">
                <p>Bot not found. <Link href="/">Go back</Link></p>
            </div>
        );
    }
    
    return (
        <>
            <Head>
                <title>Agent: {bot.name} | Agentic Collective</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
            </Head>
            <iframe 
                src={bot.embedUrl}
                allow="clipboard-read; clipboard-write; microphone"
                title={bot.name}
                className="full-page-iframe"
            ></iframe>
        </>
    );
}