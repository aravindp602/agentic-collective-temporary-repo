// src/pages/api/actions/save-to-drive.js

import { getToken } from 'next-auth/jwt';
import { google } from 'googleapis';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    // 1. Authenticate the user session
    const token = await getToken({ req, secret });
    if (!token) {
        return res.status(401).json({ message: 'You must be logged in.' });
    }

    const { noteContent, botName } = req.body;
    if (noteContent === undefined || !botName) {
        return res.status(400).json({ message: 'Note content and bot name are required.' });
    }

    try {
        // 2. Retrieve the user's Google access token from your database
        const account = await prisma.account.findFirst({
            where: {
                userId: token.id,
                provider: 'google',
            },
        });

        if (!account || !account.access_token) {
            return res.status(403).json({ message: 'Google account not linked. Please sign out and sign in again with Google.' });
        }

        // 3. Initialize the Google Drive client
        const auth = new google.auth.OAuth2();
        auth.setCredentials({ access_token: account.access_token });
        const drive = google.drive({ version: 'v3', auth });

        // 4. Prepare the file to be created
        const fileName = `Notes for ${botName} - ${new Date().toLocaleDateString()}.md`;
        const fileMetadata = {
            name: fileName,
            mimeType: 'text/markdown',
            parents: ['root'], // Saves to the main "My Drive" folder
        };
        const media = {
            mimeType: 'text/markdown',
            body: noteContent,
        };

        // 5. Create the file
        const driveResponse = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id, webViewLink', // Ask Google to return the file's link
        });

        return res.status(200).json({ 
            message: 'Note saved successfully to Google Drive!', 
            driveLink: driveResponse.data.webViewLink 
        });

    } catch (error) {
        console.error('Google Drive API Error:', error.response ? error.response.data : error.message);
        return res.status(500).json({ message: 'An error occurred while saving to Google Drive.' });
    }
}