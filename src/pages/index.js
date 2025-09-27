// src/pages/index.js

import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { chatbotData, categories } from '../data/bots';
import Layout from '../components/Layout';
import FeaturedAgent from '../components/FeaturedAgent';
import toast from 'react-hot-toast';
import VanillaTilt from 'vanilla-tilt';
import { motion, AnimatePresence } from 'framer-motion';
import useMagneticEffect from '../hooks/useMagneticEffect';

// A reusable component for the favorite button with the new star icon
const FavoriteButton = ({ isFavorite, onClick }) => {
  const magneticRef = useMagneticEffect();
  return (
    <button
      ref={magneticRef}
      className={`favorite-btn ${isFavorite ? 'is-favorite' : ''}`}
      onClick={onClick}
      aria-label="Favorite this agent"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
    </button>
  );
};

// A component for the skeleton loading card
const SkeletonCard = () => (
    <div className="chatbot-card is-loading">
        <div className="card-content">
            <div className="card-header"><div className="card-icon-wrapper skeleton"></div><div className="skeleton skeleton-title"></div></div>
            <div className="skeleton skeleton-text"></div><div className="skeleton skeleton-text skeleton-text-short"></div><div className="skeleton skeleton-footer"></div>
        </div>
    </div>
);

export default function HomePage() {
    const [filteredBots, setFilteredBots] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [filterKey, setFilterKey] = useState('*');
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [selectedId, setSelectedId] = useState(null); // State for the focus view
    const gridRef = useRef(null);

    useEffect(() => {
        setTimeout(() => {
            const savedFavorites = JSON.parse(localStorage.getItem('favoriteBots')) || [];
            setFavorites(savedFavorites);
            setFilteredBots(chatbotData);
            setIsLoading(false);
        }, 500);
    }, []);

    useEffect(() => {
        if (!isLoading && gridRef.current) {
            const cards = gridRef.current.querySelectorAll('.chatbot-card');
            VanillaTilt.init(cards, { max: 5, speed: 400, glare: true, "max-glare": 0.2 });
            return () => {
                cards.forEach((card) => {
                    if (card.vanillaTilt) card.vanillaTilt.destroy();
                });
            };
        }
    }, [isLoading, filteredBots]);

    useEffect(() => {
        if (!isLoading) {
            const lowerSearchTerm = searchTerm.toLowerCase();
            const newFilteredBots = chatbotData.filter(bot =>
                (filterKey === '*' || bot.category === filterKey) &&
                (bot.name.toLowerCase().includes(lowerSearchTerm) || bot.description.toLowerCase().includes(lowerSearchTerm))
            );
            setFilteredBots(newFilteredBots);
        }
    }, [filterKey, searchTerm, isLoading]);

    const handleFilterKeyChange = (key) => () => setFilterKey(key);
    const handleSearchChange = (e) => setSearchTerm(e.target.value);
    const toggleFavorite = (botId) => {
        // Stop propagation to prevent the focus view from opening when favoriting
        event.stopPropagation();
        const botIdStr = botId.toString();
        const updatedFavorites = favorites.includes(botIdStr)
            ? favorites.filter(id => id !== botIdStr)
            : [...favorites, botIdStr];
        setFavorites(updatedFavorites);
        localStorage.setItem('favoriteBots', JSON.stringify(updatedFavorites));
        toast(favorites.includes(botIdStr) ? 'Removed from Favorites' : 'Added to Favorites!');
    };

    const openFocusView = (bot) => setSelectedId(bot.id);
    const closeFocusView = () => setSelectedId(null);
    
    const selectedBot = selectedId && chatbotData.find(bot => bot.id === selectedId);
    const launchUrl = selectedBot && (selectedBot.embedType === 'iframe' ? `/embed/${selectedBot.id}` : `/chat/${selectedBot.id}`);

    const sectionAnimation = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.2 },
        transition: { duration: 0.6, ease: "easeOut" }
    };

    return (
        <Layout>
            <Head>
                <title>Agentic Collective | Explore</title>
            </Head>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                <section className="hero-section">
                    <div className="container hero-layout">
                        <div className="hero-content">
                            <h1 className="hero-title">Your On-Demand AI Workforce</h1>
                            <p className="hero-subtitle">Get expert results from specialized AI agents. Your next big idea is just a conversation away.</p>
                            <Link href="#gallery" className="cta-button">Explore the Agents</Link>
                        </div>
                        <div className="hero-showcase">
                            <div className="marquee"><div className="marquee-content"><div className="showcase-card"><span>Creative Writer</span></div><div className="showcase-card"><span>Code Refactor</span></div><div className="showcase-card"><span>Market Analysis</span></div><div className="showcase-card"><span>Travel Planner</span></div></div><div className="marquee-content"><div className="showcase-card"><span>Creative Writer</span></div><div className="showcase-card"><span>Code Refactor</span></div><div className="showcase-card"><span>Market Analysis</span></div><div className="showcase-card"><span>Travel Planner</span></div></div></div>
                        </div>
                    </div>
                </section>

                <div className="section-flare"></div>

                <motion.div {...sectionAnimation}><section className="trust-bar-section"><div className="container"><p>Powering innovation at world-class companies</p><div className="logos-container"><span>Innovate Inc.</span><span>Quantum Leap</span><span>Apex Solutions</span><span>Future Forge</span><span>Stellar Co.</span></div></div></section></motion.div>
                <motion.div {...sectionAnimation}><FeaturedAgent /></motion.div>

                <motion.div {...sectionAnimation}>
                    <section id="gallery" className="chatbot-gallery-section">
                        <div className="container">
                            <div className="search-and-filters fade-in-on-scroll is-visible">
                                <div className="search-bar-wrapper"><input type="text" className="search-input" placeholder="Search for an agent..." value={searchTerm} onChange={handleSearchChange}/></div>
                                <div className="category-filters"><button onClick={handleFilterKeyChange('*')} className={filterKey === '*' ? 'active' : ''}>All</button>{categories.map(category => (<button key={category} onClick={handleFilterKeyChange(category)} className={filterKey === category ? 'active' : ''}>{category}</button>))}</div>
                            </div>
                            <div className="chatbot-grid" ref={gridRef}>
                                {isLoading ? Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />) : filteredBots.map((bot) => {
                                    const isFavorite = favorites.includes(bot.id.toString());
                                    return (
                                        <motion.div 
                                            key={bot.id} 
                                            className="chatbot-card" 
                                            data-tilt
                                            layoutId={`card-container-${bot.id}`}
                                            onClick={() => openFocusView(bot)}
                                        >
                                            {bot.isNew && <span className="card-badge new">New</span>}
                                            {bot.popularity > 95 && <span className="card-badge popular">Popular</span>}
                                            <FavoriteButton isFavorite={isFavorite} onClick={() => toggleFavorite(bot.id)} />
                                            <motion.div className="card-content">
                                                <div className="card-header">
                                                    <div className="card-icon-wrapper"><img src={bot.icon} alt={`${bot.name} icon`} className="card-icon" /></div>
                                                    <h3>{bot.name}</h3>
                                                </div>
                                                <p className="card-description">{bot.description}</p>
                                                <div className="card-footer" onClick={(e) => e.stopPropagation()}>
                                                    <button className="details-link" onClick={() => openFocusView(bot)}>Details</button>
                                                    <Link href={bot.embedType === 'iframe' ? `/embed/${bot.id}` : `/chat/${bot.id}`} className="launch-link">Launch &rarr;</Link>
                                                </div>
                                            </motion.div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                </motion.div>

                <div className="section-flare"></div>

                <motion.div {...sectionAnimation}>
                    <section className="final-cta-section"><div className="container"><h2>Ready to Start?</h2><p>Dive in and explore the future of AI-powered assistance. Your personal dashboard is just one click away.</p><Link href="/dashboard" className="cta-button">Go to Your Dashboard</Link></div></section>
                </motion.div>

                <AnimatePresence>
                    {selectedId && selectedBot && (
                        <motion.div className="focus-view-backdrop" onClick={closeFocusView} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <motion.div className="focus-view-content" layoutId={`card-container-${selectedId}`} onClick={(e) => e.stopPropagation()}>
                                <motion.div className="card-content">
                                    <div className="card-header">
                                        <div className="card-icon-wrapper"><img src={selectedBot.icon} alt={`${selectedBot.name} icon`} className="card-icon" /></div>
                                        <h3>{selectedBot.name}</h3>
                                    </div>
                                    <p className="card-description">{selectedBot.description}</p>
                                    <div className="focus-view-details">
                                        <h4>Example Use Cases:</h4>
                                        <ul>
                                            <li>Brainstorming marketing campaigns</li>
                                            <li>Refining brand messaging</li>
                                            <li>Generating creative ad copy</li>
                                        </ul>
                                    </div>
                                    <div className="card-footer">
                                        <button className="details-link" onClick={closeFocusView}>Close</button>
                                        <Link href={launchUrl} className="launch-link">Launch Agent &rarr;</Link>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </Layout>
    );
}