
exports = {
    // Handler for the 'onCallCreate' event
    onCallCreateHandler: async function(payload) {
        try {
            // Extract the caller's number from the event context
            const callerNumber = payload.data.caller_number;

            // Make an API call to Freshdesk to fetch contact info
            const contactInfo = await $request.invokeTemplate('fetch_contact_info', {
                context: { phone: callerNumber }
            });

            // Parse the response to get the contact's information
            const contactData = JSON.parse(contactInfo.response);

            // Store the contact's information using FDK key-value storage
            await $db.set(`contact_info:${callerNumber}`, contactData);

        } catch (error) {
            // Handle API call failures and storage issues
            console.error('Error handling onCallCreate event:', error);
        }
    },

    // Server method to retrieve the stored contact information
    getSenderInfo: async function(request) {
        try {
            // Retrieve the caller's number from the request
            const callerNumber = request.caller_number;

            // Get the contact's information from FDK key-value storage
            const contactInfo = await $db.get(`contact_info:${callerNumber}`);

            // Respond to the frontend with the contact's information
            return { response: contactInfo, status: 200 };

        } catch (error) {
            // Respond to the frontend with an error message
            return { response: { error: 'Failed to retrieve contact information.' }, status: 500 };
        }
    }
};
