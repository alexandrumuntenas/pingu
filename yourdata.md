---
order: 1001
icon: database
label: Pingu and the data
---

# The story of how Pingu takes your data and processes it.

Everything you do with Pingu is recorded. But recorded in a peculiar way. If we look at Pingu's code, we can see that even the statistics that could be sent to Statcord are privatized.

Since I started working on Pingu, I had a rule: "Whatever it is, whoever uses the bot, don't be surprised by the bad, but by the good". Even if I put it this way, it may seem very nice and rosy to look good in front of the public. I'm telling you, it's like that.

Pingu uses Sentry to register all the errors that may arise and Top.GG to publish statistical data of the bot's growth (only number of servers and number of instances it has).

In the operation of the bot, we can see in numerous occasions (if not all), how I register each action in Sentry. With Sentry only the action is registered, but not who has executed the action.

Let's get down to what you are really interested in... what is stored in the Pingu database about you?
Guild ID, User ID, Role ID, Message ID, Message Content, and blah blah blah blah blah... that seems pretty shocking, doesn't it? The following is a full explanation of the use of each data and why we store it, told in a way, I hope, very entertaining and that you can understand it very easily.

Not for another, but 99% of the neologisms (specialized terms) that are used when writing a privacy policy, I do not understand them. And besides, everyone is supposed to understand what happens to their data, right?

## Chapter 1: The Guild ID

Let's start with the first chapter of our little story. We talked about the Guild ID, an identifier that identifies (it is the function of an identifier) the Discord servers.

When Pingu is added to a server, in our database (Maria DB), a record is added in which the bot modules are automatically configured.
The Guild ID is not only limited to the use of configuration (language, prefixes, etc.). Through the Guild ID, we can identify all the data that the modules have registered in our database about a server.

In the level system, when a user chats and the module is active, a record is added or updated in the database, in which a level or experience is added. In the "datasheet", Pingu first picks all data from a server and then, in the case of leveling, takes the record of the specific user.

This search operation happens with all modules in which the user's interaction with the bot is involved. Moderation, levels, economy, and blah blah blah blah blah.

When Pingu is kicked out of a server, it takes from all the "datasheets" the server records and deletes them.

## Chapter 2: The User ID

We talked about the User ID, the identifier that identifies all Discord users. Each user has his own, for example, mine is 827199539185975417.

Before I commented the intervention of the Guild ID, and how the data search was made. The use of the User ID is to identify, for example, the level of a user, his inventory, the amount of money (FALSE) that he has, his suggestions... And it is only limited to that.

If you leave a server on which Pingu is on, all your data is removed from the database, except for the moderation data, which is kept until either the server is removed, or the server kicks the bot out.

## Chapter 3: The Role ID

The Role ID is used to identify the roles. Pingu stores these identifiers to know which role to interact with.

For example, when we talk in the economy module, there is an option in which you can create a product to buy a role. When the user purchases the product of the role (Guild ID and User ID are also involved), the bot searches in its "datasheet" for the specific product and the role to be granted in its metadata. It then searches for it and gives it to the user and adds it to its inventory.

In future modules, such as Reaction Roles, we will see that the Role ID will be necessary to know what role the bot should give when reacting with X emoji.

## Chapter 4 & 5: The Message Content and Message ID

Well, let's get to what may cause the most controversy. Why on earth does Pingu store the content of my messages?

We don't really store it, but we do use it for custom replies. The content of the message is looked up in the "datasheet" of the custom replies to answer your message, in case there is something configured. We are not interested in storing the content of the message.

First of all, we're not interested in storing your conversations about "why are dogs better than cats?" (by the way, I am of the team that favors cats...) and any other subject; and the second, because it would be storing unnecessary information in the database, which would occupy unnecessary space, which can be useful for other data.

Each message in Discord is identified by a unique identifier. There is an occasion, that I can remember, in which the ID of the message is used, and it is in the module of the suggestions.

When a user makes a suggestion, the bot processes his suggestion and sends it to a specific suggestion channel. When it sends it, it stores the message ID in the database so that later, after review, the message is updated with the final verdict.

This is the only time the message ID is stored.

## Chapter 6: The generated files

The generated files are part of the bot activity. A user enters a server and a welcome card has to be generated, heard cooking. The bot receives the action and starts working. When generating the files, there is no identifier (Guild, User, Role...) assigned to the file name. The file generator function itself generates a unique identifier of X digits that is assigned to the file and, after sending, it is deleted.

## The end

To finish our story, remember that if you have any questions about your data, you can open a ticket on our [support server](https://discord.com/invite/q55kCfekyy) and I will assist you in the best possible way.

[!ref Pingu's Support Server](https://discord.com/invite/q55kCfekyy)
