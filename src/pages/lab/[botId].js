// src/pages/lab/[botId].js

import Head from 'next/head';
import { useRouter } from 'next/router';
import { chatbotData } from '../../data/bots';
import { useSession, signIn } from 'next-auth/react';
import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import useDebounce from '../../hooks/useDebounce';
import dynamic from 'next/dynamic';
import LabLayout from '../../components/LabLayout';

// Dynamically import the editor and disable Server-Side Rendering (SSR)
const SimpleMdeEditor = dynamic(
    () => import("react-simplemde-editor"),
    { ssr: false }
);
import "easymde/dist/easymde.min.css";

export default function AgentLabPage() {
    const router = useRouter();
    const { botId } = router.query;
    const [bot, setBot] = useState(null);
    const [noteContent, setNoteContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [isZenMode, setIsZenMode] = useState(false);
    const { data: session, status } = useSession();
    
    const debouncedNoteContent = useDebounce(noteContent, 2000);
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (botId) {
            const foundBot = chatbotData.find(b => b.id === botId);
            setBot(foundBot);
        }
    }, [botId]);

    useEffect(() => {
        if (status === "loading") return;
        if (!session) {
            signIn(undefined, { callbackUrl: router.asPath });
        }
    }, [session, status, router]);

    useEffect(() => {
        if (session && bot) {
            fetch(`/api/notes/${bot.id}`)
                .then(res => res.json())
                .then(note => {
                    if (note) {
                        setNoteContent(note.content);
                    }
                    isInitialMount.current = true; // Set true after loading to prevent initial save
                })
                .catch(err => toast.error("Could not load your notes."))
                .finally(() => setIsLoading(false));
        }
    }, [session, bot]);
    
    const handleSaveNote = useCallback(async (contentToSave) => {
        if (!isDirty) return;
        setIsSaving(true);
        try {
            const response = await fetch(`/api/notes/${bot.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: contentToSave }),
            });
            if (!response.ok) throw new Error('Failed to save note.');
            setIsDirty(false);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsSaving(false);
        }
    }, [bot, isDirty]);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        handleSaveNote(debouncedNoteContent);
    }, [debouncedNoteContent, handleSaveNote]);

    const onNoteChange = useCallback((value) => {
        setNoteContent(value);
        setIsDirty(true);
    }, []);
    
    const getSaveStatus = () => {
        if (isSaving) return <><span className="save-spinner"></span>Saving...</>;
        if (!isDirty) return <span className="saved-checkmark">✓ All changes saved</span>;
        return 'Unsaved changes';
    };

    // Memoize the editor options to prevent re-renders
    const editorOptions = useMemo(() => {
        return {
            autofocus: true,
            spellChecker: false,
            toolbar: ["bold", "italic", "strikethrough", "|", "code", "quote", "unordered-list", "ordered-list", "|", "preview"],
            status: false,
            // The height is now controlled purely by CSS for the auto-growing effect
        };
    }, []);

    if (status === "loading" || !bot) {
        return <div className="full-page-message-wrapper">Loading Lab...</div>;
    }

    return (
        <LabLayout>
            <Head>
                <title>{bot.name} Lab | Agentic Collective</title>
                <meta name="robots" content="noindex" />
            </Head>
            <div className="lab-top-bar">
                <Link href="/dashboard" className="back-to-dashboard">
                    ← Back to Dashboard
                </Link>
            </div>
            <div className={`agent-lab-layout ${isZenMode ? 'zen-mode' : ''}`}>
                <div className="lab-iframe-panel">
                    <iframe src={bot.embedUrl} title={bot.name} className="lab-iframe" allow="clipboard-read; clipboard-write; microphone"></iframe>
                </div>
                <div className="lab-scratchpad-panel">
                    <div className="scratchpad-header">
                        <div className="header-text">
                            <h3>Scratchpad</h3>
                            <p>Your personal notes for <strong>{bot.name}</strong></p>
                        </div>
                        <button className="zen-mode-toggle" onClick={() => setIsZenMode(!isZenMode)} title="Toggle Focus Mode">
                            {isZenMode ? 'Exit Focus' : 'Focus Mode'}
                        </button>
                    </div>
                    <div className="scratchpad-editor">
                        <SimpleMdeEditor
                            value={noteContent}
                            onChange={onNoteChange}
                            options={editorOptions}
                        />
                    </div>
                    <div className="scratchpad-footer">
                        <div className={`save-status ${!isDirty && !isSaving ? 'saved' : ''}`}>
                            {getSaveStatus()}
                        </div>
                        <div className="footer-actions">
                            <button className="cta-button" onClick={() => handleSaveNote(noteContent)} disabled={isSaving || !isDirty}>
                                Save
                            </button>
                            <Link href="/dashboard" className="details-link">Exit Lab</Link>
                        </div>
                    </div>
                </div>
            </div>
        </LabLayout>
    );
}

export async function getServerSideProps(context) {
    const { botId } = context.params;
    const bot = chatbotData.find(b => b.id === botId) || null;
    if (!bot) {
        return { notFound: true };
    }
    return { props: { bot } };
}