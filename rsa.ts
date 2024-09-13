import * as crypto from 'crypto';

// Generate RSA key pair
export const generateKeyPair = async () => {
  return crypto.generateKeyPairSync('rsa', {    
    modulusLength: 10240,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    }})
}

// Encrypt function
export function encrypt(publicKey:  crypto.KeyLike, data: string) {
  const buffer = Buffer.from(data);
  const encrypted = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256'
    },
    buffer
  );
  return encrypted.toString('base64');
}

// Decrypt function (for verification)
function decrypt(privateKey: crypto.KeyLike, encryptedData: string) {
  const buffer = Buffer.from(encryptedData, 'base64');
  const decrypted = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256'
    },
    buffer
  );
  return decrypted.toString('utf8');
}

// Main function
async function main() {
  try {
    console.log('Generating RSA key pair...');
    const { publicKey, privateKey } = await generateKeyPair();
    console.log('Key pair generated successfully.');

    const message = JSON.stringify({
      personal_information: {
    name: "ブーストリー太郎",
    address: "東京都千代田区岩本町3丁目9-2 PMO岩本町4F",
    postal_code: "1010032",
    email: "test@boostry.co.jp",
    birth: "20190101",
    is_corporate: true,
    tax_category: 10,
    representative_name: "社長太郎",
    bank_account: [
        {
            bank_name: "ブースト銀行",
            bank_branch_name: "秋葉原支店",
            bank_account_type: 0,
            bank_account_number: "0123456",
            bank_account_name: "社長太郎",
        },
    ],
    balance_certificate_issued_month: [3, 6],
    e_prime_account: {
        e_prime_email: "test@boostry.co.jp",
        e_prime_name: "ブーストリー太郎",
    },
}
    });
    console.log('Original message:', message);

    console.log('Encrypting message...');
    const encryptedMessage = encrypt(publicKey, message);
    console.log('Encrypted message:', encryptedMessage);
    console.log('Encrypted message length:', encryptedMessage.length);

    // Optional: Decrypt to verify
    console.log('Decrypting message for verification...');
    const decryptedMessage = decrypt(privateKey, encryptedMessage);
    console.log('Decrypted message:', decryptedMessage);

    if (message === decryptedMessage) {
      console.log('Encryption and decryption successful!');
    } else {
      console.log('Error: Decrypted message does not match original message.');
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main();