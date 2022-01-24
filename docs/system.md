---
order: 1000
icon: cpu
---

# System

> Configure the global aspects of Pingu, such as the prefix and its language.

The following commands can only be used by the server owner or by persons with the [MANAGE_GUILDS\*](https://discord.com/developers/docs/topics/permissions) permission.

| Command                               | Function                                                          | Example                                 |
| ------------------------------------- | ----------------------------------------------------------------- | --------------------------------------- |
| admin setprefix newprefix:            | Change the prefix used to activate the bot.                       | /admin setprefix newprefix: >           |
| admin setlanguage language:           | Change the language used in bot responses                         | !admin setlanguage en                   |
| admin modules enable module:          | Enables a module                                                  | !admin modules enable module: Welcomer  |
| admin modules disable module:         | Disable a module                                                  | !admin modules disable module: Welcomer |
| admin viewcnfcommands view true/false | Enables or disables the deployment of bot configuration commands. | /admin viewcnfcommands view true/false  |

==- Prefix Commands

| Command                               | Function                                                          | Example                                                                        |
| ------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| admin setprefix \<newprefix>          | Change the prefix used to activate the bot.                       | <p>!admin setprefix ></p><p></p><p>!admin setprefix .</p>                      |
| admin setlanguage \<language>         | Change the language used in bot responses                         | <p>!admin setlanguage en</p><p>!admin setlanguage es</p><p>!setlanguage fr</p> |
| admin modules enable \<módulo>        | Enables a module                                                  | !admin modules enable welcomer                                                 |
| admin modules disable \<módulo>       | Disable a module                                                  | !admin modules disable welcomer                                                |
| admin viewcnfcommands view true/false | Enables or disables the deployment of bot configuration commands. | /admin viewcnfcommands view true/false                                         |

==-

!!!
The default prefix is `!`, and the default language is `en` (English).
!!!

!!!
Remember to use the command `!update` if you are using for the first time the bot in your server.
!!!
