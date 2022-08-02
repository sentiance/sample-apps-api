# Sentiance Sample Application Backend
This service is written as an example to demonstrate the feature your backend would need to successfully integrate the Sentiance SDK.

## Route
This services exposes the following route:

```
GET http://localhost:8000/auth/code

    Description: Returns the auth code used for user creation via the SDK
    Response: { app_id: <app-id>, auth_code: <auth-code>, platform_url: <url> }
```

## Run the sample app service
1. Use node version 14.x
2. Run `npm install`
3. Add values to the following config properties in config.json
    - app.id
    - app.user_linking_api_key
4. Run `npm start`

*Contact support@sentiance.com to receive your APP ID and User Linking API Key*

## Auth Code

This allows user creation via the Sentiance SDK.

You will find the `auth/code` route in `src/routes.js` which demonstrates how to query the Sentiance Platform to request an auth code.

```bash
curl -X GET \
    -H "Content-Type:application/json" \
    -H "Accept: application/json" \
    -d '{"external_id":"123.456.7890"}' \
    "http://localhost:8000/auth/code"
```

More information: https://docs.sentiance.com/sdk/appendix/user-creation
