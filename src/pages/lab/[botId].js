// src/pages/lab/[botId].js

import Head from 'next/head';
import { useRouter } from 'next/router';
import { chatbotData } from '../../data/bots';
import { useSession, signIn } from 'next-auth/react';
import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import useDebounce from '../../hooks/useDebounce';
import dynamic from 'next/dynamic';
import LabLayout from '../../components/LabLayout';
import SocialShareModal from '../../components/SocialShareModal';
import PptEditor from '../../components/PptEditor';

const SimpleMdeEditor = dynamic(() => import("react-simplemde-editor"), { ssr: false });
import "easymde/dist/easymde.min.css";

// --- NEW: SVG Icons for our tabs ---
const CaptureIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"/><path d="M12 18H12.01"/><path d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"/>
    </svg>
);
const NotesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
);


export default function AgentLabPage() {
    // --- States (Unchanged) ---
    const router = useRouter();
    const { botId } = router.query;
    const [bot, setBot] = useState(null);
    const [activeTab, setActiveTab] = useState('capture');
    const [noteContent, setNoteContent] = useState('');
    const [generatedContent, setGeneratedContent] = useState('');
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isPptEditorOpen, setIsPptEditorOpen] = useState(false);
    const [isPptxReady, setIsPptxReady] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [isSavingToDrive, setIsSavingToDrive] = useState(false);
    const { data: session, status } = useSession();
    const debouncedNoteContent = useDebounce(noteContent, 2000);
    const isInitialMount = useRef(true);

    // --- Data Fetching and Initialization (Unchanged) ---
    useEffect(() => { if (botId) setBot(chatbotData.find(b => b.id === botId)); }, [botId]);
    useEffect(() => { if (status !== "loading" && !session) signIn(undefined, { callbackUrl: router.asPath }); }, [session, status, router]);
    useEffect(() => { if (session && bot) { fetch(`/api/notes/${bot.id}`).then(res => res.json()).then(note => { if (note) setNoteContent(note.content); isInitialMount.current = true; }).catch(err => toast.error("Could not load your notes.")).finally(() => setIsLoading(false)); } }, [session, bot]);
    useEffect(() => { const checkPptxGen = setInterval(() => { if (typeof window.PptxGenJS !== 'undefined') { setIsPptxReady(true); clearInterval(checkPptxGen); } }, 200); return () => clearInterval(checkPptxGen); }, []);

    // --- Handlers (Unchanged) ---
    const handleSaveNote = useCallback(async (contentToSave) => { if (!isDirty) return; setIsSaving(true); try { const response = await fetch(`/api/notes/${bot.id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: contentToSave }) }); if (!response.ok) throw new Error('Failed to save notes.'); setIsDirty(false); } catch (error) { toast.error(error.message); } finally { setIsSaving(false); } }, [bot, isDirty]);
    useEffect(() => { if (isInitialMount.current) { isInitialMount.current = false; return; } handleSaveNote(debouncedNoteContent); }, [debouncedNoteContent, handleSaveNote]);
    const onNoteChange = useCallback((value) => { setNoteContent(value); setIsDirty(true); }, []);
    const handleSaveContentToDrive = async () => { if (!generatedContent.trim()) { toast.error("Paste content from the chatbot first!"); return; } setIsSavingToDrive(true); const toastId = toast.loading('Saving content to Google Drive...'); try { const response = await fetch('/api/actions/save-to-drive', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ noteContent: generatedContent, botName: bot.name }) }); const data = await response.json(); if (!response.ok) throw new Error(data.message); toast.success(() => (<span>Content saved!{' '}<a href={data.driveLink} target="_blank" rel="noopener noreferrer" style={{color: '#cf3222', textDecoration: 'underline'}}>Open in Drive</a></span>), { id: toastId, duration: 8000 }); } catch (error) { toast.error(error.message || 'Failed to save.', { id: toastId }); } finally { setIsSavingToDrive(false); } };
    
    // --- UI Helpers (Unchanged) ---
    const getSaveStatus = () => { if (isSaving) return <><span className="save-spinner"></span>Saving...</>; if (isDirty) return 'Unsaved changes'; return <span className="saved-checkmark">✓ All notes saved</span>; };
    const editorOptions = useMemo(() => ({ autofocus: false, spellChecker: false, toolbar: ["bold", "italic", "|", "quote", "unordered-list", "ordered-list"], status: false }), []);

    if (status === "loading" || !bot) { return <div className="full-page-message-wrapper">Loading Lab...</div>; }

    // --- RENDER ---
    return (
        <LabLayout>
            <Head>
                <title>{bot.name} Lab | Digital Lesson</title>
                <meta name="robots" content="noindex" />
            </Head>

            {isShareModalOpen && <SocialShareModal content={generatedContent} botName={bot.name} onClose={() => setIsShareModalOpen(false)} />}
            {isPptEditorOpen && <PptEditor generatedContent={generatedContent} botName={bot.name} PptxGenJS={window.PptxGenJS} onClose={() => setIsPptEditorOpen(false)} />}

            <div className="agent-lab-layout">
                <div className="lab-iframe-panel">
                    <iframe src={bot.embedUrl} title={bot.name} className="lab-iframe" allow="clipboard-read; clipboard-write; microphone"></iframe>
                </div>
                
                <div className="lab-sidebar">
                    <div className="lab-logo-header">
                        <Link href="/dashboard" className="logo">
                            <Image src="/logo.svg" alt="Digital Lesson Logo" width={30} height={30} />
                            <span>Digital Lesson</span>
                        </Link>
                    </div>

                    <div className="lab-sidebar-header">
                        <h3>{bot.name}</h3>
                        <p>Workspace</p>
                    </div>

                    <div className="lab-tabs">
                        <button className={`tab-btn ${activeTab === 'capture' ? 'active' : ''}`} onClick={() => setActiveTab('capture')}>
                            <CaptureIcon />
                            <span>Capture & Export</span>
                        </button>
                        <button className={`tab-btn ${activeTab === 'notes' ? 'active' : ''}`} onClick={() => setActiveTab('notes')}>
                            <NotesIcon />
                            <span>Personal Notes</span>
                        </button>
                    </div>

                    {activeTab === 'capture' && (
                        <div className="lab-tab-content">
                            <div className="form-field">
                                <label>Generated Content</label>
                                <textarea
                                    className="favorite-agent-workspace textarea"
                                    placeholder="Paste your generated content here. Use '---' between paragraphs to auto-create slides in the presentation editor..."
                                    value={generatedContent}
                                    onChange={(e) => setGeneratedContent(e.target.value)}
                                />
                            </div>
                            <div className="footer-actions" style={{ justifyContent: 'flex-start', flexWrap: 'wrap', gap: '8px', marginTop: 'auto' }}>
                                <button className="cta-button" style={{padding: '8px 16px'}} onClick={() => setIsShareModalOpen(true)} disabled={!generatedContent.trim()}>Share Content</button>
                                <button className="details-link" onClick={handleSaveContentToDrive} disabled={isSavingToDrive || session?.user?.provider !== 'google' || !generatedContent.trim()} title={session?.user?.provider !== 'google' ? "Sign in with Google" : "Save to Google Drive"}>{isSavingToDrive ? 'Saving...' : 'Save to Drive'}</button>
                                <button className="details-link" onClick={() => setIsPptEditorOpen(true)} disabled={!isPptxReady || !generatedContent.trim()} title={!isPptxReady ? "Generator loading..." : "Create Presentation"}>Create Presentation</button>
                            </div>
                        </div>
                    )}
                    
                    {activeTab === 'notes' && (
                        <div className="lab-tab-content">
                            <SimpleMdeEditor value={noteContent} onChange={onNoteChange} options={editorOptions} />
                        </div>
                    )}
                    
                    <div className="lab-sidebar-footer">
                        <div className={`save-status ${!isDirty && !isSaving ? 'saved' : ''}`}>
                            {activeTab === 'notes' ? getSaveStatus() : <span>Ready to export.</span>}
                        </div>
                        <Link href="/dashboard" className="details-link">Exit Lab</Link>
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