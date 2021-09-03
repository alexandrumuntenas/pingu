const SystemController = require('./SystemController.js')
const ModerationController = require('./ModerationController')
const WelcomeController = require('./WelcomeController')
const FarewellController = require('./FarewellController')
const LevelingController = require('./LevelingController')

module.exports = (req, res, pool) => {
  if (Object.prototype.hasOwnProperty.call(req.body, 'frmname')) {
    switch (req.body.frmname) {
      case 'system':
        SystemController.main(req, res, pool)
        break
      case 'welcome':
        WelcomeController.main(req, res, pool)
        break
      case 'farewell':
        FarewellController.main(req, res, pool)
        break
      case 'moderation_main':
        ModerationController.main(req, res, pool)
        break
      case 'moderation_warnlimit':
        ModerationController.modules.warnLimit(req, res, pool)
        break
      case 'moderation_noNSFWonSFW':
        ModerationController.modules.noNSFWonSFW(req, res, pool)
        break
      case 'leveling':
        LevelingController.main(req, res, pool)
        break
      default:
        res.status(406)
        res.send('You modified something important for the server.')
        break
    }
  } else {
    res.status(406)
    res.send('You modified something important for the server.')
  }
  res.status(200)
  res.send('Good to Go :)')
}
