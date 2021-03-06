const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Antwortet mit Pong!'),
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });
		await wait(1);
		await interaction.editReply('Pong!');
	},
};
