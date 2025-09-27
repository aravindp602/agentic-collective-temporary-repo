// src/pages/dashboard.js

import { useSession } from "next-auth/react";
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from "next/head";
import Layout from "../components/Layout";
import Link from "next/link";
import { chatbotData } from '../data/bots';
import { motion } from 'framer-motion';
import ProfileSection from '../components/ProfileSection';
import UsageStats from '../components/UsageStats';
import AccountManagement from '../components/AccountManagement';
import toast from 'react-hot-toast'; // Import toast

export default function DashboardPage() {
    const { data: session, status } = useSession(); 
    const router = useRouter();
    const [favoriteBots, setFavoriteBots] = useState([]);
    
    // --- NEW STATE FOR THE NOTES WORKSPACE ---
    const [activeBotId, setActiveBotId] = useState(null);
    const [notes, setNotes] = useState({});
    const [currentNoteContent, setCurrentNoteContent] = useState('');
    const [isLoadingNote, setIsLoadingNote] = useState(false);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push('/login');
        }
    }, [session, status, router]);

    useEffect(() => {
        const favoriteIds = JSON.parse(localStorage.getItem('favoriteBots')) || [];
        const userFavorites = chatbotData.filter(bot => favoriteIds.includes(bot.id.toString()));
        setFavoriteBots(userFavorites);
    }, []);

    // --- FUNCTION TO HANDLE CLICKING AN AGENT ---
    const handleBotClick = async (botId) => {
        if (activeBotId === botId) {
            // If clicking the same bot, close it
            setActiveBotId(null);
            return;
        }
        
        setActiveBotId(botId);
        setIsLoadingNote(true);

        // Check if we already fetched the note
        if (notes[botId]) {
            setCurrentNoteContent(notes[botId].content);
            setIsLoadingNote(false);
            return;
        }

        // Fetch the note from the API
        try {
            const response = await fetch(`/api/notes/${botId}`);
            if (response.ok) {
                const note = await response.json();
                const content = note ? note.content : '';
                setNotes(prev => ({ ...prev, [botId]: { content } }));
                setCurrentNoteContent(content);
            }
        } catch (error) {
            toast.error("Failed to load note.");
        } finally {
            setIsLoadingNote(false);
        }
    };

    // --- FUNCTION TO SAVE THE NOTE ---
    const handleSaveNote = async () => {
        const toastId = toast.loading('Saving note...');
        try {
            const response = await fetch(`/api/notes/${activeBotId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: currentNoteContent }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            
            // Update local state to match saved data
            setNotes(prev => ({ ...prev, [activeBotId]: { content: data.note.content } }));
            toast.success('Note saved!', { id: toastId });
        } catch (error) {
            toast.error(error.message || 'Failed to save note.', { id: toastId });
        }
    };

    if (status === "loading" || !session) { /* ... loading spinner ... */ }
  
    return (
        <Layout>
            <Head><title>Your Dashboard | Agentic Collective</title></Head>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                <div className="container">
                    <ProfileSection />
                    <div className="dashboard-grid-layout">
                        <div className="dashboard-main-column">
                            <section className="dashboard-section">
                                <h2>Favorite Agents Workspace</h2>
                                <div className="favorite-agents-list">
                                    {favoriteBots.length > 0 ? (
                                        favoriteBots.map(bot => {
                                            const isActive = activeBotId === bot.id;
                                            const launchUrl = bot.embedType === 'iframe' ? `/embed/${bot.id}` : `/chat/${bot.id}`;
                                            return (
                                                <div key={bot.id} className={`favorite-agent-item ${isActive ? 'active' : ''}`}>
                                                    <button className="favorite-agent-header" onClick={() => handleBotClick(bot.id)}>
                                                        <div className="card-icon-wrapper small-icon"><img src={bot.icon} alt="" className="card-icon" /></div>
                                                        <div className="favorite-agent-details">
                                                            <h3>{bot.name}</h3>
                                                            <p>{bot.description}</p>
                                                        </div>
                                                        <span className="expand-arrow">{isActive ? '▲' : '▼'}</span>
                                                    </button>
                                                    {isActive && (
                                                        <div className="favorite-agent-workspace">
                                                            {isLoadingNote ? <div className="loader"></div> : (
                                                                <>
                                                                    <h4>Personal Notes</h4>
                                                                    <textarea
                                                                        placeholder={`Jot down your best prompts, results, or ideas for ${bot.name}...`}
                                                                        value={currentNoteContent}
                                                                        onChange={(e) => setCurrentNoteContent(e.target.value)}
                                                                    />
                                                                    <div className="workspace-actions">
                                                                        <button className="cta-button" onClick={handleSaveNote}>Save Note</button>
                                                                        <Link href={launchUrl} className="launch-link" target="_blank">Launch Agent &rarr;</Link>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="placeholder-text">Your favorite agents will appear here.</div>
                                    )}
                                </div>
                            </section>
                        </div>
                        <div className="dashboard-side-column">
                            <UsageStats favoriteCount={favoriteBots.length} />
                            <AccountManagement />
                        </div>
                    </div>
                </div>
            </motion.div>
        </Layout>
    );
}