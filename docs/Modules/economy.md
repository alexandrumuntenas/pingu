---
order: 94
icon: credit-card
---

# Economy
> Do you want to create a roleplay store? A super-epic chachipirulis item store for your server? Create your own economic system on your Discord server.

!!!
Enable this module using `/admin modules enable module: economy`.

Disable this module using `/admin modules disable module: economy`.
!!!

## The module inside

Pingu has a local economy module. This means that your balance and inventory are not shared across all servers where the bot is present.

## Configuration of the general aspects

The commands listed below can only be used by the server owner, or by persons with the [MANAGE_GUILD\*](https://discord.com/developers/docs/topics/permissions) permission.

!!!warning
This module can be only used using Slash Commands.
!!!

| Command | Function | Example |
| --- | --- | -- |
| /economy setcoinname coinname: | Command to modify the name of the server currency. | /economy setcoinname coinname: PinguCoins |
| /economy setcoinicon coinicon: | Command to modify the icon of your currency.| /economy setcoinicon coinicon: :myemoji: |

## Store configuration

| Command | Function | Example |
| --- | --- | --- |
| /products create colletionable name:\<name of the product> price:\<price of the product> singlebuy:\<true/false> (···)| Create a collectionable product. | /products create collectionable name:Star price:400 singlebuy:true |
| /products create role name:\<name of the product> price:\<price of the product> singlebuy:\<true/false> role:\<role> | Create a products that gives a role. | /products create role name: ROLE32 price: 1 singlebuy: true role: @newrole |
| /products create message | Create a product that sends a message to a channel | /products create message name:Get 1000$ in MC Server price:1000 singlebuy:False message:Example destination:#📬・announcements <br><br> /products create message name:Say Hi in Server price:4001 singlebuy:False message:Hi from #USER# destination:#:mailbox_with_mail:・announcements properties:USER  |
| /products delete name:\<name of the product> | Delete a product. | /products delete name: EX4 |

## User commands

| Command | Function | Example |
| --- | --- | --- |
| /buy name:\<name of the product> properties:\<properties of the command> | Command to buy a product. | /buy name: Get 1000$ in MC Server <br><br> /buy name:Say Hi properties: USER:Guilda |
| /balance | Command to see your balance. | /balance |
| /inventory | Command to see your inventory. | /inventory |
| /work | Command to work. | /work |
| /daily | Command to get your daily reward. | /daily |