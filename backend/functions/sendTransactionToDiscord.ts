import { Handler } from '@netlify/functions';
import { Client, GatewayIntentBits, TextChannel } from 'discord.js';
import { getCorsHeaders } from "./corsSettings.js";
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN!;
const DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID!;

client.login(DISCORD_BOT_TOKEN);

const waitForClientReady = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (client.isReady()) {
            resolve();
        } else {
            client.once('ready', () => resolve());
            client.once('error', reject);
        }
    });
};


export const handler: Handler = async (event) => {
    const origin = event.headers.origin;
    const corsHeaders = getCorsHeaders(origin);

    // Handle preflight (OPTIONS) requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 204,
            headers: corsHeaders,
            body: '',
        };
    }

    try {
        await waitForClientReady();

        if (!event.body) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ success: false, message: 'No transaction data provided' }),
            };
        }

        const transaction = JSON.parse(event.body);

        const channel = await client.channels.fetch(DISCORD_CHANNEL_ID) as TextChannel;
        if (channel && channel.isTextBased()) {
            const message = `💰 **En neue Stutz häts ine gschneit!** 💰

**Details:**
**Spieler:**               ${transaction.playerName}  
**Grund:**                 ${transaction.reason}  
**Hinzuegfüegt:**   ${transaction.addedBy}  
**Wänn?:**                 ${new Date(transaction.timestamp).toLocaleString()}`;

            await channel.send(message);

            return {
                statusCode: 200,
                headers: corsHeaders,
                body: JSON.stringify({ success: true, message: 'Message sent to Discord' }),
            };
        } else {
            return {
                statusCode: 404,
                headers: corsHeaders,
                body: JSON.stringify({ success: false, message: `Discord channel not found DISCORD_CHANNEL_ID:${DISCORD_CHANNEL_ID} and DISCORD_BOT_TOKEN:${DISCORD_BOT_TOKEN} and process.env.NODE_ENV:${process.env.NODE_ENV}` }),
            };
        }
    } catch (error) {
        console.error('Error sending message to Discord:', error);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ success: false, message: 'Internal Server Error' }),
        };
    }
};
