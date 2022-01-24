---
order: 97
icon: diff-removed
---

# Farewell

> They left... Give a farewell to those members who leave the server.

The commands listed below can only be used by the server owner, or by persons with the [MANAGE_GUILD\*](https://discord.com/developers/docs/topics/permissions) permission.

!!!
Enable this module using `/admin modules enable module: farewell`.

Disable this module using `/admin modules disable module: farewell`.
!!!

| Command                                          | Function                                                                                         | Example                                                |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------ |
| /farewell viewconfig                             | Command to view the set configuration of the module.                                             | /farewell viewconfig                                   |
| /farewell setchannel channel: <farewell channel> | Command to configure the farewell channel. (If it does not exist/work, the message is not sent). | /farewell setchannel channel:#aeropuerto-internacional |
| /wecomer setmessage message:                     | Command to set the farewell message.                                                             | /farewell setmessage message:{member} left {guild}.    |
| /farewell simulate                               | Simulate the event GuildMemberRemove (A.K.A. Check if everything is working as intended)         | /farewell simulate                                     |
