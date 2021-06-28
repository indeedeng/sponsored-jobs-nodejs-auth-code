# Sponsored Job Campaigns API
This sample application illustrates integrating an ATS with the Indeed Sponsored Job Campaigns API. The application illustrates:

* Exposing a job feed with an XML file.
* Calling the /campaigns endpoint to sponsor a job.
* Calling the /campaigns endpoint to get a list of sponsored job campaigns.
* Calling the /campaigns endpoint to pause, unpause, or delete a sponsored job campaign.
* Authorizing your application to call Indeed APIs by retrieving an OAuth Access Token.
* Using PKCE to improve the security of your application.

You can view the API Reference for the Sponsored Job Campaigns API here:

[Swagger API Reference](https://opensource.indeedeng.io/api-documentation/docs/campaigns/ref/#/Campaign%20management/updateCampaign)

## Running the App

Follow these steps to run the sample app:

1. Ensure that you have NodeJS and NPM installed. Follow the installation instructions at https://docs.npmjs.com/downloading-and-installing-node-js-and-npm. 
    * You can verify whether NodeJS is installed by opening your terminal and running ```node --version```
    * You can verify whether npm is installed by opening your terminal and running ```npm --version```
2. Clone the current Github repository to your local machine.
3. Rename the `config.js.example` file to the `config.js.` Enter your Indeed OAuth Client ID and Client Secret in the config.js file. You can register for an Indeed OAuth Client ID and Secret by visiting [Manage App Credentials](https://secure.indeed.com/account/apikeys). 
4. After downloading the repository, `cd` into the root folder and run the command ```npm install```
5. Start the webserver by running the command ```npm run dev```
6. Open a web browser and navigate to `localhost:3000`

