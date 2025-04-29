// DISCORD_BOT_TOKEN=your_bot_token_here

const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const app = express();
const port = 3001;

// Discord BOTの設定
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers
    ]
});

// JSONパーサーのみ設定
app.use(express.json());

// BOTのログイン
client.login(process.env.DISCORD_BOT_TOKEN);

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// VC移動のエンドポイント
app.post('/move-vc', async (req, res) => {
    try {
        const { discordUserId, targetChannelId } = req.body;

        console.log('Received request:', {
            discordUserId,
            targetChannelId
        });

        if (!discordUserId || !targetChannelId) {
            return res.status(400).json({
                success: false,
                error: 'Missing required parameters'
            });
        }

        const targetChannel = await client.channels.fetch(targetChannelId);
        if (!targetChannel || !targetChannel.isVoiceBased()) {
            return res.status(404).json({
                success: false,
                error: 'Valid voice channel not found'
            });
        }

        const guild = targetChannel.guild;
        const member = await guild.members.fetch(discordUserId);

        if (!member) {
            return res.status(404).json({
                success: false,
                error: 'Member not found in the guild'
            });
        }

        await member.voice.setChannel(targetChannel);
        console.log(`Successfully moved ${member.user.tag} to ${targetChannel.name}`);

        res.json({
            success: true,
            message: 'Successfully moved member to voice channel'
        });

    } catch (error) {
        console.error('Error in move-vc endpoint:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// プロセス終了時の処理
process.on('SIGTERM', () => {
    client.destroy();
    process.exit(0);
});

process.on('SIGINT', () => {
    client.destroy();
    process.exit(0);
});