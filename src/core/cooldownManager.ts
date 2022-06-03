import { existsSync } from "fs";
import Command from "../classes/Command";
import Consolex from "./consolex";

let JSON_Cooldown = {};

try {
  if (existsSync("./cooldowns.json")) {
    try {
      JSON_Cooldown = require("../cooldowns.json");
    } catch (error) {
      // comprobar si el error es SyntaxError
      if (error.code === "SyntaxError") {
        Consolex.debug(
          "CooldownManager: Cooldowns file is corrupted. Creating new one."
        );

        fs.writeFile("./cooldowns.json", JSON.stringify({}), (err) => {
          if (err) Consolex.gestionarError(err);
          Consolex.debug("CooldownManager: Cooldowns file created.");
        });
        JSON_Cooldown = {};
      }
    }
  } else {
    fs.writeFile("./cooldowns.json", "{}", (err) => {
      if (err) Consolex.gestionarError(err);

      Consolex.debug("CooldownManager: Cooldowns file has been created.");
      JSON_Cooldown = require("../cooldowns.json");
    });
  }
} catch (err) {
  Consolex.gestionarError(err);
}

const cooldown = { ...JSON_Cooldown };

class CooldownManager {
  cooldown: Object;
  constructor() {
    this.cooldown = cooldown;
    setInterval(() => {
      this.saveCooldownCollectionIntoJsonFile();
    }, 60000);
  }

  add(member, guild, command: Command) {
    this.cooldown[`${command.name}${member.id}${guild.id}`] =
      Date.now() + (command.cooldown || 10000);
    setTimeout(() => {
      delete this.cooldown[`${command.name}${member.id}${guild.id}`];
    }, command.cooldown || 10000);
  }

  check(member, guild, command: Command) {
    if (this.cooldown[`${command.name}${member.id}${guild.id}`] >= Date.now())
      return false;

    delete this.cooldown[`${command.name}${member.id}${guild.id}`];
    return true;
  }

  ttl(member, guild, command: Command) {
    return this.cooldown[`${command.name}${member.id}${guild.id}`] - Date.now();
  }

  saveCooldownCollectionIntoJsonFile() {
    fs.writeFile("./cooldowns.json", JSON.stringify(cooldown), (err) => {
      if (err) consolex.gestionarError(err);
      Consolex.debug("CooldownManager: Cooldowns have been saved.");
    });
  }
}

export default CooldownManager;
