// Placeholder for Helius webhook handler
// You will need to implement webhook verification and payment detection logic here

async function handleHeliusWebhook(req, res) {
  // TODO: Parse webhook, find session by address, mark as paid, send email
  res.json({ success: true });
}

module.exports = { handleHeliusWebhook }; 