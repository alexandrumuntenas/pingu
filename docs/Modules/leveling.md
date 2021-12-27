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
Enable this module using `/p2enmod module: levels`.

Disable this module using `/p2dismod module: levels`.
!!!

| Command | Function | Example |
| -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| levels | Base command to configure the levels module. | !levels |
| levels viewconfig | Command to query the current configuration of the module.| !levels viewconfig |
| levels rankUpChannel | Command to modify the channel of the level advance messages. | !levels rankUpChannel #level-up |
| !levels rankUpChannel none | Command to disable level advance messages. | !levels rankUpChannel none |
| levels rankUpChannel same | Command to set the level messages to be sent to the same channel on which the running message is sent. | levels rankUpChannel same | 
| levels rankUpMessage | Command to modify the level advance message.| !levels rankUpMessage |
| levels difficulty \<difficulty> | Command to modify the difficulty of the module. | !levels difficulty 2 |
| levels customBackground \<url>| Command to set the custom background | !levels customBackground https://site.com/myphoto.png |
| levels overlayBlur \<quantity> | Command to customize the blur of the range card overlay. | !levels overlayBlur 56 | 
| levels overlayOpacity \<quantity> | Command to customize the opacity of the range card overlay. | !levels overlayOpacity 56 |
| levels simulate | Command to simulate the event GuildMemberAdd (A.K.A. Check if everything is working as intended) | !levels simulate |

!!!
With the integration of Slash Commands, the creation of custom commands becomes much easier.
!!!