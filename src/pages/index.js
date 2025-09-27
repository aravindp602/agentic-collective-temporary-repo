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
import { TypeAnimation } from 'react-type-animation'; // <-- IMPORT DYNAMIC HERO

// A reusable component for the favorite button
const FavoriteButton = ({ isFavorite, onClick }) => {
  const magneticRef = useMagneticEffect();
  return (
    <button ref={magneticRef} className={`favorite-btn ${isFavorite ? 'is-favorite' : ''}`} onClick={onClick} aria-label="Favorite this agent">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
    </button>
  );
};

// --- UPDATED: CUSTOM SHAPED SKELETON CARD ---
const SkeletonCard = () => (
    <div className="chatbot-card is-loading">
        <div className="card-content">
            <div className="card-header">
                <div className="skeleton skeleton-icon"></div>
                <div className="skeleton-header-text">
                    <div className="skeleton skeleton-title"></div>
                </div>
            </div>
            <div className="skeleton skeleton-text"></div>
            <div className="skeleton skeleton-text skeleton-text-short"></div>
            <div className="card-footer">
                <div className="skeleton skeleton-button"></div>
                <div className="skeleton skeleton-button"></div>
            </div>
        </div>
    </div>
);

export default function HomePage() {
    const [filteredBots, setFilteredBots] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [filterKey, setFilterKey] = useState('*');
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [selectedId, setSelectedId] = useState(null);
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
            return () => { cards.forEach((card) => { if (card.vanillaTilt) card.vanillaTilt.destroy(); }); };
        }
    }, [isLoading, filteredBots]);
    
    useEffect(() => {
        if (!isLoading) {
            const lowerSearchTerm = searchTerm.toLowerCase();
            setFilteredBots(chatbotData.filter(bot =>
                (filterKey === '*' || bot.category === filterKey) &&
                (bot.name.toLowerCase().includes(lowerSearchTerm) || bot.description.toLowerCase().includes(lowerSearchTerm))
            ));
        }
    }, [filterKey, searchTerm, isLoading]);

    const handleFilterKeyChange = (key) => () => setFilterKey(key);
    const handleSearchChange = (e) => setSearchTerm(e.target.value);
    const toggleFavorite = (botId, event) => {
        event.stopPropagation();
        const botIdStr = botId.toString();
        const isCurrentlyFavorite = favorites.includes(botIdStr);
        const updatedFavorites = isCurrentlyFavorite
            ? favorites.filter(id => id !== botIdStr)
            : [...favorites, botIdStr];
        setFavorites(updatedFavorites);
        localStorage.setItem('favoriteBots', JSON.stringify(updatedFavorites));
        toast(isCurrentlyFavorite ? 'Removed from Favorites' : 'Added to Favorites!');
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
                            {/* --- UPDATED: DYNAMIC HERO SUBTITLE --- */}
                            <TypeAnimation
                                sequence={[
                                    'Build your next Social Media Strategy.', 2000,
                                    'Generate the perfect Business Name.', 2000,
                                    'Craft a compelling Brand Statement.', 2000,
                                    'Brainstorm breakthrough Campaign Ideas.', 2000,
                                ]}
                                wrapper="p"
                                speed={50}
                                className="hero-subtitle"
                                repeat={Infinity}
                                cursor={true}
                            />
                            <Link href="#gallery" className="cta-button">Explore the Agents</Link>
                        </div>
                        {/* ... marquee showcase remains the same ... */}
                    </div>
                </section>

                <div className="section-flare"></div>
                <motion.div {...sectionAnimation}><section className="trust-bar-section">{/* ... */}</section></motion.div>
                <motion.div {...sectionAnimation}><FeaturedAgent /></motion.div>

                <motion.div {...sectionAnimation}>
                    <section id="gallery" className="chatbot-gallery-section">
                        <div className="container">
                            <div className="search-and-filters fade-in-on-scroll is-visible">{/* ... */}</div>
                            <div className="chatbot-grid" ref={gridRef}>
                                {isLoading ? Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />) : filteredBots.map((bot) => (
                                    <motion.div key={bot.id} className="chatbot-card" data-tilt layoutId={`card-container-${bot.id}`} onClick={() => openFocusView(bot)}>
                                        {bot.isNew && <span className="card-badge new">New</span>}
                                        {bot.popularity > 95 && <span className="card-badge popular">Popular</span>}
                                        <FavoriteButton isFavorite={favorites.includes(bot.id.toString())} onClick={(e) => toggleFavorite(bot.id, e)} />
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
                                ))}
                            </div>
                        </div>
                    </section>
                </motion.div>
                
                <div className="section-flare"></div>
                <motion.div {...sectionAnimation}><section className="final-cta-section">{/* ... */}</section></motion.div>

                <AnimatePresence>
                    {selectedId && selectedBot && (
                        <motion.div className="focus-view-backdrop" onClick={closeFocusView} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <motion.div className="focus-view-content" layoutId={`card-container-${selectedId}`} onClick={(e) => e.stopPropagation()}>
                                <motion.div className="card-content">
                                    <div className="card-header">
                                        <div className="card-icon-wrapper"><img src={selectedBot.icon} alt={`${selectedBot.name} icon`} className="card-icon" /></div>
                                        <h3>{selectedBot.name}</h3>
                                    </div>
                                    <p className="card-description" style={{ flexGrow: 0, marginBottom: '24px' }}>{selectedBot.description}</p>
                                    
                                    {/* --- UPDATED: ENHANCED FOCUS VIEW DETAILS --- */}
                                    <div className="focus-view-details">
                                        <div className="detail-item">
                                            <h4>Use Cases</h4>
                                            <div className="use-case-tags">
                                                {selectedBot.useCaseTags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                                            </div>
                                        </div>
                                        <div className="detail-item">
                                            <h4>Complexity</h4>
                                            <div className="complexity-meter">
                                                {[...Array(5)].map((_, i) => (
                                                    <span key={i} className={`bar ${i < selectedBot.complexity ? 'filled' : ''}`}></span>
                                                ))}
                                            </div>
                                        </div>
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