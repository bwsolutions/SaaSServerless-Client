# serverless-saas-identity-react-app

## React + Redux application that works with the Serverless SaaS Identity example

This single page application is designed to work the with Serverless SaaS Identity application. The Serverless SaaS Identity application is based on an AWS Quickstart called SaaS Identity Cognito. For more information about the AWS quickstart see [SaaS identity and isolation with Amazon Cognito](https://aws.amazon.com/quickstart/saas/identity-with-cognito/)

This is the client code for this application. It is written using React + Redux and demonstrates how to do login and authentication using the details outlined in the AWS Quickstart.

## Prerequisites

- Node.js v8.10 or later
- Serverless CLI v1.9.0 or later. See [Serverless Quickstart](https://serverless.com/framework/docs/providers/aws/guide/quick-start/) for more details.
- An AWS account. A free tier account will work with minimal cost.
- Setup provider Credentials. See [Serverless Quickstart](https://serverless.com/framework/docs/providers/aws/guide/quick-start/) for more details.
- Clone github repository.
```
git clone https://github.com/bwsolutions/SaaSServerless-Client.git
```
- Install and Deploy ["SaaSServerless-Identity"](https://github.com/bwsolutions/SaaSServerless-Identity)
  
## Configuration
You will need to make a couple configuration changes before you build the application. 

- edit "serverless.yml" file. Change the following line at the top of the file to something unique. This is used as part of a bucket name for the static websiteURL.

Change:
```
service: saasserverless-client
```
to:
```
service: saasserverless-client-yourname
```
- The client assumes this is being deployed in the us-east-1 region. If you installed the services in another region you will need to update the client configuration.
  - Edit the src/App/config.js file
  - this file has different sections based on stage. default is dev, so under dev: change the apiGateway.REGION to be a valid AWS region name.  
    
- 
First we need to go to SaaSServerless-Identity installation and get the ServiceEndpoint.
```
# in the SaaSServerless-Identity directory 
cd serviceDiscovery
sls info -v 
```
- Find "ServiceEndpoint" under Stack Output. Copy the URL. it should look something like below where API_REST_ID is a unique code created by AWS.
``` 
https://API_REST_ID.execute-api.us-east-1.amazonaws.com/dev
```
- using the above URL, we need to update the src/App/config.js file.   

  - edit the src/App/config.js
  - change the 'YOUR_DEV_SERVICE_API_URL' to be the URL you got above. 
``` 
   SERVICE_URL: 'YOUR_DEV_SERVICE_API_URL',
```

## Installation
- Install packages from top level Client directory.
```
cd SaasServerless-Client
npm install
```

  
### To run from S3 static website

- build and deploy the app to the static website
```
npm run build
npm run deploy 
```
### To update application and website
You will need to build the application and they sync with the S3 bucket. The following commands will do this.
``` 
npm run build
sls s3sync
```
### To start application
Access the static website. Use the URL for the S3 Bucket. To get this URL enter the following command and get the URL from the "StaticWebsiteURL" under Stack Outputs
``` 
# make sure you are in the top level directory
sls info -v
```
Copy and paste the URL into your browser.
## Running the Application
### Initial setup
The first step we need to do is create they system User or System Admin Tenant. 
- go to  http://StaticWebsiteURL/install
where StaticWebsiteURL is the URL of the website (see installation instructions)
- fill in the form. You MUST provide a valid email address because an email will be sent with a temporary password to login.
- You should get a message saying the "Admin Registration Successful".
- Check your email for a message with your temporary password.
- go to http://StaticWebsiteURL/login
- enter your email address and the temporary password. You will be promted to change the password.
- once completed, you have a admin tenant setup and can check status of services and view tenants.
### Register new tenant
Now you can create another user tenant.
- click on the register link
- fill out the form using a Different email than the Admin tenant.
- When you login with this new account, you will need to change the password.
- Then you can work with the products and orders part of the application.
## Cleanup
You will need to cleanup and remove the resources so that you are not charged for any usage in your account.
- To Clean up - first login with System tenant you created with the install process.
- go to Tenents and see list of Tenants created.
- Start with the user Tenants, click on the delete icon to remove each tenant and cleanup roles, and userpools.
- Finally delete the system Tenant using the same procedure.
- To remove the client S3 bucket and other resources, 
  - make sure you are at the top level of client directory
  - sls remove
- Be sure to go the services directory and complete Cleanup process for those resources.

## Authors
- Bill Stoltz - [BWS](http://boosterwebsolutions.com)
- Based on an angularjs client from the [AWS Quickstart SaaS identity and isolation with Amazon Cognito](https://aws.amazon.com/quickstart/saas/identity-with-cognito/)

