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
                option.setName('Servername')
                    .setDescription('Der vollständige Name des Servers')
                    .setRequired(true))
            .addStringOption(option =>
                option.setName('Serverkürzel')
                    .setDescription('Der abgekürzte Name des Servers')
                    .setRequired(true))
            .addIntegerOption(option =>
                option.setName('Serverrang')
                    .setDescription('Der Netzwerkrang des Servers')
                    .setRequired(true)
                    .addChoice('Zentralserver', 0)
                    .addChoice('Verifizierter Server', 1)
                    .addChoice('Netzwerkmitglied', 2)
                    .addChoice('Kooperationspartner', 3)
                    .addChoice('Partner', 4)
                    .addChoice('Normaler Server', 5)
                    .addChoice('Gesperrter Server', 99)))
        .addSubcommand(subcommand =>
            subcommand 
            .setName('remove')
            .setDescription('Entferne einen Server aus der Datenbank')
            .addIntegerOption(option =>
                option.setName('Serverkürzel')
                .setDescription('Das Serverkürzel des zu entfernenden Servers')
                .setRequired(true))),

	async execute(interaction) {
        if(interaction.options.getSubcommand() === 'add') {
            const servername = interaction.options.getString('Servername');
            const serverkuerzel = interaction.options.getString('Serverkürzel');
            const serverrang = interaction.options.getInteger('Serverrang');
            const serverid = interaction.guild.id;


            await interaction.reply(`${servername} (${serverid}) wurde mit dem Kürzel ${serverkuerzel} auf Rang ${serverrang} hinzugefügt.`)

        }

        else if(interaction.options.getSubcommand() === 'remove') {
            const serverkürzel = interaction.options.getString('Serverkürzel');

        }

	},
    
    
};
