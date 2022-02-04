---
order: 99
icon: diff-added
---

# Welcome
> A wonderful way to welcome newcomers. Customize the message and welcome card to your liking.

In Pingu we have always wanted to give the user the option of being able to configure the messages and welcome signs to their liking.

The commands listed below can only be used by the server owner, or by persons with the [MANAGE_GUILD\*](https://discord.com/developers/docs/topics/permissions) permission.

!!!
Enable this module using `/admin modules enable module: welcomer`.

Disable this module using `/admin modules disable module: welcomer`.
!!!

<!-- markdown-link-check-disable -->
=== Interactions

| Command | Function | Example |
| --- | --- | --- |
| /welcome viewconfig | Command to view the set configuration of the module. | /welcome viewconfig |
| /welcome setchannel channel: <channel> | Command to configure the welcome channel. (If it does not exist/work, the message is not sent). | /welcome setchannel channel:#aeropuerto-internacional |
| /welcome setmessage message: | Command to set the welcome message. | /welcome setmessage message:{member} has joined {guild}. |
| /welcome configurecard sendcards: \<true/false> setbackgroundurl: \<URL> setoverlaycolor: \<Hex Color> setoverlayopacity: \<Opacity> title: \<text> subtitle: \<text> | Command to customize the welcome card | /welcome configurecard sendcards: true setoverlayopacity: 1 setoverlaycolor: #0AFFFF setbackgroundurl: https://myawesomestocksite.com/photo.png title: {member} has joined the server subtitle: {member_count} |
| /welcome configureroles list | List the roles that are granted when someone joins the guild. | /welcome configureroles list |
| /welcome configureroles add role: <role> | Add a role to grant when someone joins the guild. | /welcome configureroles add role: @newcomer |
| /welcome configureroles remove role: <role> | Remove a role to grant when someone joins the guild. | /welcome configureroles remove role: @newcomer |

==- Commands

| Command | Function | Example |
| --- | --- | --- |
| welcome viewconfig | Command to view the set configuration of the module. | !welcome viewconfig |
| welcome setchannel channel: <channel> | Command to configure the welcome channel. (If it does not exist/work, the message is not sent). | !welcome setchannel #aeropuerto-internacional |
| welcome setmessage message: | Command to set the welcome message. | !welcomer setmessage {member} has joined {guild}. |
| welcome configurecard viewconfig | Command to view the set configuration of the welcome card. | !welcome configurecard viewconfig |
| welcome configurecard sendcards \<true/false> | Command to enable or disable sending the welcome card. | !welcome configurecard sendcards true |
| welcome configurecard setbackgroundurl \<URL> | Command to set the background image of the welcome card. | !welcome configurecard setbackgroundurl https://myawesomestocksite.com/photo.png |
| welcome configurecard overlaycolor \<Hex Color> | Command to set the overlay color of the welcome card. | !welcome configurecard overlaycolor #0AFFFF |
| welcome configurecard overlayopacity \<Opacity> | Command to set the overlay opacity of the welcome card. | !welcome configurecard overlayopacity 1 |
| welcome configurecard title \<text> | Command to set the title of the welcome card. | !welcome configurecard title {member} has joined the server |
| welcome configurecard subtitle \<text> | Command to set the subtitle of the welcome card. | !welcome configurecard subtitle {member_count} |
| welcome configureroles list | List the roles that are granted when someone joins the guild. | !welcome configureroles list |
| welcome configureroles add <role> | Add a role to grant when someone joins the guild. | !welcome configureroles add @newcomer |
| welcome configureroles remove <role> | Remove a role to grant when someone joins the guild. | !welcome configureroles remove @newcomer |

===
<!-- markdown-link-check-enable -->

![Sample greeting card with custom background and rounded avatar.](https://cdn.discordapp.com/attachments/883335734608670720/928767503830757437/yboqcdLDOieWRDxPbUxUcWrLIuradzdc.png)
