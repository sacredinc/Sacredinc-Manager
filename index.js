// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// Code executed once, when the client is ready.
client.once('ready', () => {
	console.log('Ready!');
});

// Login to Discord
client.login(token);