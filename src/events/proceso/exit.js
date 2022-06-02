module.exports = {
  name: 'exit',
  execute: () => {
    Client.destroy()
    process.exit()
  }
}
