// src/pages/agent/[botId].js
import Head from 'next/head';
import Layout from '../../components/Layout';
import { chatbotData } from '../../data/bots';
import { motion } from 'framer-motion';
import Link from 'next/link';
import AgentIcon from '../../components/AgentIcon';
import { useRouter } from 'next/router'; // Import useRouter
import SocialShareButtons from '../../components/SocialShareButtons'; // Import our new component

export default function AgentPage({ bot }) {
    const router = useRouter(); // Initialize router

    if (!bot) {
        return (
            <Layout>
                <div className="agent-page-container container">
                    <h1>Agent Not Found</h1>
                    <p>The agent you are looking for does not exist or may have been moved.</p>
                    <Link href="/">← Back to Explore</Link>
                </div>
            </Layout>
        );
    }

    // Construct the full URL to be shared
    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}${router.asPath}`;
    const shareTitle = `Check out the "${bot.name}" agent on Digital Lesson!`;
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <motion.div className="agent-page-container container" layoutId={`card-container-${bot.id}`}>
                    <header className="agent-page-header">
                        <motion.div className="card-icon-wrapper large-icon" layoutId={`card-icon-${bot.id}`}>
                            <AgentIcon category={bot.category} />
                        </motion.div>
                        <div className="agent-header-content">
                            <motion.h1 layoutId={`card-title-${bot.id}`}>{bot.name}</motion.h1>
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
                                <Link href={`/lab/${bot.id}`} className="cta-button lab-button">Open in Agent Lab</Link>
                                <Link href={launchUrl} className="cta-button fullscreen-button" target="_blank">Launch Fullscreen</Link>
                                
                                {/* START OF MODIFICATION */}
                                <div className="detail-item" style={{ marginTop: '24px' }}>
                                    <h4>Share this Agent</h4>
                                    <SocialShareButtons 
                                        shareUrl={shareUrl}
                                        title={shareTitle}
                                    />
                                </div>
                                {/* END OF MODIFICATION */}

                                <div className="detail-item">
                                    <h4>Complexity</h4>
                                    <div className="complexity-meter">{[...Array(5)].map((_, i) => (<span key={i} className={`bar ${i < bot.complexity ? 'filled' : ''}`}></span>))}</div>
                                </div>
                                {bot.relatedAgents && bot.relatedAgents.length > 0 && (
                                    <div className="detail-item">
                                        <h4>Related Agents</h4>
                                        <div className="related-agents-list">{bot.relatedAgents.map(relatedId => { const relatedBot = chatbotData.find(b => b.id === relatedId); if (!relatedBot) return null; return <Link key={relatedId} href={`/agent/${relatedId}`} className="related-agent">{relatedBot.name}</Link>; })}</div>
                                    </div>
                                )}
                            </div>
                        </aside>
                    </div>
                </motion.div>
            </motion.div>
        </Layout>
    );
}

export async function getServerSideProps(context) {
    const { botId } = context.params;
    const bot = chatbotData.find(b => b.id === botId) || null;
    if (!bot) return { notFound: true };
    return { props: { bot } };
}