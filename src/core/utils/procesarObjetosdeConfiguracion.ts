function procesarObjetosdeConfiguracion (config, newconfig) {
  if (newconfig instanceof Object === false) return newconfig

  let count = 0

  const newConfigProperties = Object.keys(newconfig)
  newConfigProperties.forEach(property => {
    if (Object.prototype.hasOwnProperty.call(config, property) && typeof newconfig[property] === 'object') {
      config[property] = module.exports(config[property], newconfig[property])
      count += 1
    } else {
      config[property] = newconfig[property]
      count += 1
    }

    if (count === newConfigProperties.length) {
      return config
    }
  })
}

export default procesarObjetosdeConfiguracion
