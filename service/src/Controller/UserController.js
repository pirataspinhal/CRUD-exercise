const logger = require('../Utils/Logger');
/**
 * @typedef {Object} UserController
 * @property {function(req: Request, res: Response)} getUserById
 */

/**
 * @param managerService
 * @returns {UserController}
 */
function UserController(managerService) {
  return {
    /**
     * @param {Request} req
     * @param {Response} res
     */
    getUserById({params}, res) {
      logger.trace('Here is my function!!!');
      res.status(200).json('Your user');
    },
  }
}

module.exports = UserController;
