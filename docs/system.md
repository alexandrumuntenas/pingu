---
order: 1000
icon: cpu
---

# System
> Configure the global aspects of Pingu, such as the prefix and its language.


The following commands can only be used by the server owner or by persons with the [MANAGE_GUILDS\*](https://discord.com/developers/docs/topics/permissions) permission.

## Interactions

```javascript
/bot setprefix newprefix: <String> // Change the prefix
/bot setlanguage language: <English/Spanish> // Change the language
/bot modules enable module: <Module> // Enable a module
/bot modules disable module: <Module> // Disable a module
/bot modules viewconfig // View if the modules are enabled or disabled
/bot interactions update // Update the interactions of the guild
```

## Commands
```javascript
bot setprefix <prefix> // Change the prefix
bot setlanguage <language[en/es]> // Change the language
bot modules enable <Module> // Enable a module
bot modules disable <Module> // Disable a module
bot modules viewconfig // View if the modules are enabled or disabled
bot updateinteractions <Boolean> // Update the interactions of the guild
```

!!!
The default prefix is `!`, and the default language is `es` (Spanish).
!!!

!!!
Remember to use the command `@Pingu bot updateinteractions` if you are using for the first time the bot in your server.
!!!