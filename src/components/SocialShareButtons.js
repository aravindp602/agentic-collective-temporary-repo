// src/components/SocialShareButtons.js

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

export default function SocialShareButtons({ shareUrl, title }) {
    const iconProps = {
        size: 32,
        round: true,
    };

    const containerStyle = {
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        flexWrap: 'wrap',
    };

    return (
        <div style={containerStyle}>
            <TwitterShareButton url={shareUrl} title={title}>
                <TwitterIcon {...iconProps} />
            </TwitterShareButton>

            <LinkedinShareButton url={shareUrl} title={title}>
                <LinkedinIcon {...iconProps} />
            </LinkedinShareButton>

            <FacebookShareButton url={shareUrl} quote={title}>
                <FacebookIcon {...iconProps} />
            </FacebookShareButton>
            
            <RedditShareButton url={shareUrl} title={title}>
                <RedditIcon {...iconProps} />
            </RedditShareButton>

            <EmailShareButton url={shareUrl} subject={title} body="Check out this AI agent:">
                <EmailIcon {...iconProps} />
            </EmailShareButton>
        </div>
    );
}