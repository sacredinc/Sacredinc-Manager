const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Verwaltet einen Server!'),
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });
		await wait(1);
		await interaction.editReply('Pong!');
	},
};
