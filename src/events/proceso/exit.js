module.exports = {
  name: 'exit',
  execute: () => {
    process.Client.destroy()
    process.exit()
  }
}
