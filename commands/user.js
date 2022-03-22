const { SlashCommandBuilder } = require('@discordjs/builders');
const mariadb = require('mariadb');
const {db_ip, db_pw, db_user, db_db, db_port} = require('./dbconfig.json')

let nutzerrang = 0;
let nutzerid = "";
let snowflake = "";
let executor = "";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Verwaltet einen Nutzer!')
        .addSubcommand(subcommand =>
            subcommand
                
                .setName('set')
                .setDescription('Füge einen Nutzer in die Datenbank hinzu')
                .addUserOption(option =>
                    option.setName('nutzer')
                        .setDescription('Der hinzuzufügende Nutzer')
                        .setRequired(true))
                .addIntegerOption(option =>
                    option.setName('nutzerrang')
                        .setDescription('Der Netzwerkrang des Nutzers')
                        .setRequired(true)
                        .addChoice('Leitung', 99)
                        .addChoice('Administrator', 6)
                        .addChoice('Netzwerkteam', 5)
                        .addChoice('Team', 4)
                        .addChoice('Kooperationspartner', 3)
                        .addChoice('Partner', 2)
                        .addChoice('Normaler Nutzer', 1)
                        .addChoice('Gesperrter Nutzer', 0)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Entferne einen Nutzer aus der Datenbank')
                .addUserOption(option =>
                    option.setName('nutzer')
                        .setDescription('Der zu entfernende Nutzer')
                        .setRequired(true))),

    async execute(interaction) {
        executor = interaction.member.id.toString();
        if(interaction.options.getSubcommand() === 'set') {
                nutzerrang = interaction.options.getInteger('nutzerrang');
                nutzerid = interaction.options.getUser('nutzer');
                snowflake = nutzerid.toString();
                snowflake = snowflake.replace('<', '');
                snowflake = snowflake.replace('>', '');
                snowflake = snowflake.replace('@', '');

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

                    let userPerms = await checkUserPerms(conn, executor);

                    if (userPerms[0].user_rank >= 6) {
                        await clearUser(conn);
                        await writeUser(conn);
                        await interaction.editReply(`Der Nutzer ${nutzerid} (${snowflake}) wurde auf Rang ${nutzerrang} hinzugefügt.`)
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
                nutzerid = interaction.options.getUser('nutzer');
                snowflake = nutzerid.toString();
                snowflake = snowflake.replace('<', '');
                snowflake = snowflake.replace('>', '');
                snowflake = snowflake.replace('@', '');

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

                    if (checkUserPerms(conn, executor) >= 6) {

                        await removeUser(conn);

                        await interaction.editReply(`Der Nutzer ${nutzerid} (${snowflake}) wurde entfernt.`)
                    } else {
                        await  interaction.editReply("Dazu hast du keine Rechte!")
                    }
                } catch (err) {
                    console.log(err);
                } finally {
                    if (conn) conn.close();
                }
        }

        function writeUser(conn) {
            return conn.query(`INSERT INTO users (user_rank, discord_id) VALUES ('${nutzerrang}', '${snowflake}');`);
        }

        function clearUser(conn) {
            let check = conn.query(`SELECT discord_id FROM network.users WHERE discord_id='${snowflake}'`);
            if (check.length !== 0) {
                conn.query(`DELETE FROM users WHERE discord_id='${snowflake}'`);
                console.log(`Deleted ${snowflake} from the database to make space for new entry`)
            }
        }

        function removeUser(conn) {
            return conn.query(`UPDATE users SET user_rank = 1 WHERE discord_id = ${snowflake}`);
        }

        async function checkUserPerms(conn, executor) {
            return await conn.query(`SELECT user_rank FROM network.users WHERE discord_id='${executor}'`)
        }
    }
};