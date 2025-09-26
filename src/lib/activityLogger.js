// src/lib/activityLogger.js

const RECENTS_KEY = 'recentAgents';
const MAX_RECENTS = 4; // Show the last 4 recent agents

export const logAgentActivity = (botId) => {
  if (typeof window === 'undefined') return;

  try {
    const recentIds = JSON.parse(localStorage.getItem(RECENTS_KEY)) || [];
    
    // Remove the id if it already exists, so we can move it to the front
    const filteredIds = recentIds.filter(id => id !== botId);
    
    // Add the new id to the beginning of the array
    const newRecents = [botId, ...filteredIds];
    
    // Trim the array to the max length
    if (newRecents.length > MAX_RECENTS) {
      newRecents.length = MAX_RECENTS;
    }

    localStorage.setItem(RECENTS_KEY, JSON.stringify(newRecents));
  } catch (error) {
    console.error("Failed to log agent activity:", error);
  }
};