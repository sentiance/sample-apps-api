'use strict'

const express = require('express')

const http = require('http')
const Boom = require('@hapi/boom')

const routes = require('./routes')
const { getHttpReqSummaryLogCtx, Logger } = require('./utils/logger')
const { initialMiddleware, checkAcceptHeader, checkContentTypeHeader } = require('./utils/middlewares')
const Config = require('./config.json')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(initialMiddleware)
app.use(checkAcceptHeader)
app.use(checkContentTypeHeader)
app.use('/', routes)

// error handler
app.use(function (error, req, res) {
  Logger.error({ message: error.message, stack: error.stack })
  const boomError = new Boom.Boom(error)

  if (boomError.errorCode) {
    boomError.output.payload.error_code = boomError.errorCode
  }

  res.status(boomError.output.statusCode)
  res.set(boomError.output.headers)
  res.json({
    ...boomError.output.payload,
    ref: req.__uuid,
  })

  if (res.headersSent) {
    Logger.info(getHttpReqSummaryLogCtx(req, res))
  }
})

app.set('port', process.env.PORT || '8000')

const server = http.createServer(app)

function startServer() {
  if (!Config.app.id || !Config.app.secret) {
    console.log(`
****************************************
ERROR: Please add the app.id and app.secret in the config.json file
****************************************
    `)
    Logger.error('app.id and app.secret are mandatory in config.json')
    return
  }
  // start server
  server.listen(app.set('port'), function () {
    Logger.info(`Started server, listening on ${app.set('port')}`)
  })
}

startServer()

module.exports = app
