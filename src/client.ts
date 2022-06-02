/* * * * * * * * * * * * * * * * * * * * *
 * Proyecto: Pingu                       *
 * Autor: Alexandru Muntenas             *
 * Licencia: BSL-1                       *
 * * * * * * * * * * * * * * * * * * * * *
 * Versión desarrollo: NEXT              *
 * Versión pública: 22T4                 *
 * * * * * * * * * * * * * * * * * * * * */

import "dotenv/config";
import * as Discord from "discord.js";
import { GatewayIntentBits } from "discord-api-types/v10";
import Consolex from "./core/consolex";

const Client = new Discord.Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.MessageContent,
  ],
  partials: [
    Discord.Partials.Reaction,
    Discord.Partials.Message,
    Discord.Partials.User,
  ],
  ws: { properties: { $browser: "Discord iOS" } },
});

if (process.env.ENTORNO === "publico") {
  Consolex.warn("Iniciando sesión como el bot público.");
  Client.login(process.env.PUBLIC_TOKEN);
} else {
  Consolex.warn("Iniciando sesión como el bot de desarrollo.");
  Client.login(process.env.INSIDER_TOKEN);
}

process.on("exit", () => {
  Client.destroy();
});

export default Client;
