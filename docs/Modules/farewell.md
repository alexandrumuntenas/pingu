---
order: 97
icon: diff-removed
---

# Farewell
> They left... Give a farewell to those members who leave the server.

The commands listed below can only be used by the server owner, or by persons with the [MANAGE_GUILD\*](https://discord.com/developers/docs/topics/permissions) permission.

> Enable this module using `/bot modules enable module: farewell`.
>
> Disable this module using `/bot modules disable module: farewell`.

## Interactions

```javascript
/farewell viewconfig // View the current configuration
/farewell setchannel channel: <TextChannel> // Set the channel to send farewell messages to
/farewell setmessage message: <String> // Set the farewell message
```

## Commands

```javascript
farewell viewconfig // View the current configuration of the module.
farewell setchannel <TextChannel> // Configure the farewell channel.
farewell setmessage <String> // Set the farewell message.
```