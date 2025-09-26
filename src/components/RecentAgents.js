// src/components/RecentAgents.js

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { chatbotData } from '../data/bots';
import { logAgentActivity } from '../lib/activityLogger';

export default function RecentAgents() {
    const [recentBots, setRecentBots] = useState([]);

    useEffect(() => {
        const recentIds = JSON.parse(localStorage.getItem('recentAgents')) || [];
        // Map the IDs back to the full bot objects
        const bots = recentIds.map(id => chatbotData.find(bot => bot.id === id)).filter(Boolean);
        setRecentBots(bots);
    }, []);

    return (
        <div className="dashboard-section">
            <h2>Recent Activity</h2>
            <div className="recent-agents-list">
                {recentBots.length > 0 ? (
                    recentBots.map(bot => (
                        <Link 
                            key={bot.id} 
                            href={bot.embedType === 'iframe' ? `/embed/${bot.id}` : `/chat/${bot.id}`}
                            className="recent-agent-item"
                            onClick={() => logAgentActivity(bot.id)}
                        >
                            <div className="card-icon-wrapper small-icon">
                                <img src={bot.icon} alt="" className="card-icon" />
                            </div>
                            <div className="recent-agent-details">
                                <h3>{bot.name}</h3>
                                <p>{bot.category}</p>
                            </div>
                            <span className="launch-arrow">&rarr;</span>
                        </Link>
                    ))
                ) : (
                    <div className="placeholder-text">
                        No recent activity. <Link href="/">Explore agents</Link> to get started.
                    </div>
                )}
            </div>
        </div>
    );
}