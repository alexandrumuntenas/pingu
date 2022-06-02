import Consolex from "./consolex";
import Command from "../classes/Command";

import { Collection, SlashCommandBuilder } from "discord.js";
import { lstatSync } from "fs";
class CommandsManager {
  commands: Collection<string, Command>;

  constructor() {
    this.commands = new Collection();
  }

  add(command: Command) {
    this.commands.set(command.name, command);
  }

  remove(command: Command) {
    this.commands.delete(command.name);
  }

  loadCommands(directory) {
    readdirSync(directory).forEach((file) => {
      const path = `${directory}/${file}`;

      if (file.endsWith(".js") && !file.endsWith("dev.js")) {
        const command = require(`.${path}`);

        if (Object.prototype.hasOwnProperty.call(command, "name")) {
          if (Object.prototype.hasOwnProperty.call(command, "interaction")) {
            command.interaction.setName(command.name);
          } else {
            command.interaction = new SlashCommandBuilder().setName(
              command.name
            );
          }

          i18n.avaliableLocales.forEach((locale) => {
            command.interaction.setDescriptionLocalized(
              locale,
              i18n.obtenerTraduccion(locale, command.name)
            );
          });

          this.add(
            new Command({
              name: command.name,
              description: command.description,
              module: command.module,
              cooldown: command.cooldown,
              parameters: command.parameters,
              interaction: command.interaction,
              runInteraction: command.runInteraction,
              runCommand: command.runCommand,
            })
          );

          Consolex.success(`CommandsManager: Comando ${file} cargado`);
        } else {
          consolex.warn(
            `CommandsManager: ${file} no se ha cargado porque no tiene una propiedad "name"`
          );
        }
      } else if (lstatSync(path).isDirectory()) this.loadCommands(path);
    });
  }

  getCommand(name: string) {
    return this.commands.get(name);
  }

  getCommands() {
    return this.commands;
  }

  getCommandsByModule(module: string) {
    return this.commands.filter((command) => command.module === module);
  }

  getCommandsByModuleAndName(module: string, name: string) {
    return this.commands.filter(
      (command) => command.module === module && command.name === name
    );
  }
}

export default CommandsManager;
