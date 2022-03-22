const { SlashCommandBuilder } = require('@discordjs/builders');
const mariadb = require('mariadb');
const {db_ip, db_pw, db_user, db_db, db_port} = require('./dbconfig.json')

let servername = "";
let serverkuerzel = "";
let serverrang = 0;
let serverid = "";
let executor = "";


module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Verwaltet einen Server!')
        .addSubcommand(subcommand =>
            subcommand 
            .setName('set')
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
            .addStringOption(option =>
                option.setName('serverkürzel')
                .setDescription('Das Serverkürzel des zu entfernenden Servers')
                .setRequired(true))),

	async execute(interaction) {
        executor = interaction.member.id.toString();
        if(interaction.options.getSubcommand() === 'set') {
                servername = interaction.options.getString('servername');
                serverkuerzel = interaction.options.getString('serverkürzel');
                serverrang = interaction.options.getInteger('serverrang');
                serverid = interaction.guild.id;

                await interaction.deferReply({ephemeral: true})

                let conn;

                try {
                    conn = await mariadb.createConnection({
                        host: db_ip,
                        user: db_user,
                        password: db_pw,
                        database: db_db,
                        port: db_port,
                    });

                    if (checkUserPerms(conn, executor) >= 5) {


                        await clearServer(conn);

                    await writeServer(conn);
                    await interaction.editReply(`${servername} (${serverid}) wurde mit dem Kürzel ${serverkuerzel} auf Rang ${serverrang} hinzugefügt.`)

                    } else {
                        await  interaction.editReply("Dazu hast du keine Rechte!")
                    }

                } catch (err) {
                    console.log(err);
                } finally {
                    if (conn) conn.close();
                }
        }

        else if(interaction.options.getSubcommand() === 'remove') {
                serverkuerzel = interaction.options.getString('serverkürzel');

                await interaction.deferReply({ephemeral: true})

                let conn;

                try {
                    conn = await mariadb.createConnection({
                        host: db_ip,
                        user: db_user,
                        password: db_pw,
                        database: db_db,
                        port: db_port,
                    });

                    if (checkUserPerms(conn, executor) >= 5) {

                        await removeServer(conn);
                        await interaction.editReply(`Der Server ${serverkuerzel} wurde entfernt.`)

                    } else {
                        await  interaction.editReply("Dazu hast du keine Rechte!")
                    }

                } catch (err) {
                    console.log(err);
                } finally {
                    if (conn) conn.close();
                }
        }

        function writeServer(conn) {
            return conn.query(`INSERT INTO servers (name_long, name_short, server_rank, discord_id) VALUES ('${servername}', '${serverkuerzel}', '${serverrang}', '${serverid}');`);
        }

        function clearServer(conn) {
            let check = conn.query(`SELECT discord_id FROM network.servers WHERE name_short='${serverkuerzel}'`);
            if (check.length !== 0) {
                conn.query(`DELETE FROM servers WHERE name_short='${serverkuerzel}'`);
                console.log(`Deleted ${serverkuerzel} from the database to make space for new entry`)
            }
        }

        function removeServer(conn) {
            return conn.query(`UPDATE servers SET server_rank = 1 WHERE name_short = '${serverkuerzel}'`);
        }

        function checkUserPerms(conn, executor) {
            return conn.query(`SELECT user_rank FROM network.users WHERE discord_id='${executor}'`)
        }

}};