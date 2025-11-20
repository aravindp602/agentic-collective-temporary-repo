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
import SocialShareModal from '../../components/SocialShareModal';

const SimpleMdeEditor = dynamic(() => import("react-simplemde-editor"), { ssr: false });
import "easymde/dist/easymde.min.css";

export default function AgentLabPage() {
    const router = useRouter();
    const { botId } = router.query;
    const [bot, setBot] = useState(null);
    
    // --- State Management (Simplified) ---
    const [noteContent, setNoteContent] = useState('');
    const [generatedContent, setGeneratedContent] = useState('');
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    
    const [isSavingToDrive, setIsSavingToDrive] = useState(false);
    // REMOVED: isSharingLink state is no longer needed.

    const { data: session, status } = useSession();
    const debouncedNoteContent = useDebounce(noteContent, 2000);
    const isInitialMount = useRef(true);

    // --- Data Fetching and Initialization ---
    useEffect(() => {
        if (botId) setBot(chatbotData.find(b => b.id === botId));
    }, [botId]);

    useEffect(() => {
        if (status === "loading") return;
        if (!session) signIn(undefined, { callbackUrl: router.asPath });
    }, [session, status, router]);

    useEffect(() => {
        if (session && bot) {
            fetch(`/api/notes/${bot.id}`)
                .then(res => res.json())
                .then(note => {
                    if (note) setNoteContent(note.content);
                    isInitialMount.current = true;
                })
                .catch(err => toast.error("Could not load your notes."))
                .finally(() => setIsLoading(false));
        }
    }, [session, bot]);

    // --- Handlers for Personal Notes (Bottom Section) ---
    const handleSaveNote = useCallback(async (contentToSave) => {
        if (!isDirty) return;
        setIsSaving(true);
        try {
            const response = await fetch(`/api/notes/${bot.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: contentToSave }),
            });
            if (!response.ok) throw new Error('Failed to save notes.');
            setIsDirty(false);
        } catch (error) { toast.error(error.message);
        } finally { setIsSaving(false); }
    }, [bot, isDirty]);

    useEffect(() => {
        if (isInitialMount.current) { isInitialMount.current = false; return; }
        handleSaveNote(debouncedNoteContent);
    }, [debouncedNoteContent, handleSaveNote]);

    const onNoteChange = useCallback((value) => {
        setNoteContent(value);
        setIsDirty(true);
    }, []);

    // --- Handlers for Generated Content (Top Section) ---
    const handleSaveContentToDrive = async () => {
        if (!generatedContent.trim()) {
            toast.error("Paste content from the chatbot first!");
            return;
        }
        setIsSavingToDrive(true);
        const toastId = toast.loading('Saving content to Google Drive...');
        try {
            const response = await fetch('/api/actions/save-to-drive', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ noteContent: generatedContent, botName: bot.name }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            toast.success(
                () => (
                    <span>
                        Content saved!{' '}
                        <a href={data.driveLink} target="_blank" rel="noopener noreferrer" style={{color: '#cf3222', textDecoration: 'underline'}}>
                            Open in Drive
                        </a>
                    </span>
                ), 
                { id: toastId, duration: 8000 }
            );
        } catch (error) {
            toast.error(error.message || 'Failed to save.', { id: toastId });
        } finally {
            setIsSavingToDrive(false);
        }
    };
    
    // REMOVED: The handleGenerateShareLink function is no longer needed.
    
    // --- UI Helpers ---
    const getSaveStatus = () => {
        if (isSaving) return <><span className="save-spinner"></span>Saving notes...</>;
        if (isDirty) return 'Unsaved changes in notes';
        return <span className="saved-checkmark">✓ All notes saved</span>;
    };
    
    const editorOptions = useMemo(() => ({
        autofocus: false,
        spellChecker: false,
        toolbar: ["bold", "italic", "|", "quote", "unordered-list", "ordered-list"],
        status: false,
    }), []);

    if (status === "loading" || !bot) {
        return <div className="full-page-message-wrapper">Loading Lab...</div>;
    }

    return (
        <LabLayout>
            <Head>
                <title>{bot.name} Lab | Digital Lesson</title>
                <meta name="robots" content="noindex" />
            </Head>

            {isShareModalOpen && (
                <SocialShareModal
                    content={generatedContent}
                    botName={bot.name}
                    onClose={() => setIsShareModalOpen(false)}
                />
            )}

            <div className="lab-top-bar">
                <Link href="/dashboard" className="back-to-dashboard">
                    ← Back to Dashboard
                </Link>
            </div>

            <div className="agent-lab-layout">
                <div className="lab-iframe-panel">
                    <iframe src={bot.embedUrl} title={bot.name} className="lab-iframe" allow="clipboard-read; clipboard-write; microphone"></iframe>
                </div>
                
                <div className="lab-scratchpad-panel">
                    <div className="scratchpad-header">
                        <div className="header-text">
                            <h3>Generated Content</h3>
                            <p>Paste chatbot output here to share or save</p>
                        </div>
                    </div>
                    <div style={{ padding: '24px', borderBottom: '1px solid var(--border-dark)' }}>
                        <textarea
                            className="favorite-agent-workspace textarea"
                            placeholder="1. Copy text from the agent on the left...&#10;2. Paste it here!"
                            value={generatedContent}
                            onChange={(e) => setGeneratedContent(e.target.value)}
                            style={{ minHeight: '150px', maxHeight: '300px', width: '100%', boxSizing: 'border-box' }}
                        />
                        <div className="footer-actions" style={{ marginTop: '16px', justifyContent: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                            <button 
                                className="cta-button" 
                                style={{padding: '8px 16px'}}
                                onClick={() => setIsShareModalOpen(true)}
                                disabled={!generatedContent.trim()}
                            >
                                Share Content
                            </button>
                            <button
                                className="details-link"
                                onClick={handleSaveContentToDrive}
                                disabled={isSavingToDrive || session?.user?.provider !== 'google' || !generatedContent.trim()}
                                title={session?.user?.provider !== 'google' ? "Sign in with Google to use this feature" : "Save content to Google Drive"}
                            >
                                {isSavingToDrive ? 'Saving...' : 'Save Content to Drive'}
                            </button>
                            {/* REMOVED: The "Get Share Link" button is now gone. */}
                        </div>
                    </div>
                    
                    <div className="scratchpad-header">
                        <div className="header-text">
                            <h3>Personal Scratchpad</h3>
                            <p>Your private, auto-saving notes for <strong>{bot.name}</strong></p>
                        </div>
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
    if (!bot) return { notFound: true };
    return { props: { bot } };
}