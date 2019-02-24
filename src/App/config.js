import {Debug} from "../_helpers";

var logit = new Debug("config");

const env = {
  local: {
      apiGateway: {
      REGION: "us-east-1",
    },
    cognito: {
      REGION: "us-east-1",
    },

    // when running local the different services may be on different ports.
    // Define the lccal ports for each service
    //
    AUTH_MANAGER_URL: 'http://localhost:3000',
    USER_MANAGER_URL: 'http://localhost:3001',
    TENANT_MANAGER_URL: 'http://localhost:3003',
    TENANT_REGISTRATION_URL: 'http://localhost:3004',
    PRODUCT_MANAGER_URL: 'http://localhost:3006',
    ORDER_MANAGER_URL: 'http://localhost:3015',
    SYSTEM_REGISTRATION_URL: 'http://localhost:3011',

    SYSTEM_ADMIN_ROLE: 'SystemAdmin',
    SYSTEM_SUPPORT_ROLE: 'SystemUser',
    TENANT_ADMIN_ROLE: 'TenantAdmin',
    TENANT_USER_ROLE: 'TenantUser'

    SERVICE_PROJECT_NAME: 'SaaSServerless',

  },

 dev: {
   apiGateway: {
     REGION: "us-east-1",
   },
   cognito:    {
     REGION: "us-east-1",
   },

   SYSTEM_ADMIN_ROLE:   'SystemAdmin',
   SYSTEM_SUPPORT_ROLE: 'SystemUser',
   TENANT_ADMIN_ROLE:   'TenantAdmin',
   TENANT_USER_ROLE:    'TenantUser',

   // one option is to set the URL for the services using the API endpoint.
   // since we use a single API for all the services they are the same URL.
   // Change the URL for each service.  Each time you remove then deploy the API you will have to
   // edit these URLs.  simple code pushes to client or service do not require changes to these URLs.
   // get the URL for the api from the application and change 'YOUR_DEV_REST_API_URL' to your URL.

  // AUTH_MANAGER_URL:        'YOUR_DEV_REST_API_URL',
  // USER_MANAGER_URL:        'YOUR_DEV_REST_API_URL',
  // TENANT_MANAGER_URL:      'YOUR_DEV_REST_API_URL',
  // TENANT_REGISTRATION_URL: 'YOUR_DEV_REST_API_URL',
  // PRODUCT_MANAGER_URL:     'YOUR_DEV_REST_API_URL',
  // ORDER_MANAGER_URL:       'YOUR_DEV_REST_API_URL',
  // SYSTEM_REGISTRATION_URL: 'YOUR_DEV_REST_API_URL',

   // If you plan to use the service discovery process (Default setup) to allow the app to learn about the URLs for the services,
   // you need to provide the app with a SERVICE_URL.
   // get this URL from the outputs when deploying the ServiceDiscovery service and uncomment the line below.
   // this will override the above URLS.
   // in the line below change 'YOUR_DEV_SERVICE_API_URL' to be the serviceDiscovery URL from the SaaSServerless-Identity Application

   SERVICE_URL: 'YOUR_DEV_SERVICE_API_URL',
   SERVICE_PROJECT_NAME: 'SaaSServerless',

 },

 prod: {},

};

logit.log("process.env = ");
logit.log(process.env);

// Default to dev if not set
const config = process.env.REACT_APP_STAGE === undefined
  ? env.local
  : env[process.env.REACT_APP_STAGE];

if (process.env.serviceURL) {
  config.SERVICE_URL = process.env.serviceURL;
}
logit.log("config = ");
logit.log(config);

export default {
  // Add common config values here
  systemPrefix: process.env.SYSTEM_PREFIX ? process.env.SYSTEM_PREFIX : "SAASQSADMIN",
  MAX_ATTACHMENT_SIZE: 5000000,
  ...config
};
