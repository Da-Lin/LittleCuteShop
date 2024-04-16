/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const functions = require('firebase-functions')
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const { CloudBillingClient } = require('@google-cloud/billing');
const { InstancesClient } = require('@google-cloud/compute');

const PROJECT_ID = process.env.GCLOUD_PROJECT;
const PROJECT_NAME = `projects/${PROJECT_ID}`;
const billing = new CloudBillingClient();

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//     logger.info("Hello logs!", { structuredData: true });
//     response.send("Hello from Firebase!");
// });

const stopBilling = async pubsubEvent => {
    const pubsubData = JSON.parse(
        Buffer.from(pubsubEvent.data, 'base64').toString()
    );
    if (pubsubData.costAmount <= pubsubData.budgetAmount) {
        return `No action necessary. (Current cost: ${pubsubData.costAmount})`;
    }

    if (!PROJECT_ID) {
        return 'No project specified';
    }

    const billingEnabled = await _isBillingEnabled(PROJECT_NAME);
    if (billingEnabled) {
        return _disableBillingForProject(PROJECT_NAME);
    } else {
        return 'Billing already disabled';
    }
};

/**
 * Determine whether billing is enabled for a project
 * @param {string} projectName Name of project to check if billing is enabled
 * @return {bool} Whether project has billing enabled or not
 */
const _isBillingEnabled = async projectName => {
    try {
        const [res] = await billing.getProjectBillingInfo({ name: projectName });
        return res.billingEnabled;
    } catch (e) {
        console.log('Unable to determine if billing is enabled on specified project, assuming billing is enabled', e);
        return true;
    }
};

/**
 * Disable billing for a project by removing its billing account
 * @param {string} projectName Name of project disable billing on
 * @return {string} Text containing response from disabling billing
 */
const _disableBillingForProject = async projectName => {
    const [res] = await billing.updateProjectBillingInfo({
        name: projectName,
        resource: { billingAccountName: '' }, // Disable billing
    });
    return `Billing disabled: ${JSON.stringify(res)}`;
};

exports.checkBillingAndStopIfNecessary = functions.pubsub.topic('billing').onPublish((message) => {
    try {
        const data = message.json
        console.log('Received pubsub notification')
        console.log(data)
        console.log(stopBilling(message))
    } catch (error) {
        console.error(`Coundn't parse JSON message! ${error}`)
    }
})
