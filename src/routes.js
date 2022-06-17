'use strict'

const express = require('express')
const router = express.Router()

const Config = require('./config.json')
const { asyncWrapper } = require('./utils')
const { default: axios } = require('axios')
const { boomify, Boom, badRequest } = require('@hapi/boom')

/**
 * Health check api for the service
 */

router.get(
  '/healthchecks',
  asyncWrapper(function (req, res) {
    res.json({ data: 'ok' })
  })
)

/**
 * Sends the app id and secret from the config file
 *
 * DO NOT USE THIS ROUTE IN PRODUCTION WITHOUT AUTHENTICATION
 * Have your own authentication here. We highly recommend you to
 * have secured access to the 'config' route as it exposes sensitive information
 * As this is a sample application which only shows the main working of the application,
 * we have skipped authentication.
 */

router.get(
  '/config',
  asyncWrapper(function (req, res) {
    res.json({ id: Config.app.id, secret: Config.app.secret })
  })
)

/**
 * Links a user id of the app to the Sentiance id of the user
 * This route accepts a json body with property 'user_id' which is the user id of the app
 *
 * This route calls the Sentiance user linking api /v2/users/:install_id/link
 *
 * Refer https://docs.sentiance.com/important-topics/user-linking-2.0#server-to-server-integration-api
 * The Sentiance user linking API expects a json request body with property external_id
 * external_id is the id of the user who has logged in to the service
 * This id is expected to be unique for a user so that even for
 * multiple app installations to various devices or multiple logins to the same device,
 * the Sentiance API will be able to identify to the user
 *
 * DO NOT USE THIS ROUTE IN PRODUCTION WITHOUT AUTHENTICATION
 * Have your own authentication here.
 * We highly recommend you to have secured access to the 'link' route.
 * As this is a sample application which shows only the main working of the application,
 * we have skipped authentication.
 */

router.post(
  '/users/:id/link',
  asyncWrapper(async function (req, res) {
    try {
      if (!req.body.user_id) {
        throw badRequest('A required property user_id is missing in the json body')
      }

      const reqBody = {
        external_id: req.body.user_id,
      }
      const response = await axios.post(`${Config.sentiance_api_base_url}/v2/users/${req.params.id}/link`, reqBody, {
        headers: {
          Authorization: `Bearer ${Config.app.user_link_api_key}`,
        },
      })

      res.json({ id: response.data.id })
    } catch (err) {
      throw boomify(err, {
        statusCode: err?.response?.status,
        message: err?.response?.data?.message,
        decorate: {
          errorCode: err?.response?.data?.errorCode,
        },
      })
    }
  })
)

module.exports = router
