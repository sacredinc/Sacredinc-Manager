const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('admin')
		.setDescription('Manage administrative options!')
		.addSubcommand(subcommand =>
			subcommand
				.setName('channel')
				.setDescription('Set the channel from users will be able to create tickets'))
		.addSubcommand(subcommand =>
			subcommand
			.setName('category')
			.setDescription('Set the category in which tickets will be created')),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};
