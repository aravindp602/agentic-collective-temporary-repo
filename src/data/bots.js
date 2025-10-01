// src/data/bots.js

export const chatbotData = [
  { 
    id: 'social-media-strategy-canvas-7t3', 
    name: 'Social Media Strategist',
    category: 'Business',
    icon: '/logo.svg', // Keep as a fallback
    description: 'A dedicated workspace to generate your social media strategy.',
    embedType: 'iframe',
    embedUrl: 'https://workflow.getmindpal.com/smc-a82lfig4qeeazhoc',
    isNew: true,
    useCaseTags: ['Marketing', 'Branding', 'Content Strategy'],
    complexity: 4,
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
    useCaseTags: ['Copywriting', 'Marketing', 'Sales'],
    complexity: 4,
    relatedAgents: ['brand-positioning-statement-generator'],
  },
  {
    id : 'Neil the creative director',
    name : 'Neil the Creative Director',
    category : 'Creativity',
    icon : '/logo.svg',
    description : 'An AI-powered creative director that helps brainstorm and refine creative concepts.',
    embedType : 'iframe',
    embedUrl : 'https://workflow.getmindpal.com/creative-strategy-canvas-kwOzZWvzc9nHPf0o',
    isNew: true, 
    useCaseTags: ['Brainstorming', 'Campaigns', 'Content Creation'],
    complexity: 5,
    relatedAgents: ['social-media-strategy-canvas-7t3'],
  }
];

export const categoriesWithIcons = [
  { name: "Creativity", icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"/><path d="M12 18H12.01"/><path d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"/></svg>` },
  { name: "Technical", icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>` },
  { name: "Business", icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>` },
  { name: "Productivity", icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>` },
  { name: "Education", icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>` }
];

export const categories = ["Creativity", "Technical", "Business", "Productivity", "Education"];