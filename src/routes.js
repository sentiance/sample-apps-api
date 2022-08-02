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
 * Retrieves an authentication_code from the Sentiance Platform.
 *
 * An "external_id" is required to be sent to the Sentiance Platform as part of the
 * authentication_code request. Ensure to replace the "CURRENT_USER_ID" with the
 * current/logged_in user_id.
 *
 *
 * This authentication_code must be used to setup the Sentiance SDK.
 */
router.get(
  '/auth/code',
  asyncWrapper(async function (_req, res) {
    try {
      const reqBody = { external_id: 'CURRENT_USER_ID' }

      const response = await axios.post(`${Config.sentiance_api_base_url}/users/auth-code`, reqBody, {
        headers: {
          Authorization: `Bearer ${Config.app.user_link_api_key}`,
        },
      })

      res.json({
        app_id: Config.app.id,
        auth_code: response.data.authentication_code,
        platform_url: Config.sentiance_api_base_url,
      })
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
