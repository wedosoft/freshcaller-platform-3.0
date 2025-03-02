
let client;

init();

async function init() {
  client = await app.initialized();
  client.events.on('app.activated', setupApp);
}

async function setupApp() {
  // Hide the sender information form and show the loading indicator
  document.querySelector('.form-container').style.display = 'none';
  document.querySelector('fw-spinner').style.display = 'block';

  try {
    // Invoke the Server Method Invocation to fetch the sender's information
    const data = await client.request.invoke('getSenderInfo', {});

    // Hide the loading indicator
    document.querySelector('fw-spinner').style.display = 'none';

    // Parse the received data and display the sender's information
    if (data && data.response) {
      const senderInfo = JSON.parse(data.response);
      document.getElementById('senderName').value = senderInfo.name;
      document.getElementById('senderEmail').value = senderInfo.email;
      document.getElementById('senderPhone').value = senderInfo.phone;

      // Show the sender information form
      document.querySelector('.form-container').style.display = 'block';
    }
  } catch (error) {
    // Handle errors by showing an appropriate message to the user
    console.error('Error fetching sender information:', error);
    document.querySelector('fw-spinner').style.display = 'none';
    // Show an error message to the user
    client.interface.trigger("showNotify", {
      type: "danger",
      message: "Failed to load sender information. Please try again."
    });
  }
}
