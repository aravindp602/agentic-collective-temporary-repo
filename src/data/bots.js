// src/data/bots.js

export const chatbotData = [
  { 
    id: 'social-media-strategy-canvas-7t3', 
    name: 'Social Media Strategist',
    category: 'Business',
    icon: '/logo.svg',
    description: 'A dedicated workspace to generate your social media strategy.',
    embedType: 'iframe',
    embedUrl: 'https://workflow.getmindpal.com/smc-a82lfig4qeeazhoc',
    isNew: true,
    // --- NEW DATA ---
    useCaseTags: ['Marketing', 'Branding', 'Content Strategy'],
    complexity: 4, // 1-5 scale
    relatedAgents: ['business-naming-bot', 'brand-positioning-statement-generator'],
  },
  { 
    id: 'business-naming-bot', 
    name: 'Business Naming Bot',
    category: 'Business',
    icon: '/logo.svg',
    description: 'Generates unique business names based on your inputs.',
    embedType: 'iframe',
    embedUrl: 'https://workflow.getmindpal.com/brand-naming-hj4dwYUt2meyyodk',
    popularity: 98,
    // --- NEW DATA ---
    useCaseTags: ['Startup', 'Branding', 'New Product'],
    complexity: 2,
    relatedAgents: ['social-media-strategy-canvas-7t3'],
  },
  { 
    id: 'brand-positioning-statement-generator', 
    name: 'Brand Positioning Statement Generator', 
    category: 'Creativity', 
    icon: '/logo.svg', 
    description: 'Generates compelling brand positioning statements.',
    embedType: 'iframe',
    embedUrl: 'https://workflow.getmindpal.com/brand-positioning-statement-xov5wYaKMSIl3q0l',
    // --- NEW DATA ---
    useCaseTags: ['Marketing', 'Branding', 'Strategy'],
    complexity: 3,
    relatedAgents: ['reason-to-believe-rtb'],
  },
  { 
    id: 'reason-to-believe-rtb', 
    name: 'Reason To Believe (RTB)', 
    category: 'Technical', 
    icon: '/logo.svg', 
    description: 'Generates strong reasons to believe for your brand messaging.',
    embedType: 'iframe',
    embedUrl: 'https://workflow.getmindpal.com/rtb--reasons-to-believe--JTcQj1Q8pSXDELSn',
    isNew: true,
    // --- NEW DATA ---
    useCaseTags: ['Copywriting', 'Marketing', 'Sales'],
    complexity: 4,
    relatedAgents: ['brand-positioning-statement-generator'],
  },
  {
    id : 'Neil the creative director',
    name : 'Neil the Creative Director',
    category : 'Creativity',
    icon : '/img/edit-3.svg',
    description : 'An AI-powered creative director that helps brainstorm and refine creative concepts.',
    embedType : 'iframe',
    embedUrl : 'https://workflow.getmindpal.com/creative-strategy-canvas-kwOzZWvzc9nHPf0o',
    isNew: true, 
    // --- NEW DATA ---
    useCaseTags: ['Brainstorming', 'Campaigns', 'Content Creation'],
    complexity: 5,
    relatedAgents: ['social-media-strategy-canvas-7t3'],
  }
];

export const categories = ["Creativity", "Technical", "Business", "Productivity", "Education"];