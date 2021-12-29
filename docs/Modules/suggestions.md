---
order: 93
icon: git-pull-request-draft
title: Suggestions
---

# Suggestions [!badge Not in production]

>  Do you want to allow your users to send you suggestions? Pingu can help you. This module comes with commands so you can set up a workflow quickly.

The commands listed below can only be used by the server owner, or by persons with the [MANAGE_GUILD\*](https://discord.com/developers/docs/topics/permissions) permission.

| Command | Function | Example |
| -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| suggestions viewconfig | Command to query the current configuration of the module. | /suggestions viewconfig |
| suggestions setwaitchannel channel:\<Channel>| Command where the suggestions are sent. | /suggestions setwaitchannel channel:#suggestions |
| suggestions approvedchannel channel:\<Channel> | Command where approved suggestions are sent. | /suggestions approvedchannel:#approvedsuggestions |
| suggestions approve id:\<ID> | Command to approve a suggestion. | /suggestions approve id:1234567890 |
| suggestions dismiss id:\<ID> reason:\<Reason>| Command to dismiss a suggestion. | !suggestions deny id:1234567890 reason:Something interesting |

=== Prefix Commands

| Command | Function | Example |
| -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| suggestions | Base command to configure the suggestions module. | !suggestions |
| suggestions viewconfig | Command to query the current configuration of the module. | !suggestions viewconfig |
| suggestions channel | Command where the suggestions are sent. | !suggestions channel #suggestions |
| suggestions approvedchannel none | Command where approved suggestions are sent. | !suggestions channel none |
| suggestions approve \<ID> | Command to approve a suggestion. | !suggestions approve 1234567890 |
| suggestions dismiss \<ID> \<Reason>| Command to deny a suggestion. | !suggestions deny 1234567890 |

===

## Users Commands

Users should use the `/suggest` or `suggest` command to submit suggestions.