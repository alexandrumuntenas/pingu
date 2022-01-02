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

Disable this module using `/admin modules disable module: welcome`.
!!!

<!-- markdown-link-check-disable -->
| Command | Function | Example |
| --- | --- | --- |
| /welcomer viewconfig | Command to view the set configuration of the module. | /welcomer viewconfig |
| /welcomer setchannel channel: <channel> | Command to configure the welcome channel. (If it does not exist/work, the message is not sent). | /welcomer setchannel channel:#aeropuerto-internacional |
| /wecomer setmessage message: | Command to set the welcome message. | /welcomer message welcomemessage:{member} has joined {guild}. |
| /welcomer enablecards | Command to enable welcome cards. | /welcomer enableCards |
| /welcomer disablecards | Command to disable welcome cards. | /welcomer disableCards |
| /welcomer setbackground url: | Command to set the background image. | /welcomer setbackground url: https://myawesomesite.com/myawesomephoto.png |
| /welcomer overlaycolor hexcolor: | Command to configure the color of the overlay. | /welcomer overlaycolor hexcolor:#fff |
| /welcomer overlayopacity opacity: | Command to set the overlay opacity. | /welcomer overlayopacity opacity:50 |
| /welcomer overlayblur blur: | Command to set the overlay blur. | /welcomer overlayblur blur:25 |
| /welcomer test | Preview the welcome card | /welcomer test |
| /welcomer simulate | Simulate the event GuildMemberAdd (A.K.A. Check if everything is working as intended) | /welcomer simulate                                                          |
<!-- markdown-link-check-enable -->

![Sample greeting card with custom background and rounded avatar.](https://cdn.discordapp.com/attachments/925135972251881482/925135999149953074/yjjemZDfcZKRAjQlpsphBaGbxTSuhzuR.png)

![Sample greeting card with default background and square avatar.](https://cdn.discordapp.com/attachments/925135972251881482/925135999506456596/yFKHQgmSQsjGYdJsCbBotUxsUAmiNlgp.png)
