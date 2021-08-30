/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const StringPlaceholder = require('string-placeholder')

module.exports = (language, key, placeholders) => {
  const locale = require(`./locales/${language}.json`)[key]
  if (placeholders) {
    return StringPlaceholder(locale, placeholders, { before: '%', after: '%' })
  } else {
    return locale
  }
}
