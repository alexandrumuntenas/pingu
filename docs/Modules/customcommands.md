---
order: 96
icon: reply
---

# Custom Commands
> Do you have a Minecraft server and want your players to get the IP through the "ip" command? Do you want your server members to enter your YouTube channel through the "youtube" command?

The commands listed below can only be used by the server owner, or by persons with the [MANAGE_GUILD\*](https://discord.com/developers/docs/topics/permissions) permission.

> Enable this module using `/bot modules enable module: customcommands`.
>
> Disable this module using `/bot modules disable module: customcommands`.

```javascript
/customcommands create name: <String> reply: <String> sendinembed: <Boolean> sendinembed_title: <String> sendinembed_description: <String> sendinembed_thumbnail: <String> sendinembed_image: <Boolean> sendinembed_url: <URL> sendinembed_color: <HexColor> role: <Role> channel: <TextChannel> sendtodm: <Boolean> // Create a new custom command
/customcommands remove command: <String> // Delete a custom command
```

!!!success
Custom commands can only be executed through prefixes. If I create the `ip` command, I will be able to execute it using, for example, `-ip`, if `-` is the configured prefix.
!!!