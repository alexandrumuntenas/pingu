---
order: 99
icon: diff-added
---

# Welcomer
> A wonderful way to welcome newcomers. Customize the message and welcome card to your liking.

In Pingu we have always wanted to give the user the option of being able to configure the messages and welcome signs to their liking.

The commands listed below can only be used by the server owner, or by persons with the [MANAGE_GUILD\*](https://discord.com/developers/docs/topics/permissions) permission.

!!!
Enable this module using `/admin modules enable module: welcomer`.

Disable this module using `/admin modules disable module: welcomer`.
!!!

<!-- markdown-link-check-disable -->
| Command | Function | Example |
| --- | --- | --- |
| /welcomer viewconfig | Command to view the set configuration of the module. | /welcomer viewconfig |
| /welcomer setchannel channel: <channel> | Command to configure the welcome channel. (If it does not exist/work, the message is not sent). | /welcomer setchannel channel:#aeropuerto-internacional |
| /wecomer setmessage message: | Command to set the welcome message. | /welcomer message welcomemessage:{member} has joined {guild}. |
| /welcomer enablecards | Command to enable welcome cards. | /welcomer enableCards |
| /welcomer disablecards | Command to disable welcome cards. | /welcomer disableCards |
| /welcomer configurecard setbackgroundurl: \<URL> setoverlaycolor: \<Hex Color> setoverlayopacity: \<Opacity> | Command to customize the welcome card | /welcomer configurecard setoverlayopacity: 1 setoverlaycolor: #0AFFFF setbackgroundurl: https://myawesomestocksite.com/photo.png |
| /welcomer previewcard | Preview the welcome card | /welcomer previewcard |
| /welcomer simulate | Simulate the event GuildMemberAdd (A.K.A. Check if everything is working as intended) | /welcomer simulate                                                          |
<!-- markdown-link-check-enable -->

![Sample greeting card with custom background and rounded avatar.](https://cdn.discordapp.com/attachments/883335734608670720/928767503830757437/yboqcdLDOieWRDxPbUxUcWrLIuradzdc.png)
