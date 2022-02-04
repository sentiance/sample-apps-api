'use strict'

const winston = require('winston')

const HEADERS = {
    ACCEPT: 'accept',
    ACCEPT_ENCODING: 'accept-encoding',
    AUTHORIZATION: 'authorization',
    CONTENT_ENCODING: 'content-encoding',
    CONTENT_LENGTH: 'content-length',
    CONTENT_TYPE: 'content-type',
    REFERER: 'referer',
    USER_AGENT: 'user-agent',
}

const {
    ACCEPT,
    ACCEPT_ENCODING,
    CONTENT_ENCODING,
    CONTENT_LENGTH,
    CONTENT_TYPE,
    REFERER,
    USER_AGENT,
} = HEADERS

const Logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'sample-apps-service' },
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' }),
    ],
  })

function _getRequestLogCtx(req) {
  return {
    url: req.originalUrl,
    method: req.method,
    started_at: new Date(req.__start),
    referer: req.get(REFERER),
    useragent: req.get(USER_AGENT),
    request: {
      body: JSON.stringify(req.body),
      query: JSON.stringify(req.query),
      params: req.params,
      [CONTENT_TYPE]: req.get(CONTENT_TYPE),
    },
  }
}

function _getAdditionalRequestLogCtx(req) {
  const requestCtx = _getRequestLogCtx(req)

  return {
    ...requestCtx,
    request: {
      [ACCEPT]: req.get(ACCEPT),
      [ACCEPT_ENCODING]: req.get(ACCEPT_ENCODING),
      [CONTENT_ENCODING]: req.get(CONTENT_ENCODING),
      [CONTENT_LENGTH]: req.get(CONTENT_LENGTH),
      ...requestCtx.request,
    },
  }
}

function _getResponseLogCtx(req, res) {
  const completedAt = new Date().getTime()

  return {
    status_code: res.statusCode,
    completed_at: new Date(completedAt),
    time_taken_ms: completedAt - req.__start,
    response: {
      [CONTENT_LENGTH]: res.get(CONTENT_LENGTH),
      [CONTENT_TYPE]: res.get(CONTENT_TYPE),
    },
  }
}

function getIncomingRequestLogCtx(req) {
  return {
    http: _getRequestLogCtx(req),
    message: 'Incoming request',
    correlation_id: req.__uuid,
  }
}

function getHttpReqSummaryLogCtx(req, res) {
  return {
    http: {
      ..._getAdditionalRequestLogCtx(req),
      ..._getResponseLogCtx(req, res),
    },
    message: 'Http request summary'
  }
}

module.exports = {
  getIncomingRequestLogCtx,
  getHttpReqSummaryLogCtx,
  Logger,
}
