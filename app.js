/* * * * * * * * * * * * * * * *
 * Pingu                       *
 * Versión: 2108               *
 * Actualización: 2108.031233  *
 * * * * * * * * * * * * * * * */
require('dotenv').config()
const { Client, Collection, Intents } = require('discord.js');
const { AutoPoster } = require('topgg-autoposter');
const mysql = require('mysql2');
const fs = require('fs');
const makeId = require('./gen/makeId');

const log = require('simple-node-logger').createRollingFileLogger({
  logDirectory: `./logs`,
  fileNamePattern: `<date>_${makeId(5)}.log`,
  dateFormat: 'YYYY.MM.DD',
});

// Redireccionar console.log a @package/simple-node-logger
console.log = function (d, f) {
  process.stdout.write(`${d}\n`);
  log.info(d);
};

process.on('uncaughtException', function (err) {
  log.warn((err && err.stack) ? err.stack : err);
});

const talkedRecently = new Set();
const client = new Client();

console.log('[··] Cargando Eventos');
const guildcreate = require('./events/guildCreate');
const guilddelete = require('./events/guildDelete');
const guildmemberadd = require('./events/guildMemberAdd');
const guildmemberremove = require('./events/guildMemberRemove');
console.log('[OK] Eventos Cargados');

console.log('[··] Cargando Servicios');
const leveling = require('./services/leveling');
const antispamworker = require('./services/antispam');
const apolo_panel = require('./services/freshping');
console.log('[OK] Servicios Cargados');

// Bot
if (process.env.ENTORNO !== "desarrollo") {
  const ap = AutoPoster(process.env.TOPGG, client)
  console.log('[··] Publicando Estadísticas a Top.GG')
  ap.on('posted', () => {
    console.log('[OK] Estadísticas publicadas en Top.GG')
  })
  client.login(process.env.PUBLIC_TOKEN);
  apolo_panel(25699, client);
} else {
  apolo_panel(8000, client);
  client.login(process.env.INSIDER_TOKEN)
}

//Cargar comandos
console.log('--Cargando comandos--');

client.commands = new Collection();

loadCommands(client.commands, './tools');

function loadCommands(collection, directory) {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const path = `${directory}/${file}`;

    if (file.endsWith('.js')) {
      const command = require(path);
      console.log(`[··] Cargando ${command.name}`);
      collection.set(command.name, command);
      console.log(`[OK] Cargado ${command.name}`);
    }
    else if (fs.lstatSync(path).isDirectory()) {
      loadCommands(collection, path);
    }
  }
};

var con = mysql.createConnection({
  host: "104.128.239.45",
  user: "u43502_Ipea7UopvX",
  password: "T0^Y9yXARCuAa1.LfAzmWRRt",
  database: "s43502_pingu",
  charset: "utf8_unicode_ci",
});

con.connect(function (err) {
  console.log('[··] Conectando a MariaDB');
  if (err) {
    log.warn(err)
  } else {
    console.log('[OK] Conexión establecida con MariaDB');
  }
});

client.on('ready', () => {
  console.log('[OK] Bot inicializado...');
  console.log(`[IF] Logged in as ${client.user.tag}!`);
  client.user.setPresence({
    status: 'idle',
    activity: {
      name: 'Discord',
      type: 'WATCHING',
    }
  })
  setInterval(() => {
    client.user.setPresence({
      status: 'idle',
      activity: {
        name: 'Discord',
        type: 'WATCHING',
      }
    })
  }, 3600000);
})

client.on('guildCreate', guild => {
  guildcreate(con, guild);
});

client.on('guildDelete', (guild) => {
  guilddelete(con, guild);
});

client.on('guildMemberAdd', member => {
  guildmemberadd(client, con, member);
});

client.on('guildMemberRemove', member => {
  guildmemberremove(client, con, member);
});

client.on('message', (message) => {
  //Comprobamos que no hemos recibido mensaje a través de DM, que no es un bot, o que el propio autor del mensaje sea el bot
  if (message.channel.type === "dm" || message.author.bot || message.author === client.user) return;

  //Conectamos con Mariadb y obtenemos datos del servidor
  con.query(`SELECT * FROM \`guild_data\` WHERE guild =${message.guild.id}`, function (err, result, rows) {
    if (result.hasOwnProperty(0)) {
      if (message.mentions.users.first() === client.user) {
        client.commands.get('about').execute(args, client, con, contenido, message, result);
      }
      var id = message.guild.id;
      //Comprobamos si el mensaje ha comenzado con prefijo
      if (message.content.startsWith(result[0].guild_prefix) && message.content != result[0].guild_prefix) {

        //Retirar el comandomsg.content.split(' ').splice(1).join(' ')
        var cortar = message.content.trim().split(' ');

        //Solo retira el prefijo del comando, por lo que cuenta también la acción deseada en el array
        var mensajeprocesado = message.content.replace(result[0].guild_prefix, '');
        //Regex para los argumentos con ""

        const regex = new RegExp('"[^"]+"|[\\S]+', 'g');
        var args = [];
        mensajeprocesado.match(regex).forEach(element => {
          if (!element) return;
          return args.push(element.replace(/"/g, ''));
        });

      }
      var tolower = message.content;
      var contenido = tolower.toLowerCase();
      if (message.content.startsWith(result[0].guild_prefix)) {
        if (args) {
          if (client.commands.has(args[0])) {
            try {
              client.commands.get(args[0]).execute(args, client, con, contenido, message, result);
            } catch (err) {
              log.warn(err);
              message.reply(' se ha producido un error cuando ha intentado ejecutar este comando...');
            }
          } else {
            var consultacomandoscustom = "SELECT * FROM `guild_commands` WHERE `guild` = " + message.guild.id;
            con.query(consultacomandoscustom, function (err, result) {
              if (result.hasOwnProperty(0)) {
                var buscarcomando = "SELECT * FROM `guild_commands` WHERE `guild` = '" + message.guild.id + "' AND `cmd` = '" + args[0] + "'";
                con.query(buscarcomando, function (err, result) {
                  if (result.hasOwnProperty(0)) {
                    message.channel.send("<:comandoscustom:858671400424046602>" + result[0].returns);
                  }
                });
              }
            });
          };
        }
      }

      if (result[0].aspam_activado != 0) {
        antispamworker(message);
      }
      //Leveling
      if (!contenido.startsWith(result[0].guild_prefix)) {
        if (!talkedRecently.has(`${message.author.id}_${message.guild.id}`)) {
          if (result[0].leveling_enabled != "0") {
            talkedRecently.add(`${message.author.id}_${message.guild.id}`);
            setTimeout(() => {
              talkedRecently.delete(`${message.author.id}_${message.guild.id}`);
            }, 60000);
            leveling(result, client, con, message, global);
          }
        }
      }

      // Respuestas personalizadas
      var consultarespuestacustom = "SELECT * FROM `guild_responses` WHERE `guild` = " + message.guild.id;
      con.query(consultarespuestacustom, function (err, result) {
        if (result) {
          if (result.hasOwnProperty(0)) {
            var buscarrespuesta = "SELECT * FROM `guild_responses` WHERE `guild` = '" + message.guild.id + "' AND `action` = '" + contenido + "'";
            con.query(buscarrespuesta, function (err, result) {
              if (result) {
                if (result.hasOwnProperty(0)) {
                  message.channel.send("<:respuestacustom:858671300024074240> " + result[0].returns);
                }
              }
            });
          }
        }
      });
    }
    else {
      guildcreate(con, message);
    }
  }
  )
});
