---
order: 95
icon: comment-discussion
---

# Leveling
> The more you write, the more you earn.

## The module inside

Every time a user writes a message, Pingu generates a random number from 15 to 25 and adds it to the user's total experience. To _avoid_ abuse, there is a timeout of 1 minute, in which the user will not be able to earn more XP.

To calculate the experience needed to advance in level, we must calculate the multiplication of 100 times the difficulty times the level squared. Seen with mathematical formulas, it would be like this:

$$
Total Experience = (level^2 * difficulty) * 100
$$

If this condition is met, the user advances in level.

## Module configuration

The commands listed below can only be used by the server owner, or by persons with the [MANAGE_GUILD\*](https://discord.com/developers/docs/topics/permissions) permission.

!!!
Enable this module using `/admin modules enable module: levels`.

Disable this module using `/admin modules disable module: levels`.
!!!

| Command | Function | Example |
| -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| levels | Base command to configure the levels module. | /levels |
| levels viewconfig | Command to query the current configuration of the module.| /levels viewconfig |
| levels setrankupchannel | Command to modify the channel of the level advance messages. | /levels setrankupchannel channel: \<Disabled/Same Channel Were Message is Sent/This Channel> |
| levels setrankupmessage message: | Command to modify the level advance message.| /levels setrankupmessage message: {member} got a new level!  |
| levels setdifficulty difficulty: | Command to modify the difficulty of the module. | /levels difficulty difficulty: 2 |
| levels setbackground url: | Command to set the custom background | /levels setbackground url: https://site.com/myphoto.png |
| levels overlayblur blur: | Command to customize the blur of the range card overlay. | /levels overlayblur blur: 56 | 
| levels overlayopacity opacity: | Command to customize the opacity of the range card overlay. | /levels overlayopacity opacity: 56 |
| levels overlaycolor hexcolor: | Command to customize the opacity of the range card overlay. | /levels overlaycolor: #FFF |
| levels simulate | Command to simulate the event GuildMemberAdd (A.K.A. Check if everything is working as intended) | !levels simulate |

!!!
With the integration of Slash Commands, the creation of custom commands becomes much easier.
!!!

## User commands

Users will be able to use /rank to see their level card and /levelstop to see the server ranking.