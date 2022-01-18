const StringPlaceholder = require('string-placeholder')

/**
 * Solicitar la traducción para la i18n a través de string-placeholder
 * @param {string} idioma El idioma del servidor
 * @param {string} key La clave del array de los idiomas
 * @param {object} placeholders Los datos para reemplazar los placeholders
 */
module.exports = (language, key, placeholders) => {
  const locale = require(`./locales/${language}.json`)[key]
  if (placeholders) {
    return StringPlaceholder(locale, placeholders, { before: '%', after: '%' })
  } else {
    return locale
  }
}
