'use strict'

const constants = {
  ERRORS: {
    BAD_REQUEST: {
      NO_SUCH_USER: 'No such user exists.',
    },
  },
  ERROR_CODE: {
    UNSPECIFIED_CODE: 'UNSPECIFIED_CODE',
  },
  // HTTP status for each "extensions.code" returned in Sentiance GraphQL errors
  GRAPHQL_ERROR_STATUS: {
    AUTHENTICATION_FAILURE: 401,
    AUTHORIZATION_FAILURE: 403,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
  },
}

module.exports = constants
