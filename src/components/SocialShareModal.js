// src/components/SocialShareModal.js

import {
    TwitterShareButton,
    LinkedinShareButton,
    FacebookShareButton,
    RedditShareButton,
    EmailShareButton,
    TwitterIcon,
    LinkedinIcon,
    FacebookIcon,
    RedditIcon,
    EmailIcon,
} from 'react-share';

export default function SocialShareModal({ content, botName, onClose }) {
    if (!content) return null;

    const shareUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://your-app.com';
    const title = `AI-generated content from the "${botName}" agent:`;
    const fullContent = `${title}\n\n"${content}"\n\nGenerated via Digital Lesson.`;

    return (
        <div className="modal-overlay active">
            <div className="modal-content" style={{ maxWidth: '450px', textAlign: 'center' }}>
                <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">&times;</button>
                <h3>Share Content</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary-dark)', marginBottom: '24px' }}>
                    Share the content you generated with the {botName} agent.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                    <TwitterShareButton url={shareUrl} title={fullContent}>
                        <TwitterIcon size={40} round />
                    </TwitterShareButton>

                    <LinkedinShareButton url={shareUrl} title={title} summary={content}>
                        <LinkedinIcon size={40} round />
                    </LinkedinShareButton>

                    <FacebookShareButton url={shareUrl} quote={fullContent}>
                        <FacebookIcon size={40} round />
                    </FacebookShareButton>
                    
                    <RedditShareButton url={shareUrl} title={fullContent}>
                        <RedditIcon size={40} round />
                    </RedditShareButton>

                    <EmailShareButton url={shareUrl} subject={title} body={`${content}\n\n---\nShared from Digital Lesson.`}>
                        <EmailIcon size={40} round />
                    </EmailShareButton>
                </div>
            </div>
        </div>
    );
}