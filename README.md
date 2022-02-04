## Sentiance service sample app node
This service written as an example to show the expected APIs and their implementations. The route paths and authentication mechanisms can differ when you add these APIs as a part of your production service.

### Run the sample app service
1. Use node version 14.x
2. Run npm install
3. Add values to the following config properties in config.json
    - app.id
    - app.secret
    - app.user_linking_api_key
4. Run npm start


### What the sample app has/ what we expect your service to have

##### Expose an API to send the app id and secret
App id and secret should not be stored directly in the device and it should be retrieved from the backend.

##### Expose an API to link the application's user id with Sentiance user id.
This route should call the Sentiance user linking api /v2/users/:install_id/link. Refer https://docs.sentiance.com/important-topics/user-linking-2.0#server-to-server-integration-api. The Sentiance user linking API expects a json request body with property external_id. external_id is the id of the user who has logged in to the service. This id is expected to be unique for a user in an application so that even after multiple app installations to various devices or multiple logins to the same device, the Sentiance API will be able to identify to the user.

### Authentication

 Authentication mechanism given here is just for an example. It can be replaced by any authentication mechanism as per your application.
 For this sample app, we have used a Basic authentication with accepted usernames and passwords configured as a part of config file(/src/config.json). If the used username and password combinations match the ones in the config file the authentication succeeds
