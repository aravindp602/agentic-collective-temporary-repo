// src/pages/index.js

import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { chatbotData, categories } from '../data/bots';
import Layout from '../components/Layout'; // <-- 1. IMPORT THE LAYOUT COMPONENT

export default function HomePage() {
    // This state logic is now simplified as we are not using Isotope for this example
    const [filteredBots, setFilteredBots] = useState(chatbotData);
    const [favorites, setFavorites] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [filterKey, setFilterKey] = useState('*');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const savedFavorites = JSON.parse(localStorage.getItem('favoriteBots')) || [];
        setFavorites(savedFavorites);
    }, []);
    
    useEffect(() => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        const newFilteredBots = chatbotData.filter(bot => {
            const matchesCategory = filterKey === '*' || bot.category === filterKey;
            const matchesSearch = bot.name.toLowerCase().includes(lowerSearchTerm) || bot.description.toLowerCase().includes(lowerSearchTerm);
            return matchesCategory && matchesSearch;
        });
        setFilteredBots(newFilteredBots);
    }, [filterKey, searchTerm]);

    const handleFilterKeyChange = (key) => () => setFilterKey(key);
    const handleSearchChange = (e) => setSearchTerm(e.target.value);

    const toggleFavorite = (botId) => {
        const botIdStr = botId.toString();
        let updatedFavorites;
        if (favorites.includes(botIdStr)) {
            updatedFavorites = favorites.filter(id => id !== botIdStr);
        } else {
            updatedFavorites = [...favorites, botIdStr];
        }
        setFavorites(updatedFavorites);
        localStorage.setItem('favoriteBots', JSON.stringify(updatedFavorites));
    };

    const openModal = (bot) => { setModalData(bot); setIsModalOpen(true); };
    const closeModal = () => { setIsModalOpen(false); };

    return (
        // 2. WRAP THE ENTIRE PAGE CONTENT IN THE <Layout> COMPONENT
        <Layout>
            <Head>
                <title>Agentic Collective | Explore</title>
                <meta name="description" content="Explore a collection of 42 specialized AI agents, each designed for a unique purpose." />
            </Head>
            
            <section className="hero-section">
                <div className="container hero-layout">
                    <div className="hero-content">
                        <h1 className="hero-title">Your On-Demand AI Workforce</h1>
                        <p className="hero-subtitle">Get expert results from 42 specialized AI agents. Your next big idea is just a conversation away.</p>
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

            <section className="trust-bar-section">
                <div className="container">
                    <p>Powering innovation at world-class companies</p>
                    <div className="logos-container">
                        <span>Innovate Inc.</span>
                        <span>Quantum Leap</span>
                        <span>Apex Solutions</span>
                        <span>Future Forge</span>
                        <span>Stellar Co.</span>
                    </div>
                </div>
            </section>

            <section id="gallery" className="chatbot-gallery-section">
                <div className="container">
                    <div className="search-and-filters fade-in-on-scroll is-visible">
                        <div className="search-bar-wrapper">
                            <input 
                                type="text" 
                                className="search-input" 
                                placeholder="Search for an agent by name or function..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>
                        <div className="category-filters">
                            <button onClick={handleFilterKeyChange('*')} className={filterKey === '*' ? 'active' : ''}>All</button>
                            {categories.map(category => (
                                <button key={category} onClick={handleFilterKeyChange(category)} className={filterKey === category ? 'active' : ''}>
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="chatbot-grid">
                        {filteredBots.length > 0 ? (
                            filteredBots.map(bot => {
                                const launchUrl = bot.embedType === 'iframe' 
                                    ? `/embed/${bot.id}` 
                                    : `/chat/${bot.id}`;
                                const isFavorite = favorites.includes(bot.id.toString());

                                return (
                                    <div key={bot.id} className="chatbot-card" data-category={bot.category}>
                                        <button 
                                            className={`favorite-btn ${isFavorite ? 'is-favorite' : ''}`} 
                                            onClick={() => toggleFavorite(bot.id)}
                                            aria-label="Favorite this agent"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                                        </button>
                                        <div className="card-content">
                                            <div className="card-header">
                                                <div className="card-icon-wrapper"><img src={bot.icon} alt="" className="card-icon" /></div>
                                                <h3>{bot.name}</h3>
                                            </div>
                                            <p className="card-description">{bot.description}</p>
                                            <div className="card-footer">
                                                <button className="details-link" onClick={() => openModal(bot)}>Details</button>
                                                <Link href={launchUrl} className="launch-link">Launch &rarr;</Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="placeholder-text full-width-placeholder">No agents found. Try adjusting your search or filters.</div>
                        )}
                    </div>
                </div>
            </section>
            
            <div className="section-flare"></div>
            <section className="final-cta-section">
                <div className="container">
                    <h2>Ready to Start?</h2>
                    <p>Dive in and explore the future of AI-powered assistance. Your personal dashboard is just one click away.</p>
                    <Link href="/dashboard" className="cta-button">Go to Your Dashboard</Link>
                </div>
            </section>

            {isModalOpen && (
                 <div className="modal-overlay active">
                    <div className="modal-content">
                        <button onClick={closeModal} className="modal-close-btn" aria-label="Close modal">&times;</button>
                        <div id="modal-body">
                            <h2>{modalData.name}</h2>
                            <span className="modal-category">{modalData.category}</span>
                            <p>{modalData.description}</p>
                            {modalData.examples && modalData.examples.length > 0 && <h4>Example Prompts:</h4>}
                            <ul>
                                {modalData.examples && modalData.examples.map((ex, i) => <li key={i}>{ex}</li>)}
                            </ul>
                            <Link href={modalData.embedType === 'iframe' ? `/embed/${modalData.id}` : `/chat/${modalData.id}`} className="modal-launch-btn">Start Conversation</Link>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    )
}