import { Interaction, PermissionsBitField, SlashCommandBuilder } from 'discord.js'
import { PinguMessage } from '../events/messageCreate'
class Command {
  name: string
  description: string
  module?: string
  cooldown?: number
  parameters?: string
  permissions?: Array<PermissionsBitField | bigint>
  interaction?: SlashCommandBuilder
  runInteraction?: Function
  runCommand?: Function

  constructor (command: {
    name: string;
    description: string;
    module?: string;
    cooldown?: number;
    parameters?: string;
    permissions?: Array<PermissionsBitField | bigint>,
    interaction?: SlashCommandBuilder;
    runInteraction?: (interaction: Interaction) => void;
    runCommand?: (message: PinguMessage) => void;
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
