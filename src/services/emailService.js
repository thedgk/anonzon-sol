const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendPaymentConfirmation({ to, txHash, amount, address, paidAt }) {
  const solscanUrl = `https://solscan.io/tx/${txHash}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Your Solana Payment Was Received',
    html: `<h2>Payment Received</h2>
      <p><b>Amount:</b> ${amount} SOL</p>
      <p><b>Wallet Address:</b> ${address}</p>
      <p><b>Transaction:</b> <a href="${solscanUrl}">${txHash}</a></p>
      <p><b>Date:</b> ${new Date(paidAt).toLocaleString()}</p>`
  };
  await transporter.sendMail(mailOptions);
}

module.exports = { sendPaymentConfirmation }; 