'use strict'

const express = require('express')
const router = express.Router()

const { checkAuthentication } = require('./utils/middlewares')

const Config = require('./config.json')
const { asyncWrapper } = require('./utils')
const { default: axios } = require('axios')
const { boomify } = require('@hapi/boom')

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
 * Authentication mechanism given here is just for an example. It can be replaced by any authentication mechanism as per your application
 * For this sample app, we have used a Basic authentication with accepted usernames and passwords
 * configured as a part of config file(/src/config.json)
 * If the used username and password combinations match the ones in the config file
 * the authentication succeeds
 */

router.get(
  '/config',
  checkAuthentication,
  asyncWrapper(function (req, res) {
    res.json({ id: Config.app.id, secret: Config.app.secret })
  })
)

/**
 * Links a user id of app to the Sentiance id of the user
 * This route calls the Sentiance user linking api /v2/users/:install_id/link
 * Refer https://docs.sentiance.com/important-topics/user-linking-2.0#server-to-server-integration-api
 * The Sentiance user linking API expects a json request body with property external_id
 * external_id is the id of the user who has logged in to the service
 * This id is expected to be unique for a user so that even for
 * multiple app installations to various devices or multiple logins to the same device,
 * the Sentiance API will be able to identify to the user
 *
 * Authentication mechanism given here is just for an example. It can be replaced by any authentication mechanism as per your application
 * All we need is a way to uniquely identify a user and to pass that user's id as 'external_id' in the request body to the Sentiance API
 * That way, the user's id can be linked to the Sentiance id of the user
 * For this sample app, we have used a Basic authentication with accepted usernames and passwords
 * configured as a part of config file(/src/config.json)
 * If the used username and password combinations match the ones in the config file
 * the authentication succeeds
 */

router.post(
  '/users/:id/link',
  checkAuthentication,
  asyncWrapper(async function (req, res) {
    try {
      const reqBody = {
        external_id: req.user.id,
      }
      const response = await axios.post(`${Config.sentiance_api_base_url}/v2/users/${req.params.id}/link`, reqBody, {
        headers: {
          Authorization: `Bearer ${Config.app.user_link_api_key}`,
        },
      })

      res.json({ id: response.data.id })
    } catch (err) {
      throw boomify(err, {
        statusCode: err.response.status,
        message: err.response.data.message,
        decorate: {
          errorCode: err.response.data.errorCode,
        },
      })
    }
  })
)

module.exports = router
