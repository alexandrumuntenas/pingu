---
order: 1000
icon: cpu
---

# System
> Configure the global aspects of Pingu, such as the prefix and its language.


The following commands can only be used by the server owner or by persons with the [MANAGE_GUILDS\*](https://discord.com/developers/docs/topics/permissions) permission.

## Interactions

```javascript
// Change the prefix
/bot setprefix newprefix: <String>

// Change the language
/bot setlanguage language: <English/Spanish>

// Enable a module
/bot modules enable module: <Module>

// Disable a module
/bot modules disable module: <Module>

// View if the modules are enabled or disabled
/bot modules viewconfig

// Update the interactions of the guild
/bot interactions update
```

## Commands
```javascript
// Change the prefix
bot setprefix <prefix>

// Change the language
bot setlanguage <language[en/es]>

// Enable a module
bot modules enable <Module>

// Disable a module
bot modules disable <Module>

// View if the modules are enabled or disabled
bot modules viewconfig

// Update the interactions of the guild
bot updateinteractions <Boolean>
```

!!!
If you are using the bot for the first time, you can use it's default prefix `!`, or by mentioning the bot. The default language is `es` (Spanish). I suggest using the command `@Pingu bot updateinteractions` if you are using for the first time the bot in your server.
!!!