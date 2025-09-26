// src/components/UsageStats.js

export default function UsageStats({ favoriteCount }) {
    return (
        <div className="dashboard-section">
            <h2>Statistics</h2>
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>{favoriteCount}</h3>
                    <p>Favorite Agents</p>
                </div>
            </div>
        </div>
    );
}