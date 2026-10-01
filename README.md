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

You will find the `auth/code` route in `src/routes.js` which demonstrates how to request an auth code from the Sentiance Platform using the `generate_auth_code` mutation of the GraphQL API (`POST <sentiance_api_base_url>/v4/gql`). The request must be authenticated with your User Linking API Key (an API key with the `user.link` scope).

```graphql
mutation generateAuthCode($externalId: String!) {
  generate_auth_code(external_id: $externalId) {
    authentication_code
  }
}
```

```bash
curl -X GET \
    -H "Content-Type:application/json" \
    -H "Accept: application/json" \
    -d '{"external_id":"123.456.7890"}' \
    "http://localhost:8000/auth/code"
```

More information: https://docs.sentiance.com/sdk/appendix/user-creation
