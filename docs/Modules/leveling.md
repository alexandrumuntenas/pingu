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

> Enable this module using `/bot modules enable module: leveling`.
>
> Disable this module using `/bot modules disable module: leveling`.

## Interactions

```javascript
// View the current configuration
/leveling viewconfig

// Configure the rankup
// "This channel" option will take the channel Where this interaction is used as the rankup channel
/leveling rankup channel channel: <String(This channel/Same channel where message is sent/Send to user DM/Disabled)> message: <String> difficulty: <Integer>

// Configure the cards
/leveling configurecards backgroundurl: <URL> overlayopacity: <Integer> overlaycolor: <Hex Color>

// Reset the leaderboard
/leveling resetleaderboard (From 22T2)
```
## User commands

Users will be able to use /rank or `rank` to see their level card and /leaderboard or `leaderboard` to see the server ranking.

![Rank Card Example](https://cdn.discordapp.com/attachments/926103260111179836/928779386059104347/imCnpLagomxItWHwTgagZWgjrjxHQIpe.png)