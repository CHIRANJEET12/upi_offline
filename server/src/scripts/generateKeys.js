const { generateRSAKeys } = require("../services/crypto.service");

const keys = generateRSAKeys();

console.log("PUBLIC KEY:\n", keys.publicKey);
console.log("PRIVATE KEY:\n", keys.privateKey);