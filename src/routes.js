'use strict'

const express = require('express')
const router = express.Router()

const Config = require('./config.json')
const { GRAPHQL_ERROR_STATUS } = require('./constants')
const { asyncWrapper } = require('./utils')
const { default: axios } = require('axios')
const { boomify, Boom, badRequest } = require('@hapi/boom')

const GENERATE_AUTH_CODE = `
  mutation generateAuthCode($externalId: String!) {
    generate_auth_code(external_id: $externalId) {
      authentication_code
    }
  }
`

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
 * Retrieves an authentication_code from the Sentiance Platform using the
 * "generate_auth_code" GraphQL mutation.
 *
 * An "external_id" is required to be sent to the Sentiance Platform as part of the
 * authentication_code request. Ensure to replace the "CURRENT_USER_ID" with the
 * current/logged_in user_id.
 *
 * The request must be authenticated with an API key that has the "user.link" scope.
 *
 * This authentication_code must be used to setup the Sentiance SDK.
 */
router.get(
  '/auth/code',
  asyncWrapper(async function (_req, res) {
    let response

    try {
      const reqBody = {
        query: GENERATE_AUTH_CODE,
        variables: { externalId: 'CURRENT_USER_ID' },
      }

      response = await axios.post(`${Config.sentiance_api_base_url}/v4/gql`, reqBody, {
        headers: {
          Authorization: `Bearer ${Config.app.user_link_api_key}`,
        },
      })
    } catch (err) {
      throw boomify(err, {
        statusCode: err?.response?.status,
        message: err?.response?.data?.message,
        decorate: {
          errorCode: err?.response?.data?.code,
        },
      })
    }

    // GraphQL reports failures (e.g. an API key without the "user.link" scope)
    // with a 200 status and an "errors" array in the body.
    const [gqlError] = response.data.errors || []

    if (gqlError) {
      const code = gqlError.extensions?.code

      throw new Boom(gqlError.extensions?.message || gqlError.message, {
        statusCode: GRAPHQL_ERROR_STATUS[code] || 500,
        decorate: {
          errorCode: code,
        },
      })
    }

    res.json({
      app_id: Config.app.id,
      auth_code: response.data.data.generate_auth_code.authentication_code,
      platform_url: Config.sentiance_api_base_url,
    })
  })
)

module.exports = router
