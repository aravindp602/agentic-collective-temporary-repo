// src/pages/dashboard.js

import { useSession } from "next-auth/react";
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from "next/head";
import Layout from "../components/Layout";
import Link from "next/link";
import { chatbotData } from '../data/bots';
import { motion } from 'framer-motion';
import ProfileSection from '../components/ProfileSection'; // Import the new, simplified component

export default function DashboardPage() {
    const { data: session, status } = useSession(); 
    const router = useRouter();
    const [favoriteBots, setFavoriteBots] = useState([]);

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

    if (status === "loading" || !session) {
        return (
            <div className="full-page-message-wrapper">
                <div className="loading-page">Authenticating...</div>
            </div>
        );
    }
  
    return (
        <Layout>
            <Head>
                <title>Your Dashboard | Agentic Collective</title>
            </Head>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
            >
                <div className="container">
                    {/* Render the self-contained profile component */}
                    <ProfileSection />
                    
                    <section className="dashboard-section">
                        <h2>
                            <svg className="section-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                            Favorite Agents
                        </h2>
                        <div id="favorite-bots-grid" className="chatbot-grid">
                            {favoriteBots.length > 0 ? (
                                favoriteBots.map(bot => {
                                    const launchUrl = bot.embedType === 'iframe' 
                                        ? `/embed/${bot.id}` 
                                        : `/chat/${bot.id}`;
                                    return (
                                        <div key={bot.id} className="chatbot-card">
                                            <div className="card-content">
                                                <div className="card-header">
                                                    <div className="card-icon-wrapper"><img src={bot.icon} alt="" className="card-icon" /></div>
                                                    <h3>{bot.name}</h3>
                                                </div>
                                                <p className="card-description">{bot.description}</p>
                                                <div className="card-footer">
                                                    <span className="category-tag">{bot.category}</span>
                                                    <Link href={launchUrl} className="launch-link">Launch &rarr;</Link>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="placeholder-text full-width-placeholder">
                                    You have not favorited any agents yet.
                                    <Link href="/">Explore agents</Link> to add them.
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </motion.div>
        </Layout>
    );
}