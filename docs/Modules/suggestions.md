---
order: 93
icon: git-pull-request-draft
---

# Suggestions

>  Do you want to allow your users to send you suggestions? Pingu can help you. This module comes with commands so you can set up a workflow quickly.

The commands listed below can only be used by the server owner, or by persons with the [MANAGE_GUILD\*](https://discord.com/developers/docs/topics/permissions) permission.

!!!warning
This module can be only used using Slash Commands.
!!!

| Command | Function | Example |
| -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| suggestions setchannel channel:\<Channel>| Command where the suggestions are sent. | /suggestions setchannel channel:#suggestions |
| suggestions setrevisedchannel channel:\<Channel> | Command where revised suggestions are sent. | /suggestions revisedchannel channel:#revisedsuggestions |

## Commands to handle suggestions

| Command | Function | Example |
| -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| suggestion approve id:\<ID> | Command to approve a suggestion. | /suggestion approve id:1234567890 |
| suggestion reject id:\<ID> reason:\<Reason>| Command to dismiss a suggestion. | !suggestion reject id:1234567890 reason:Something interesting |

## Users Commands

Users should use the `/suggest` command to submit suggestions.