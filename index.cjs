const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const path = require('path');
const { token, guildId } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands/utility')).filter(file => file.endsWith('.js'));

const loadCommands = async () => {
    const commands = [];
    for (const file of commandFiles) {
        const command = await import(`./commands/utility/${file}`);
        client.commands.set(command.default.data.name, command.default);
        commands.push(command.default.data.toJSON());
    }
    return commands;
};

client.once('ready', async () => {
    console.log('Ready!');

    const CLIENT_ID = client.user.id;

    const rest = new REST({ version: '9' }).setToken(token);

    try {
        console.log('Started refreshing application (/) commands.');

        const commands = await loadCommands();

        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, guildId),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.login(token);
