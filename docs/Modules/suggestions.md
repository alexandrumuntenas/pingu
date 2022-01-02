---
order: 93
icon: git-pull-request-draft
---

# Suggestions

>  Do you want to allow your users to send you suggestions? Pingu can help you. This module comes with commands so you can set up a workflow quickly.

The commands listed below can only be used by the server owner, or by persons with the [MANAGE_GUILD\*](https://discord.com/developers/docs/topics/permissions) permission.

!!!
Enable this module using `/admin modules enable module: suggestions`.

Disable this module using `/admin modules disable module: suggestions`.
!!!

!!!warning
This module can be only used using Slash Commands.
!!!

| Command | Function | Example |
| -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| /suggestions viewconfig | Command to view the acutal config of the module. | /suggestions viewconfig |
| /suggestions setchannel channel:\<Channel>| Command to set where the suggestions are sent. | /suggestions setchannel channel:#suggestions |
| /suggestions unsetchannel | Command to unset the suggestions channel. | /suggestions unsetchannel |
| /suggestions setrevisedchannel channel:\<Channel> | Command to set where revised suggestions are sent. | /suggestions revisedchannel channel:#revisedsuggestions |
| /suggestions unsetrevisedchannel | Command to unset the revised suggestions channel. | /suggestions unsetrevisedchannel |

## Commands to handle suggestions

| Command | Function | Example |
| -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| /suggestion approve id:\<ID> | Command to approve a suggestion. | /suggestion approve id:1234567890 |
| /suggestion reject id:\<ID> reason:\<Reason>| Command to dismiss a suggestion. | /suggestion reject id:1234567890 reason:Something interesting |

## Users Commands

Users should use the `/suggest` command to submit suggestions.