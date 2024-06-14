import { Client, GatewayIntentBits } from 'discord.js';
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'Hola') {
    await interaction.reply('Pong!');
  }
});

client.login("MTI1MDk2MjQ2MzE2ODY2MzU4Mw.G19Xiw.MDPa3ttc82NYQTunn-p0YxRETZvFckU31DjBl0");