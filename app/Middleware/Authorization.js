'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class Authorization {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ response, auth }, next, ...args) {

    let expression = args[0];
    let user;

    try {
      user = await auth.getUser()
    } catch (error) {
      return response.send({ message: "Token is invalid or it was expired" })
    }

    if (Array.isArray(expression)) {
      expression = expression[0]
    }

    if (expression !== user.role ) return response.send({ message: "Access denied" });

    await next()
    
  }
}

module.exports = Authorization
