import { BitField, SlashCommandBuilder } from 'discord.js'
class Command {
  name: string
  description: string
  module: string
  cooldown: number
  parameters: string
  permissions: Array<typeof BitField.Flags>
  interaction: SlashCommandBuilder
  runInteraction: Function
  runCommand: Function

  constructor (command: {
    name: string;
    description: string;
    module?: string;
    cooldown?: number;
    parameters?: string;
    permissions?: Array<typeof BitField.Flags>;
    interaction: SlashCommandBuilder;
    runInteraction: (interaction) => void;
    runCommand: (message) => void;
  }) {
    this.name = command.name
    this.description = command.description
    this.module = command.module
    this.cooldown = command.cooldown
    this.parameters = command.parameters
    this.permissions = command.permissions
    this.interaction = command.interaction
    this.runInteraction = command.runInteraction
    this.runCommand = command.runCommand
  }
}

export default Command
