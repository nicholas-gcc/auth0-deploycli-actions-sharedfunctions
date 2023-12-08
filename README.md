# auth0deploycli-actions-shared-functions
Short utility script on deploying Auth0 Actions with function reuse. Auth0 Actions currently have limitations on reusing the same set of functions across different Actions. This utility script aims to mimic the behaviour of import statements on a traditional JS environment without having to rewrite the same code manually. 

## Workflow
1. `deploy-shared-action.js` reads file contents in the `shared-functions` directory
2. The original Auth0 Action code is backed up in-memory
3. The script injects the shared functions from `shared-functions` directory into the Actions code from the `auth0-assets/actions` directory
4. The combined shared function and Actions code is uploaded to your Auth0 tenant using Auth0's `Deploy CLI`
5. The Actions code from the `auth0-assets/actions` directory is restored to its original state, while the Actions code in your Auth0 tenant have access to the common functions

This has the advantage of:

- Maintaining a single source of truth for shared functions. Any change made to the shared function is automatically propagated to all Actions when the deployment script is run.
- It ensures that all Actions use the same version of the shared function, reducing the risk of inconsistencies and bugs that might arise from having different versions of the same function across multiple Actions.
- Automated injection reduces the risk of human error that can occur with manual copying and pasting.

## Usage

### Prerequisites
- Have an Auth0 tenant set up
- Have a Machine-to-Machine Application set up to make Management API token [requests](https://auth0.com/docs/get-started/apis/create-m2m-app-test) on your behalf
- Install Auth0 Deploy CLI:
```bash
npm install -g auth0-deploy-cli
```
- Populate `auth0-assets/tenant.yaml` with the appropriate `supported_triggers`
- Populate `auth0-assets/deploy-cli-config.json` with the appropriate `AUTH0_DOMAIN`, `AUTH0_CLIENT_ID` and `AUTH0_CLIENT_SECRET` representing the Auth0 M2M app used to interact with Management API

## Running the workflow

Call `node deploy-shared-actions.js`
