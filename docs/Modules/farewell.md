---
order: 97
icon: diff-removed
---

# Farewell
> They left... Give a farewell to those members who leave the server.

The commands listed below can only be used by the server owner, or by persons with the [MANAGE_GUILD\*](https://discord.com/developers/docs/topics/permissions) permission.

!!!
Enable this module using `/p2enmod module: farewell`.

Disable this module using `/p2dismod module: farewell`.
!!!

| Comando                                     | Funcion                                                                                         | Ejemplo                                                                     |
|---------------------------------------------|-------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------|
| /farewell viewconfig                        | Command to view the set configuration of the module.                                            | /welcomer viewconfig                                                        |
| /farewell channel farewellchannel: <farewell> | Command to configure the farewell channel. (If it does not exist/work, the message is not sent). | /welcomer channel farewellchannel:#aeropuerto-internacional                 |
| /wecomer message farewellmessage:            | Command to set the farewell message.                                                             | /farewell farewell farewellmessage:{member} left {guild}.               |
| /farewell simulate                          | Simulate the event GuildMemberRemove (A.K.A. Check if everything is working as intended)           | /farewell simulate                                                          |
