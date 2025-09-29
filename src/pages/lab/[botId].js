// src/pages/lab/[botId].js

import Head from 'next/head';
import { useRouter } from 'next/router';
import { chatbotData } from '../../data/bots';
import { useSession, signIn } from 'next-auth/react';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import useDebounce from '../../hooks/useDebounce'; // Import the debouncing hook

export default function AgentLabPage() {
    const router = useRouter();
    const { botId } = router.query;
    const [bot, setBot] = useState(null);
    const [noteContent, setNoteContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const { data: session, status } = useSession();
    
    // Create a debounced version of the note content.
    // The value will only update after the user has stopped typing for 1.5 seconds.
    const debouncedNoteContent = useDebounce(noteContent, 1500);
    
    // A ref to prevent the initial auto-save on component mount
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (botId) {
            const foundBot = chatbotData.find(b => b.id === botId);
            setBot(foundBot);
        }
    }, [botId]);

    useEffect(() => {
        if (status !== "loading" && !session) {
            // Redirect to login but send them back here after
            signIn(undefined, { callbackUrl: router.asPath });
        }
    }, [session, status, router]);

    // Fetch the user's note for this bot when the session and bot are ready
    useEffect(() => {
        if (session && bot) {
            setIsLoading(true);
            fetch(`/api/notes/${bot.id}`)
                .then(res => res.json())
                .then(note => {
                    if (note) {
                        setNoteContent(note.content);
                    }
                })
                .catch(err => toast.error("Could not load your notes."))
                .finally(() => setIsLoading(false));
        }
    }, [session, bot]);
    
    // Auto-save effect that runs when the debounced content changes
    useEffect(() => {
        // Don't save on the very first render
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        
        // Don't save if content hasn't loaded yet
        if (isLoading) {
            return;
        }

        handleSaveNote();

    }, [debouncedNoteContent]);

    const handleSaveNote = async () => {
        setIsSaving(true);
        try {
            const response = await fetch(`/api/notes/${bot.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: noteContent }),
            });
            if (!response.ok) throw new Error('Failed to save note.');
            // We can use a more subtle success indicator instead of a toast for auto-save
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsSaving(false);
        }
    };

    if (status === "loading" || !session || !bot) {
        return <div className="full-page-message-wrapper">Loading Lab...</div>;
    }

    return (
        <>
            <Head>
                <title>{bot.name} Lab | Agentic Collective</title>
                <meta name="robots" content="noindex" /> {/* Prevent search engines from indexing this page */}
            </Head>
            <div className="agent-lab-layout">
                <div className="lab-iframe-panel">
                    <iframe 
                        src={bot.embedUrl}
                        title={bot.name}
                        className="lab-iframe"
                        allow="clipboard-read; clipboard-write; microphone"
                    ></iframe>
                </div>

                <div className="lab-scratchpad-panel">
                    <div className="scratchpad-header">
                        <h3>Scratchpad</h3>
                        <p>Your personal notes for <strong>{bot.name}</strong></p>
                    </div>
                    <div className="scratchpad-editor">
                        {isLoading ? (
                            <div className="loader-container"><div className="loader"></div></div>
                        ) : (
                            <textarea 
                                value={noteContent}
                                onChange={(e) => setNoteContent(e.target.value)}
                                placeholder="Copy-paste your best results, prompts, and ideas here. Your work will be saved automatically..."
                            />
                        )}
                    </div>
                    <div className="scratchpad-footer">
                        <div className="save-status">
                            {isSaving ? 'Saving...' : 'All changes saved.'}
                        </div>
                        <Link href="/dashboard" className="details-link">Exit Lab</Link>
                    </div>
                </div>
            </div>
        </>
    );
}