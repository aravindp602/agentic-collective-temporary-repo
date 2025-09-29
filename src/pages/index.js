// src/pages/index.js

import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { chatbotData, categoriesWithIcons } from '../data/bots';
import Layout from '../components/Layout';
import FeaturedAgent from '../components/FeaturedAgent';
import toast from 'react-hot-toast';
import VanillaTilt from 'vanilla-tilt';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import useMagneticEffect from '../hooks/useMagneticEffect';
import { TypeAnimation } from 'react-type-animation';

// A reusable component for the favorite button
const FavoriteButton = ({ isFavorite, onClick }) => {
  const magneticRef = useMagneticEffect();
  return (
    <button ref={magneticRef} className={`favorite-btn ${isFavorite ? 'is-favorite' : ''}`} onClick={onClick} aria-label="Favorite this agent">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
    </button>
  );
};

// A component for the shaped skeleton loading card
const SkeletonCard = () => (
    <div className="chatbot-card is-loading">
        <div className="card-content">
            <div className="card-header">
                <div className="skeleton skeleton-icon"></div>
                <div className="skeleton-header-text"><div className="skeleton skeleton-title"></div></div>
            </div>
            <div className="skeleton skeleton-text"></div>
            <div className="skeleton skeleton-text skeleton-text-short"></div>
            <div className="card-footer"><div className="skeleton skeleton-button"></div><div className="skeleton skeleton-button"></div></div>
        </div>
    </div>
);

export default function HomePage() {
    const [filteredBots, setFilteredBots] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [filterKey, setFilterKey] = useState('*');
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const gridRef = useRef(null);

    useEffect(() => {
        setFilteredBots(chatbotData);
        setTimeout(() => {
            const savedFavorites = JSON.parse(localStorage.getItem('favoriteBots')) || [];
            setFavorites(savedFavorites);
            setIsLoading(false);
        }, 500);
    }, []);

    useEffect(() => {
        if (isLoading) return;
        let newFilteredBots = chatbotData;
        if (filterKey !== '*') {
            newFilteredBots = newFilteredBots.filter(bot => bot.category === filterKey);
        }
        if (searchTerm) {
            const lowerSearchTerm = searchTerm.toLowerCase();
            newFilteredBots = newFilteredBots.filter(bot =>
                bot.name.toLowerCase().includes(lowerSearchTerm) || bot.description.toLowerCase().includes(lowerSearchTerm)
            );
        }
        setFilteredBots(newFilteredBots);
    }, [filterKey, searchTerm, isLoading]);

    useEffect(() => {
        if (!isLoading && gridRef.current) {
            const cards = gridRef.current.querySelectorAll('.chatbot-card');
            VanillaTilt.init(cards, { max: 5, speed: 400, glare: true, "max-glare": 0.2 });
            return () => { cards.forEach((card) => { if (card.vanillaTilt) card.vanillaTilt.destroy(); }); };
        }
    }, [isLoading, filteredBots]);

    const handleFilterKeyChange = (key) => () => setFilterKey(key);
    const handleSearchChange = (e) => setSearchTerm(e.target.value);
    const toggleFavorite = (botId, event) => {
        event.preventDefault();
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
    
    const getCategoryCount = (categoryName) => {
        if (categoryName === '*') return chatbotData.length;
        return chatbotData.filter(bot => bot.category === categoryName).length;
    };

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
                <meta name="description" content="Explore a collection of specialized AI agents, each designed for a unique purpose." />
            </Head>
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                <section className="hero-section">
                    <div className="container hero-layout">
                        <div className="hero-content">
                            <h1 className="hero-title">Your On-Demand AI Workforce</h1>
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
                        <div className="hero-showcase">
                            <div className="marquee">
                                <div className="marquee-content">
                                    <div className="showcase-card"><span>Creative Writer</span></div>
                                    <div className="showcase-card"><span>Code Refactor</span></div>
                                    <div className="showcase-card"><span>Market Analysis</span></div>
                                    <div className="showcase-card"><span>Travel Planner</span></div>
                                </div>
                                <div className="marquee-content">
                                    <div className="showcase-card"><span>Creative Writer</span></div>
                                    <div className="showcase-card"><span>Code Refactor</span></div>
                                    <div className="showcase-card"><span>Market Analysis</span></div>
                                    <div className="showcase-card"><span>Travel Planner</span></div>
                                </div>
                            </div>
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
                                <div className="search-bar-wrapper">
                                    <input type="text" className="search-input" placeholder="Search for an agent by name or function..." value={searchTerm} onChange={handleSearchChange}/>
                                </div>
                                <div className="category-filters-enhanced">
                                    <button onClick={handleFilterKeyChange('*')} className={`filter-btn-enhanced ${filterKey === '*' ? 'active' : ''}`}>
                                        <span className="agent-count">{getCategoryCount('*')}</span>
                                        All
                                    </button>
                                    {categoriesWithIcons.map(category => (
                                        <button key={category.name} onClick={handleFilterKeyChange(category.name)} className={`filter-btn-enhanced ${filterKey === category.name ? 'active' : ''}`}>
                                            <span dangerouslySetInnerHTML={{ __html: category.icon }} className="filter-icon" />
                                            {category.name}
                                            <span className="agent-count">{getCategoryCount(category.name)}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <LayoutGroup>
                                <motion.div layout className="chatbot-grid" ref={gridRef}>
                                    <AnimatePresence>
                                        {isLoading ? Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />) : filteredBots.map((bot) => {
                                            const isFavorite = favorites.includes(bot.id.toString());
                                            return (
                                                <motion.div
                                                    layout
                                                    key={bot.id}
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                >
                                                    <Link href={`/agent/${bot.id}`} className="agent-card-link">
                                                        <div className="chatbot-card" data-tilt>
                                                            {bot.isNew && <span className="card-badge new">New</span>}
                                                            {bot.popularity > 95 && <span className="card-badge popular">Popular</span>}
                                                            <FavoriteButton isFavorite={isFavorite} onClick={(e) => toggleFavorite(bot.id, e)} />
                                                            <div className="card-content">
                                                                <div className="card-header">
                                                                    <div className="card-icon-wrapper"><img src={bot.icon} alt={`${bot.name} icon`} className="card-icon" /></div>
                                                                    <h3>{bot.name}</h3>
                                                                </div>
                                                                <p className="card-description">{bot.description}</p>
                                                                <div className="card-footer">
                                                                    <span className="details-link">View Details</span>
                                                                    <span className="launch-link">Launch &rarr;</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </motion.div>
                                            );
                                        })}
                                    </AnimatePresence>
                                </motion.div>
                            </LayoutGroup>
                        </div>
                    </section>
                </motion.div>
                
                <div className="section-flare"></div>
                
                <motion.div {...sectionAnimation}>
                    <section className="final-cta-section">
                        <div className="container">
                            <h2>Ready to Start?</h2>
                            <p>Dive in and explore the future of AI-powered assistance. Your personal dashboard is just one click away.</p>
                            <Link href="/dashboard" className="cta-button">Go to Your Dashboard</Link>
                        </div>
                    </section>
                </motion.div>

                {/* The Contact Section has been removed from this page and is now globally managed by Layout.js */}

            </motion.div>
        </Layout>
    );
}