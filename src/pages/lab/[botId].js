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

const SimpleMdeEditor = dynamic(() => import("react-simplemde-editor"), { ssr: false });
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
    const [showTooltip, setShowTooltip] = useState(false);
    const { data: session, status } = useSession();
    
    // NEW state for Google Drive feature
    const [isSavingToDrive, setIsSavingToDrive] = useState(false);

    const debouncedNoteContent = useDebounce(noteContent, 2000);
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (!localStorage.getItem('hasSeenLabTooltip')) {
            setShowTooltip(true);
        }
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
    
    const handleSaveNote = useCallback(async (contentToSave) => {
        if (!isDirty) return;
        setIsSaving(true);
        try {
            const response = await fetch(`/api/notes/${bot.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: contentToSave }),
            });
            if (!response.ok) throw new Error('Failed to save.');
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
    
    const dismissTooltip = () => {
        setShowTooltip(false);
        localStorage.setItem('hasSeenLabTooltip', 'true');
    };

    // NEW handler function for saving to Google Drive
    const handleSaveToDrive = async () => {
        if (!noteContent.trim()) {
            toast.error("Your note is empty!");
            return;
        }

        setIsSavingToDrive(true);
        const toastId = toast.loading('Saving to Google Drive...');

        try {
            const response = await fetch('/api/actions/save-to-drive', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ noteContent, botName: bot.name }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            toast.success(
                (t) => (
                    <span style={{ textAlign: 'center' }}>
                        Note saved!
                        <a href={data.driveLink} target="_blank" rel="noopener noreferrer" 
                           style={{ color: '#cf3222', textDecoration: 'underline', marginLeft: '8px' }}>
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

    const getSaveStatus = () => {
        if (isSaving) return <><span className="save-spinner"></span>Saving...</>;
        if (isDirty) return 'Unsaved changes';
        return <span className="saved-checkmark">✓ All changes saved</span>;
    };

    const editorOptions = useMemo(() => ({
        autofocus: true,
        spellChecker: false,
        toolbar: ["bold", "italic", "strikethrough", "|", "code", "quote", "unordered-list", "ordered-list", "|", "preview"],
        status: false,
    }), []);

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
                        <div className="zen-mode-wrapper">
                            <button className="zen-mode-toggle" onClick={() => setIsZenMode(!isZenMode)} title="Toggle Focus Mode">
                                {isZenMode ? 'Exit Focus' : 'Focus Mode'}
                            </button>
                            {showTooltip && (
                                <div className="onboarding-tooltip">
                                    <button onClick={dismissTooltip} className="tooltip-close">×</button>
                                    Click here for a distraction-free writing experience!
                                </div>
                            )}
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
                        {/* START OF MODIFICATION */}
                        <div className="footer-actions">
                             <button 
                                className="details-link" 
                                onClick={handleSaveToDrive} 
                                disabled={isSavingToDrive || session?.user?.provider !== 'google'}
                                title={session?.user?.provider !== 'google' ? "Sign in with Google to use this feature" : "Save notes to Google Drive"}
                            >
                                {isSavingToDrive ? 'Saving...' : 'Save to Drive'}
                            </button>
                            <Link href="/dashboard" className="details-link">Exit Lab</Link>
                        </div>
                        {/* END OF MODIFICATION */}
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