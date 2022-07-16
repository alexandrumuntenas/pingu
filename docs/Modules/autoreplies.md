---
order: 100
icon: reply
---

# Autoreplies
> Automatically respond to text messages from your users.

The commands listed below can only be used by the server owner, or by persons with the [MANAGE_GUILD\*](https://discord.com/developers/docs/topics/permissions) permission.

> Enable this module using `/bot modules enable module: autoreplies`.
>
> Disable this module using `/bot modules disable module: autoreplies`.

## Interactions

```javascript
// Create a new autoreply
/autoreplies create trigger: <String> reply: <String> sendinembed: <Boolean> sendinembed_title: <String> sendinembed_description: <String> sendinembed_thumbnail: <String> sendinembed_image: <Boolean> sendinembed_url: <URL> sendinembed_color: <HexColor> role: <Role>

// Delete an autoreply
/autoreplies remove trigger: <String>

// View the guild autoreplies
/autoreplies list
```
