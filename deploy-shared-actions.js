const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Function to read and return the content of a file
function readFileContents(filePath) {
    return fs.readFileSync(filePath, 'utf8');
}

// Function to write contents to a file
function writeFileContents(filePath, contents) {
    fs.writeFileSync(filePath, contents, 'utf8');
}

// Path to the shared functions and actions directory
const sharedFunctionsPath = path.join(__dirname, 'shared-functions', 'index.js');
const actionsDirectory = path.join(__dirname + '/auth0-assets', 'actions');

// Read the shared functions content
const sharedFunctionsContent = readFileContents(sharedFunctionsPath);

// Backup original action files and inject shared functions
const originalActionContents = {};

fs.readdirSync(actionsDirectory).forEach(action => {
    const actionIndexPath = path.join(actionsDirectory, action, 'index.js');

    if (fs.existsSync(actionIndexPath)) {
        const actionContent = readFileContents(actionIndexPath);
        originalActionContents[actionIndexPath] = actionContent;

        const updatedActionContent = `// Shared Functions\n${sharedFunctionsContent}\n\n// Action Code\n${actionContent}`;
        writeFileContents(actionIndexPath, updatedActionContent);
    }
});

// Absolute paths to the configuration files
const configFilePath = path.join(__dirname, 'auth0-assets', 'deploy-cli-config.json');
const tenantFilePath = path.join(__dirname, 'auth0-assets', 'tenant.yaml');

// Updated deployment command using absolute paths
const deployCommand = `a0deploy import --config_file "${configFilePath}" --input_file "${tenantFilePath}"`;

// Execute the deployment command
exec(deployCommand, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error during deployment: ${error}`);
        return;
    }
    console.log(`Deployment output: ${stdout}`);

    // Restore original action files
    for (const [filePath, content] of Object.entries(originalActionContents)) {
        writeFileContents(filePath, content);
    }

    console.log('Shared functions injected and actions reverted successfully.');
});
