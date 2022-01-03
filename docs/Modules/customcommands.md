---
order: 96
icon: reply
---

# Custom Commands
> Do you have a Minecraft server and want your players to get the IP through the "ip" command? Do you want your server members to enter your YouTube channel through the "youtube" command?

The commands listed below can only be used by the server owner, or by persons with the [MANAGE_GUILD\*](https://discord.com/developers/docs/topics/permissions) permission.

!!!
Enable this module using `/admin modules enable module: Custom Commands`.

Disable this module using `/admin modules disable module: Custom Commands`.
!!!

| Command | Function | Example |
| --- | --- | --- |
| /ccmd | Base command for configuration and creation of custom commands. | /ccmd |
| /ccmd create command: response:| command to create a custom command. | /ccmd create command:ip response:mc.myawesomeserver.com |
| /ccmd remove command: | Command to remove a custom command. | /ccmd remove command: ip |

Custom commands can only be executed through prefixes. If I create the `ip` command, I will be able to execute it using, for example, `-ip`, if `-` is the configured prefix.