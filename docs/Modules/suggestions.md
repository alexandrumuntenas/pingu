---
order: 93
icon: light-bulb
---

# Suggestions (PRW)

!!!warning
This module is currently in the preview phase, that is to say, in a phase in which the public's opinion is very important to improve it. If you want to make any suggestion to improve this module, please use the suggestion channel of our Discord server.
!!!

>  Do you want to allow your users to send you suggestions? Pingu can help you. This module comes with commands so you can set up a workflow quickly.

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