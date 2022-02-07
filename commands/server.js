const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');
const wait = require('util').promisify(setTimeout);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Verwaltet einen Server!')
        .addSubcommand(subcommand =>
            subcommand 
            .setName('add')
            .setDescription('Füge den aktuellen Server in die Datenbank hinzu')
            .addStringOption(option =>
                option.setName('servername')
                    .setDescription('Der vollständige Name des Servers')
                    .setRequired(true))
            .addStringOption(option =>
                option.setName('serverkürzel')
                    .setDescription('Der abgekürzte Name des Servers')
                    .setRequired(true))
            .addIntegerOption(option =>
                option.setName('serverrang')
                    .setDescription('Der Netzwerkrang des Servers')
                    .setRequired(true)
                    .addChoice('Zentralserver', 99)
                    .addChoice('Verifizierter Server', 5)
                    .addChoice('Netzwerkmitglied', 4)
                    .addChoice('Kooperationspartner', 3)
                    .addChoice('Partner', 2)
                    .addChoice('Normaler Server', 1)
                    .addChoice('Gesperrter Server', 0)))
        .addSubcommand(subcommand =>
            subcommand 
            .setName('remove')
            .setDescription('Entferne einen Server aus der Datenbank')
            .addIntegerOption(option =>
                option.setName('serverkürzel')
                .setDescription('Das Serverkürzel des zu entfernenden Servers')
                .setRequired(true))),

	async execute(interaction) {
        if(interaction.options.getSubcommand() === 'add') {
            const servername = interaction.options.getString('servername');
            const serverkuerzel = interaction.options.getString('serverkürzel');
            const serverrang = interaction.options.getInteger('serverrang');
            const serverid = interaction.guild.id;


            await interaction.reply({content: `${servername} (${serverid}) wurde mit dem Kürzel ${serverkuerzel} auf Rang ${serverrang} hinzugefügt.`, ephemeral: true})

        }

        else if(interaction.options.getSubcommand() === 'remove') {
            const serverkürzel = interaction.options.getString('serverkürzel');

        }

	},
    
    
};
