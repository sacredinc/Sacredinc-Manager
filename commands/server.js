const { SlashCommandBuilder } = require('@discordjs/builders');
const mariadb = require('mariadb');
const {db_ip, db_pw, db_user, db_db, db_port} = require('./dbconfig.json')

const pool = mariadb.createPool({
     host: db_ip, 
     user: db_user, 
     password: db_pw,
     database: db_db,
     port: db_port,
     connectionLimit: 5,
     rowsAsArray: true
});
let servername = "";
let serverkuerzel = "";
let serverrang = 0;
let serverid = "";


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
            servername = interaction.options.getString('servername');
            serverkuerzel = interaction.options.getString('serverkürzel');
            serverrang = interaction.options.getInteger('serverrang');
            serverid = interaction.guild.id;

            await interaction.deferReply({ ephemeral: true })
            await this.connector();
            await interaction.editReply(`${servername} (${serverid}) wurde mit dem Kürzel ${serverkuerzel} auf Rang ${serverrang} hinzugefügt.`)

        }

        else if(interaction.options.getSubcommand() === 'remove') {

        }

	},
    
    async connector() {
        let conn;
        try {
          conn = await pool.getConnection();
          const rows = conn.query("SELECT 1 as val");
          console.log(rows);
          const abc = conn.query('SELECT max(id) from servers');
          console.log('\n\n\nstart\n\n\n')
          console.log(abc);
            console.log('\n\n\nend\n\n\n')
          const res = conn.query(`INSERT INTO servers (id, name_long, name_short, server_rank, discord_id) VALUES (0, '${servername}', '${serverkuerzel}', '${serverrang}', '${serverid}');`);
          console.log(res);

        } catch (err) {
          throw err;
        } finally {
          if (conn) await conn.end();
        }
      }
    
    
};
