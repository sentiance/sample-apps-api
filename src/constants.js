'use strict'

const constants = {
  ERRORS: {
    BAD_REQUEST: {
      NO_SUCH_USER: 'No such user exists.',
    },
    AUTHENTICATION_FAILURE: {
      INCORRECT_PASSWORD: 'Incorrect password provided',
      INCORRECT_USERNAME: 'Incorrect username provided',
    },
  },
  ERROR_CODE: {
    UNSPECIFIED_CODE: 'UNSPECIFIED_CODE',
  },
}

module.exports = constants
