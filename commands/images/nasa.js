const fetch = require("superagent");
const { MessageEmbed } = require("discord.js");
const i18n = require("../../i18n/i18n");
const { Loader } = require("../../modules/constructor/messageBuilder");

module.exports = {
  name: "nasa",
  description: "🚀 Get the NASA's image of the day",
  cooldown: 1,
  executeInteraction(client, locale, interaction) {
    fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_KEY}`)
      .then((response) => response.body)
      .then((quote) => {
        if (quote.media_type === "image") {
          const embed = new MessageEmbed()
            .setTitle(quote.title)
            .setDescription(quote.explanation)
            .setImage(quote.hdurl)
            .setColor("#0B3D91")
            .addField(
              "+ Info",
              `:camera: ${
                quote.copyright || "We don't have that information"
              }\n<a:ultimahora:876105976573472778> ${i18n(
                locale,
                "IMAGEAPI::PROVIDER",
                { API: "Nasa.gov" }
              )}`
            );
          interaction.editReply({ embeds: [embed] });
        } else {
          interaction.editReply("We are working on video media type.");
        }
      });
  },
  executeLegacy(client, locale, message) {
    message
      .reply({ embeds: [Loader(i18n(locale, "FETCHINGDATA"))] })
      .then((msg) => {
        fetch(
          `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_KEY}`
        )
          .then((response) => response.body)
          .then((quote) => {
            if (quote.media_type === "image") {
              const embed = new MessageEmbed()
                .setTitle(quote.title)
                .setDescription(quote.explanation)
                .setImage(quote.hdurl)
                .setColor("#0B3D91")
                .addField(
                  "+ Info",
                  `:camera: ${
                    quote.copyright || "We don't have that information"
                  }\n<a:ultimahora:876105976573472778> ${i18n(
                    locale,
                    "IMAGEAPI::PROVIDER",
                    { API_PROVIDER: "Nasa.gov" }
                  )}`
                );
              msg.edit({ content: "Done!", embeds: [embed] });
            } else {
              message.channel.send("We are working on video media type.");
            }
          });
      });
  },
};
