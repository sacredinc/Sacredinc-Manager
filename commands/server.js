const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');
const wait = require('util').promisify(setTimeout);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Verwaltet einen Server!'),
	async execute(interaction) {
		const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setCustomId('add')
                .setLabel('Hinzufügen')
                .setStyle('SUCCESS')
                .setEmoji('➕')
                .setDisabled(true))
            .addComponents(
                new MessageButton()
                .setCustomId('edit')
                .setLabel('Bearbeiten')
                .setStyle('SECONDARY')
                .setDisabled(true))
            .addComponents(
                new MessageButton()
                .setCustomId('remove')
                .setLabel('Entfernen')
                .setStyle('DANGER')
                .setEmoji('❌')
                .setDisabled(true))
            )
	},
};
