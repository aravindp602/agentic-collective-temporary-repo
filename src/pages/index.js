// src/pages/index.js

import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { chatbotData, categories } from '../data/bots';
import Layout from '../components/Layout';
import FeaturedAgent from '../components/FeaturedAgent';
import toast from 'react-hot-toast';
import VanillaTilt from 'vanilla-tilt';
import { motion } from 'framer-motion';
import useMagneticEffect from '../hooks/useMagneticEffect';
import { TypeAnimation } from 'react-type-animation';

// A reusable component for the favorite button
const FavoriteButton = ({ isFavorite, onClick }) => {
  const magneticRef = useMagneticEffect();
  return (
    <button
      ref={magneticRef}
      className={`favorite-btn ${isFavorite ? 'is-favorite' : ''}`}
      onClick={onClick}
      aria-label="Favorite this agent"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
    </button>
  );
};

// A component for the skeleton loading card
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
            const newFilteredBots = chatbotData.filter(bot =>
                (filterKey === '*' || bot.category === filterKey) &&
                (bot.name.toLowerCase().includes(lowerSearchTerm) || bot.description.toLowerCase().includes(lowerSearchTerm))
            );
            setFilteredBots(newFilteredBots);
        }
    }, [filterKey, searchTerm, isLoading]);

    const handleFilterKeyChange = (key) => () => setFilterKey(key);
    const handleSearchChange = (e) => setSearchTerm(e.target.value);
    
    const toggleFavorite = (botId, event) => {
        // Prevent the Link navigation from firing when clicking the favorite button
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
                                <div className="search-bar-wrapper"><input type="text" className="search-input" placeholder="Search for an agent..." value={searchTerm} onChange={handleSearchChange}/></div>
                                <div className="category-filters"><button onClick={handleFilterKeyChange('*')} className={filterKey === '*' ? 'active' : ''}>All</button>{categories.map(category => (<button key={category} onClick={handleFilterKeyChange(category)} className={filterKey === category ? 'active' : ''}>{category}</button>))}</div>
                            </div>
                            <div className="chatbot-grid" ref={gridRef}>
                                {isLoading ? Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />) : filteredBots.map((bot) => {
                                    const isFavorite = favorites.includes(bot.id.toString());
                                    return (
                                        <Link href={`/agent/${bot.id}`} key={bot.id} className="agent-card-link">
                                            <motion.div className="chatbot-card" data-tilt layoutId={`card-container-${bot.id}`}>
                                                {bot.isNew && <span className="card-badge new">New</span>}
                                                {bot.popularity > 95 && <span className="card-badge popular">Popular</span>}
                                                <FavoriteButton isFavorite={isFavorite} onClick={(e) => toggleFavorite(bot.id, e)} />
                                                <motion.div className="card-content">
                                                    <div className="card-header">
                                                        <div className="card-icon-wrapper"><img src={bot.icon} alt={`${bot.name} icon`} className="card-icon" /></div>
                                                        <h3>{bot.name}</h3>
                                                    </div>
                                                    <p className="card-description">{bot.description}</p>
                                                    <div className="card-footer">
                                                        <span className="details-link">View Details</span>
                                                        <span className="launch-link">Launch &rarr;</span>
                                                    </div>
                                                </motion.div>
                                            </motion.div>
                                        </Link>
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
            </motion.div>
        </Layout>
    );
}