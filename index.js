// 必要なパッケージ: express, discord.js, cors, dotenv
const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Discord BOTクライアントの初期化
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

client.once('ready', () => {
  console.log(`BOT起動: ${client.user.tag}`);
});

// VC移動API
app.post('/move-vc', async (req, res) => {
  const { discordUserId, targetChannelId } = req.body;
  if (!discordUserId || !targetChannelId) {
    return res.status(400).json({ success: false, error: 'discordUserIdとtargetChannelIdは必須です' });
  }
  try {
    const guild = await client.guilds.fetch(process.env.GUILD_ID);
    const member = await guild.members.fetch(discordUserId);
    await member.voice.setChannel(targetChannelId);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// サーバー起動
const PORT = process.env.PORT || 3001;
client.login(process.env.BOT_TOKEN);
app.listen(PORT, () => console.log(`APIサーバー起動: http://localhost:${PORT}`)); 