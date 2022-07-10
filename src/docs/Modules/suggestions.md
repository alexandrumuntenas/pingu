---
order: 93
icon: light-bulb
---

# Suggestions (PRW)

>  Do you want to allow your users to send you suggestions? Pingu can help you. This module comes with commands so you can set up a workflow quickly.

!!!warning
This module is currently in the preview phase, that is to say, in a phase in which the public's opinion is very important to improve it. If you want to make any suggestion to improve this module, please use the suggestion channel of our Discord server.
!!!

## Module Configuration


The commands listed below can only be used by the server owner, or by persons with the [MANAGE_GUILD\*](https://discord.com/developers/docs/topics/permissions) permission.

> Enable this module using `/bot modules enable module: suggestions`.
>
> Disable this module using `/bot modules disable module: suggestions`.

```javascript

// Enable DM updates
/suggestions dmupdates enable: <Boolean>

// Set the channel to send suggestions updates to
/suggestions setlogs channel: <TextChannel>

// Set the channel where newly created suggestions are sent
/suggestions setchannel channel: <TextChannel>

```

## Commands to handle suggestions

```javascript
// Approve a suggestion
/suggestion approve suggestion: <String[The Suggestion ID]>

// Reject a suggestion
/suggestion reject suggestion: <String[The Suggestion ID]>

// Add a note to a suggestion
/suggestion addnote suggestion: <String[The Suggestion ID]> note: <String[The Note]>
```

## Users Commands

Users should use the `/suggest` interaction or the `suggest` command to submit suggestions.

And the interaction `/mysuggestions` or the command `mysuggestions` to see the suggestions that the user has submitted.

## How does it work?
### DM Updates

Every action that is taken with a person's suggestion, Pingu will notify (if configured) via DM to its author. DM activity logging is enabled by using the `/suggestions dmupdates enable: true` interaction.

Each time one of the following actions related to a suggestion happens:
- Sending suggestion
- Suggestion approval
- Suggestion rejection
- Note added by the staff to the suggestion

The author will receive a DM, if enabled.

### Suggestions Logging

When a suggestion is approved or rejected, or a note has been added to it, if a "log" channel has been configured, the bot will send activity updates to that channel. In case it does not exist, notifications will be sent to the channel where new suggestions are created, in which the "Suggestion creation" message will be updated. To enable this, please use the `/suggestions setlogs channel: <TextChannel>` interaction.

### Approving or Rejecting Suggestions

To approve or reject a suggestion, use their respective commands `/suggestion approve suggestion: <Suggestion ID>` or `/suggestion reject suggestion: <Suggestion ID>`.

### Adding Notes to Suggestions

To add a note to a suggestion, use the `/suggestion addnote suggestion: <Suggestion ID> note: <Note>` command. After adding the note, if DM updates are enabled, the author will receive a message. Also, if the log channel is configured, the event will be logged.