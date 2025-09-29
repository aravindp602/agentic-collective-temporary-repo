// src/pages/agent/[botId].js

import Head from 'next/head';
import Layout from '../../components/Layout';
import { chatbotData } from '../../data/bots';
import { motion } from 'framer-motion';
import Link from 'next/link';

// This is the main component for the agent page
export default function AgentPage({ bot }) {
    // A fallback for safety, though Next.js should handle this with notFound: true
    if (!bot) {
        return (
            <Layout>
                <div className="container agent-page-container">
                    <h1>Agent Not Found</h1>
                    <p>The agent you are looking for does not exist.</p>
                    <Link href="/">← Back to Explore</Link>
                </div>
            </Layout>
        );
    }

    const launchUrl = bot.embedType === 'iframe' ? `/embed/${bot.id}` : `/chat/${bot.id}`;

    return (
        <Layout>
            <Head>
                <title>{bot.name} | Agentic Collective</title>
                <meta name="description" content={bot.description} />
                <meta property="og:title" content={`${bot.name} | Agentic Collective`} />
                <meta property="og:description" content={bot.description} />
                <meta property="og:type" content="website" />
            </Head>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
            >
                <div className="agent-page-container container">
                    <header className="agent-page-header">
                        <div className="card-icon-wrapper large-icon">
                            <img src={bot.icon} alt={`${bot.name} icon`} className="card-icon" />
                        </div>
                        <div className="agent-header-content">
                            <h1>{bot.name}</h1>
                            <span className="agent-category-tag">{bot.category}</span>
                        </div>
                    </header>

                    <div className="agent-page-body">
                        <div className="agent-main-content">
                            <div className="content-section">
                                <h2>Description</h2>
                                <p>{bot.description}</p>
                            </div>
                            <div className="content-section">
                                <h3>Use Cases</h3>
                                <div className="use-case-tags">
                                    {bot.useCaseTags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                                </div>
                            </div>
                        </div>

                        <aside className="agent-sidebar">
                            <div className="sidebar-card">
                                {/* --- THE NEW AGENT LAB BUTTON --- */}
                                <Link href={`/lab/${bot.id}`} className="cta-button lab-button">
                                    Open in Agent Lab
                                </Link>
                                
                                <Link href={launchUrl} className="cta-button launch-agent-button" target="_blank">
                                    Launch Fullscreen
                                </Link>
                                
                                <div className="detail-item">
                                    <h4>Complexity</h4>
                                    <div className="complexity-meter">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className={`bar ${i < bot.complexity ? 'filled' : ''}`}></span>
                                        ))}
                                    </div>
                                </div>
                                
                                {bot.relatedAgents && bot.relatedAgents.length > 0 && (
                                    <div className="detail-item">
                                        <h4>Related Agents</h4>
                                        <div className="related-agents-list">
                                            {bot.relatedAgents.map(relatedId => {
                                                const relatedBot = chatbotData.find(b => b.id === relatedId);
                                                if (!relatedBot) return null;
                                                return <Link key={relatedId} href={`/agent/${relatedId}`} className="related-agent">{relatedBot.name}</Link>;
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </aside>
                    </div>
                </div>
            </motion.div>
        </Layout>
    );
}

// Fetches the data for a specific agent on the server before rendering the page
export async function getServerSideProps(context) {
    const { botId } = context.params;
    const bot = chatbotData.find(b => b.id === botId) || null;

    if (!bot) {
        return { notFound: true };
    }

    return { props: { bot } };
}