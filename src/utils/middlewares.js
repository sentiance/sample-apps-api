'use strict'

const Boom = require('@hapi/boom')
const uuidv4 = require('uuid').v4

const { find, set } = require('lodash')

const { Logger, getIncomingRequestLogCtx } = require('./logger')

const Config = require('../config.json')
const Constants = require('../constants')

const { INCORRECT_USERNAME, INCORRECT_PASSWORD } = Constants.ERRORS.AUTHENTICATION_FAILURE

const checkAuthentication = (req, res, next) => {
  const authorizationHeader = req.headers.authorization

  if (!authorizationHeader) {
    throw Boom.unauthorized('Authorization header must be present')
  }

  const authHeaderParts = authorizationHeader.split(' ')

  if (authHeaderParts.length < 2) {
    throw Boom.unauthorized('Malformed BasicAuth credentials')
  }

  const decoded = Buffer.from(authHeaderParts[1], 'base64').toString('utf8')

  const decodedParts = decoded.split(':')

  if (decodedParts.length < 2) {
    throw Boom.unauthorized('Malformed BasicAuth credentials')
  }

  const suppliedCredentials = {
    username: decodedParts[0],
    password: decodedParts[1],
  }

  set(req, 'user.id', suppliedCredentials.username)

  authenticate(suppliedCredentials)

  next()
}

/**
 * @throws {Boom.unauthorized} - when authentication fails.
 */
const authenticate = (suppliedCredentials) => {
  const matchedCredentials = find(Config.auth.allowed_credentials, (credential) => {
    return credential.username === suppliedCredentials.username
  })

  if (!matchedCredentials) {
    throw Boom.unauthorized(INCORRECT_USERNAME)
  }

  if (matchedCredentials.password !== suppliedCredentials.password) {
    throw Boom.unauthorized(INCORRECT_PASSWORD)
  }
}

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
  checkAuthentication,
  checkContentTypeHeader,
}
