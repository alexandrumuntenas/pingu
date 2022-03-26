---
order: 99
icon: diff-added
---

# Welcome
> A wonderful way to welcome newcomers. Customize the message and welcome card to your liking.

In Pingu we have always wanted to give the user the option of being able to configure the messages and welcome signs to their liking.

The commands listed below can only be used by the server owner, or by persons with the [MANAGE_GUILD\*](https://discord.com/developers/docs/topics/permissions) permission.

> Enable this module using `/bot modules enable module: welcome`.
>
> Disable this module using `/bot modules disable module: welcome`.

## Interactions

```javascript
// View the current configuration
/welcome viewconfig

// Set the channel to send welcome messages to
/welcome setchannel channel: <TextChannel>

// Set the welcome message
/welcome setmessage message: <Message>

// Configure the welcome card
/welcome configurecard sendcards: <Boolean> setbackgroundurl: <URL> setoverlaycolor: <Hex Color> setoverlayopacity: <Integer> title: <String> subtitle: <String>

// View the list of roles that can be assigned to new members
/welcome configureroles list

// Add a role to the list of roles that can be assigned to new members
/welcome configureroles add role: <role>

// Remove a role from the list of roles that can be assigned to new members
/welcome configureroles remove role: <role>
```

# Commands

```javascript
// View the current configuration of the module.
welcome viewconfig

// Command to configure the welcome channel. (If it does not exist/work, the message is not sent)
welcome setchannel <TextChannel>

// Command to set the welcome message
welcome setmessage <String ···>

// Command to view the current configuration of the welcome card
welcome configurecard viewconfig

// Command to enable or disable sending the welcome card
welcome configurecard sendcards <Boolean>

// Command to set the background image of the welcome card
welcome configurecard setbackgroundurl <URL>

// Command to set the overlay color of the welcome card
welcome configurecard setoverlaycolor <Hex Color>

// Command to set the overlay opacity of the welcome card
welcome configurecard setoverlayopacity <Integer>

// Command to set the title of the welcome card
welcome configurecard title <String ···>

// Command to set the subtitle of the welcome card
welcome configurecard subtitle <String ···>

// List the roles that are granted when someone joins the guild
welcome configureroles list

// Add a role to the list of roles that are granted when someone joins the guild
welcome configureroles add <Role>

// Remove a role from the list of roles that are granted when someone joins the guild
welcome configureroles remove <Role>
```

![Welcome card with custom background.](https://cdn.discordapp.com/attachments/883335734608670720/928767503830757437/yboqcdLDOieWRDxPbUxUcWrLIuradzdc.png)
