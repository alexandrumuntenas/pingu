---
order: 92
icon: broadcast
---

# Minecraft Server Status (PRW)

> Do you have a Minecraft server and would you like to have a gallery of tools to get information about it?

!!!warning
This module is currently in the preview phase, that is to say, in a phase in which the public's opinion is very important to improve it. If you want to make any suggestion to improve this module, please use the suggestion channel of our Discord server.
!!!

## Module Configuration

The commands listed below can only be used by the server owner, or by persons with the [MANAGE_GUILD\*](https://discord.com/developers/docs/topics/permissions) permission.

### Interactions

```javascript
// Set the default host for the Minecraft Server Status module.
/mcsrvstatus setdefaulthost host: <String[The Host]> port: <Number[The Port]>

// Set the channel where the Minecraft Server Status panel will be sent.
/mcsrvstatus setpanelchannel channel: <TextChannel>

// Set the sidebar player count channel.
/mcsrvstatus sidebarplayercount channel: <VoiceChannel>
```

## User Commands

Users should use the `/mcping` or `mcping` command to obtain information about the server that has been configured.

To get information about another server, use `/mcserver ip_or_address: <String[The IP or Address]> port: <Number[The Port]>` or `mcserver <ip or address> <port>`.