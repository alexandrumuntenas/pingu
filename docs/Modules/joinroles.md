---
order: 98
icon: diff-added
---

# Join Roles
> It offers new users certain roles.

The commands listed below can only be used by the server owner, or by persons with the [MANAGE_GUILD\*](https://discord.com/developers/docs/topics/permissions) permission.

!!!
Enable this module using `/p2enmod module: joinroles`.

Disable this module using `/p2dismod module: joinroles`.
!!!

| Commands | Function | Example |
| ------------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- 
| !joinroles                                  | Comando base para la configuración del módulo                                        | !joinroles                                                                                  |
| !joinroles list                             | Comando para listar todos los roles configurados para otorgar a los nuevos usuarios. | !joinroles list                                                                             |
| !joinroles add \<role> (role2, role3..)     | Comando para añadir rol de bienvenida                                                | <p>!join add @miembro </p><p>!join add @miembros @verificados @personasdivertidas</p>       |
| !joinroles remove \<role> (role2, role3...) | Comando para eliminar rol de bienvenida                                              | <p>!join remove @miembro </p><p>!join remove @miembros @verificados @personasdivertidas</p> |