const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('admin')
		.setDescription('Manage administrative options!'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};
