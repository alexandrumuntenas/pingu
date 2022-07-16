class Command {
  name
  description
  module
  cooldown
  parameters
  permissions
  interaction
  runInteraction
  runCommand
  constructor (command) {
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
