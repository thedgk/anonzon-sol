const { Connection, Keypair, PublicKey, LAMPORTS_PER_SOL, Transaction, SystemProgram, sendAndConfirmTransaction } = require('@solana/web3.js');
const bs58 = require('bs58');

const connection = new Connection('https://api.mainnet-beta.solana.com');

async function sweepToMasterWallet(privateKeyHex, masterWalletAddress) {
  const secretKey = Buffer.from(privateKeyHex, 'hex');
  const keypair = Keypair.fromSecretKey(secretKey);
  const fromPubkey = keypair.publicKey;
  const toPubkey = new PublicKey(masterWalletAddress);

  // Get balance
  const balance = await connection.getBalance(fromPubkey);
  if (balance <= 0) return { success: false, message: 'No SOL to sweep' };

  // Calculate fee (assume 5000 lamports)
  const fee = 5000;
  const amount = balance - fee;
  if (amount <= 0) return { success: false, message: 'Not enough SOL to cover fee' };

  // Create and send transaction
  const tx = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey,
      toPubkey,
      lamports: amount
    })
  );
  const signature = await sendAndConfirmTransaction(connection, tx, [keypair]);
  return { success: true, signature };
}

module.exports = { sweepToMasterWallet }; 