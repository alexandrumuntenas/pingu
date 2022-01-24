---
order: 98
icon: diff-added
---

# Join Roles

> It offers new users certain roles.

The commands listed below can only be used by the server owner, or by persons with the [MANAGE_GUILD\*](https://discord.com/developers/docs/topics/permissions) permission.

!!!
Enable this module using `/admin modules enable module: joinroles`.

Disable this module using `/admin modules disable module: joinroles`.
!!!

| Commands                | Function                                                        | Example                             |
| ----------------------- | --------------------------------------------------------------- | ----------------------------------- |
| /joinroles              | Base command for module configuration                           | /joinroles                          |
| /joinroles list         | Command to list all the roles configured to grant to new users. | /joinroles list                     |
| /joinroles add role:    | Add new role to grant to new users.                             | <p>/joinroles add role: @member</p> |
| /joinroles remove role: | Remove role to grant to new users.                              | <p>/joinroles remove @member </p>   |
