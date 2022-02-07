# Sentiance Sample Application Backend
This service is written as an example to demonstrate the features (workflows) your backend would need to handle in order to successfully integrate the Sentiance SDK

## Workflows

1. User Linking
1. SDK Credentials (recommended)

## Run the sample app service
1. Use node version 14.x
2. Run `npm install`
3. Add values to the following config properties in config.json
    - app.id
    - app.secret
    - app.user_linking_api_key
4. Run `npm start`

*Contact support@sentiance.com to receive your APP ID, Secret and User Linking API Key*

## Workflows Explained

### User Linking

This allows user's to switch devices without loosing data. 

You will find the `users/:user_id/link` route in `src/routes.js` which demonstrates how to query the Sentiance Platform to perform a "user linking request".

More information: https://docs.sentiance.com/important-topics/user-linking-2.0

### SDK Credentials (recommended)

As you have gathered the SDK (and thus your application) requires credentials in order for authenticate itself with the Sentiance platform. We highly recommended you store these credentials in your backend, instead of the frontend application code base.