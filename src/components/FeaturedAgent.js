// src/components/FeaturedAgent.js

import Link from 'next/link';
import { chatbotData } from '../data/bots';

export default function FeaturedAgent() {
  // We are still using the original logic of selecting the second bot.
  const featuredBot = chatbotData[4];

  if (!featuredBot) {
    return null; // Don't render if there's no bot.
  }

  const launchUrl = featuredBot.embedType === 'iframe' 
      ? `/embed/${featuredBot.id}` 
      : `/chat/${featuredBot.id}`;

  return (
    <section className="featured-agent-section">
      <div className="container">
        <div className="featured-agent-layout">
          <div className="featured-agent-icon-wrapper">
            {/* THIS IS THE KEY CHANGE: */}
            {/* We are now explicitly telling it to use the new logo-white.svg */}
            <img src="/logo-white.svg" alt={featuredBot.name} className="featured-agent-icon" />
          </div>
          <div className="featured-agent-content">
            <h3>Featured Agent</h3>
            <h2>{featuredBot.name}</h2>
            <p>{featuredBot.description}</p>
            <Link href={launchUrl} className="cta-button">
              Launch Agent &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}