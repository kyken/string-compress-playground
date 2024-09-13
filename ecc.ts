import crypto from 'crypto';

// ECC鍵ペアの生成
function generateECCKeyPair() {
  const ecdh = crypto.createECDH('secp256k1');
  ecdh.generateKeys();
  const privateKey = ecdh.getPrivateKey();
  const publicKey = ecdh.getPublicKey();
  return { privateKey, publicKey };
}

// ECDH（楕円曲線ディフィー・ヘルマン）を使用した共有秘密の生成
function deriveSharedSecret(privateKey: Buffer, publicKey: Buffer) {
  const ecdh = crypto.createECDH('secp256k1');
  ecdh.setPrivateKey(privateKey);
  return ecdh.computeSecret(publicKey);
}

// AES-GCMを使用したデータの暗号化
function encrypt(data: string, sharedSecret: Buffer) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', sharedSecret.slice(0, 32), iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();
  return iv.toString('hex') + ':' + encrypted + ':' + authTag.toString('hex');
}

// AES-GCMを使用したデータの復号化
function decrypt(encryptedData: string, sharedSecret: Buffer) {
  const [ivHex, encryptedHex, authTagHex] = encryptedData.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const encrypted = Buffer.from(encryptedHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-gcm', sharedSecret.slice(0, 32), iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString('utf8');
}

// 使用例
const aliceKeyPair = generateECCKeyPair();
const bobKeyPair = generateECCKeyPair();
const message = "HelloWorld";

// 送信者（Alice）側の処理
const aliceSharedSecret = deriveSharedSecret(aliceKeyPair.privateKey, bobKeyPair.publicKey);
const encryptedMessage = encrypt(message, aliceSharedSecret);
console.log("Encrypted message:", encryptedMessage);
console.log("Encrypted message length:", encryptedMessage.length);

// 受信者（Bob）側の処理
const bobSharedSecret = deriveSharedSecret(bobKeyPair.privateKey, aliceKeyPair.publicKey);
const decryptedMessage = decrypt(encryptedMessage, bobSharedSecret);
console.log("Decrypted message:", decryptedMessage);

// 鍵の表示（16進数形式）
console.log("Alice's Private Key:", aliceKeyPair.privateKey.toString('hex'));
console.log("Alice's Public Key:", aliceKeyPair.publicKey.toString('hex'));
console.log("Bob's Private Key:", bobKeyPair.privateKey.toString('hex'));
console.log("Bob's Public Key:", bobKeyPair.publicKey.toString('hex'));