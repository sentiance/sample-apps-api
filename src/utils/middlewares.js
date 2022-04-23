'use strict'

const Boom = require('@hapi/boom')
const uuidv4 = require('uuid').v4

const { Logger, getIncomingRequestLogCtx } = require('./logger')

/**
 * Sets up cors, tags request with a unique id, adds a timestamp for measuring request duration and does incoming req
 * logging.
 *
 * @param req
 * @param res
 * @param next
 * @private
 */
const initialMiddleware = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')

  // Tag request and response with trace id, uuid.v1 is fastest and most unique.
  res.__uuid = req.__uuid = uuidv4()
  req.__start = new Date().getTime()

  // Log the incoming request
  if (req.method !== 'OPTIONS') {
    Logger.info(getIncomingRequestLogCtx(req))
  }

  next()
}

const healthcheckEndpoints = ['/v1/healthchecks', '/v1/healthchecks/']

const checkAcceptHeader = (req, res, next) => {
  if (healthcheckEndpoints.includes(req.url)) {
    next()

    return
  }

  const acceptHeader = req.headers.accept

  if (req.method !== 'OPTIONS' && acceptHeader && !acceptHeader.includes('application/json')) {
    throw Boom.notAcceptable()
  }

  next()
}

const checkContentTypeHeader = (req, res, next) => {
  if (healthcheckEndpoints.includes(req.url)) {
    next()

    return
  }

  const contentType = req.headers['content-type']

  if (req.method !== 'OPTIONS' && contentType && !contentType.includes('application/json')) {
    throw Boom.unsupportedMediaType()
  }

  next()
}

module.exports = {
  initialMiddleware,
  checkAcceptHeader,
  checkContentTypeHeader,
}
