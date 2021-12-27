---
order: 100
icon: comment
---

# Autoresponder
> Automatically respond to text messages from your users.

The commands listed below can only be used by the server owner, or by persons with the [MANAGE_GUILD\*](https://discord.com/developers/docs/topics/permissions) permission.

!!!
Enable this module using `/p2enmod module: autoresponder`.

Disable this module using `/p2dismod module: autoresponder`.
!!!

| Command| Function| Example|
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| /autoresponder | Comando base para la configuración de las respuestas personalizadas | /autoresponder              |
| /autoresponder create id:\<id> trigger:\<message that triggers the reply> reply:\<message to reply> | Command to add a new custom response. This will run a poll for the creation of the custom response. If you do not specify a custom ID, Pingu will generate a random one. | /autoresponder create id:hi trigger:hi reply:Hi! |
| /autoresponder remove id:\<id> | Command to remove custom response. | /autoresponder remove hi |