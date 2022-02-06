const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ticket')
		.setDescription('Manage a ticket!'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};
