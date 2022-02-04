'use strict'

const { Logger, getHttpReqSummaryLogCtx } = require('./logger')

/**
 * Generates an ExpressMiddleware which passes off thrown errors to the final error handler. `OPTIONS` calls are passed
 * on to the next middleware in the chain, though for the life of me I don't know why. Passed in functions are expected
 * to call `next` when they deem it prudent or not call it and let the chain end.
 *
 * @param {Function} fn
 * @return {ExpressMiddleware}
 */
function asyncWrapper(fn) {
  return async function (req, res, next) {
    try {
      if (req.method === 'OPTIONS') {
        next()

        return
      }

      await fn(req, res, next)

      if (res.headersSent) {
        Logger.info(getHttpReqSummaryLogCtx(req, res))
      }
    } catch (error) {
      next(error)
    }
  }
}

module.exports = {
  asyncWrapper,
}
