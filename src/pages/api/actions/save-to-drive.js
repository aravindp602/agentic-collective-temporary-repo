// src/pages/api/actions/save-to-drive.js

import { getToken } from 'next-auth/jwt';
import { google } from 'googleapis';

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    // 1. Get the user's full token, which includes the accessToken
    const token = await getToken({ req, secret, raw: true });
    
    // The decoded token is available as well if you need user id, etc.
    const decodedToken = await getToken({ req, secret });

    if (!decodedToken || !decodedToken.accessToken) {
        return res.status(401).json({ message: 'Not authenticated or access token is missing.' });
    }

    const { noteContent, botName } = req.body;
    if (noteContent === undefined || !botName) {
        return res.status(400).json({ message: 'Note content and bot name are required.' });
    }

    try {
        // 2. Initialize the Google Drive client directly with the accessToken from the JWT
        const auth = new google.auth.OAuth2();
        auth.setCredentials({ access_token: decodedToken.accessToken }); // Use the token from the session
        const drive = google.drive({ version: 'v3', auth });

        // 3. Prepare the file to be created
        const fileName = `Notes for ${botName} - ${new Date().toLocaleDateString()}.md`;
        const fileMetadata = {
            name: fileName,
            mimeType: 'text/markdown',
            parents: ['root'],
        };
        const media = {
            mimeType: 'text/markdown',
            body: noteContent,
        };

        // 4. Create the file
        const driveResponse = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id, webViewLink',
        });

        return res.status(200).json({ 
            message: 'Note saved successfully to Google Drive!', 
            driveLink: driveResponse.data.webViewLink 
        });

    } catch (error) {
        console.error('Google Drive API Error:', error.response ? error.response.data : error.message);
        // If the error is an authentication error, send a specific message
        if (error.response?.status === 401) {
            return res.status(401).json({ message: 'Authentication failed. Please sign out and sign in again.' });
        }
        return res.status(500).json({ message: 'An error occurred while saving to Google Drive.' });
    }
}