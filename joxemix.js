const Discord = require("discord.js");
const client = new Discord.Client();

client.on('ready', () => {
  client.user.setPresence({
    status: "online",
    activity: {
      name: "y viendo a Joxemix",
      type: "STREAMING",
      url: "https://www.twitch.tv/joxemix"
    }
  })
});

client.on('message', (message) => {
  if(message.content.startsWith('Hola')) {
    message.channel.send(`Que tal bro?!?!?!?`);
  }

  if(message.content.startsWith('hola')) {
    message.channel.send(`Que tal bro?!?!?!?`);
  }

  if(message.content.startsWith('bien')) {
    message.channel.send(`Me alegroo!!`);
  }
  if(message.content.startsWith('Bien')) {
    message.channel.send(`Me alegroo!!`);
  }
  if(message.content.startsWith('Mal')) {
   message.channel.send(`Tengo una forma de alegrar tu día, pasate por NicePlayer YT o habla con <@706155019526733855>`);
  }

  if(message.content.startsWith('mal')) {
    message.channel.send(`Tengo una forma de alegrar tu día, pasate por NicePlayer YT o habla con <@706155019526733855>`);
  }

  if(message.content.startsWith('Y tu?')) {
    message.channel.send(`Pues nada aquí estamos pero el importante eres tu!!`);
   }

   if(message.content.startsWith('Gracias')) {
    message.channel.send(`Nada hombre pero eso no quita que seas calvo!!`);
   }

   if(message.content.startsWith('Bot ataca')) {
    message.channel.send(`VOY VOY TE MATO PUERCOOOOOOOOOOOOOOO!!`);
   }

   if(message.content.startsWith('Calvo')) {
    message.channel.send(`Illo que mas dicho q te arranco la cabesa!!`);
   }

   if(message.content.startsWith('calvo')) {
    message.channel.send(`Illo que mas dicho q te arranco la cabesa!!`);
   }

   if(message.content.startsWith('Muchas gracias')) {
    message.channel.send(`No hace falta que las des`);
   }

   if(message.content.startsWith('@<NicePlayer')) {
    message.channel.send(`DIGAME BUEN HOMBRE`);
   }

   if(message.content.startsWith('Bot')) {
    message.channel.send(`Q quieres calvo q te meto`);
   }

   if(message.content.startsWith('Ahora todo cambio')) {
    message.channel.send(`Le toca a ella, mary una botellaaa`);
   }

   if(message.content.startsWith('Grasia al maltrato se puso bella')) {
    message.channel.send('Ahora tu la quiere y no te quiere ella');
   }



});
client.login('NzYxMjk3Njk4MTI0OTg4NDM4.X3Yjuw.XC2eazV19d_gIZF41w8W6ZMiPAc');