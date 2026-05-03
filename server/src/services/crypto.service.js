const crypto = require("crypto");


//generate RSA keypair(only for development)
//acts as a simulation
function generateRSAKeys(){
    const {publicKey, privateKey} = crypto.generateKeyPairSync("rsa", {
        //This sets the RSA key size to 2048 bits. That’s the main strength parameter of the key.
        modulusLength: 2048,
        //The public and private key should be returned in spki and pkcs8 structure and are encoded as PEM text.
        publicKeyEncoding: {
            type: "spki",
            format: "pem",
        },
        privateKeyEncoding: {
            type: "pkcs8",
            format: "pem",
        },
    });
    return { publicKey, privateKey };
}

//AES Encryption(payload Encryption)
function encryptAes(data, aesKey){
    //This creates a 12-byte random IV (initialization vector). For GCM, 12 bytes is the standard and recommended size. It must be unique for each encryption with the same key.
    const iv = crypto.randomBytes(12);

    // creates an AES cipher in GCM mode.
    const cipher = crypto.createCipheriv(
        "aes-256-gcm",
        aesKey,
        iv
    );
    cipher.setAAD(iv);


    let encryptedData = cipher.update(
        JSON.stringify(data),
        "utf-8",
        "base64"
    )

    encryptedData += cipher.final("base64");

    // During decryption, if even 1 bit was changed, tag verification fails.
    const tag = cipher.getAuthTag();

    return {
        iv: iv.toString("base64"),
        ciphertext: encryptedData,
        tag: tag.toString("base64"),
    };
}

// AES Decryption
function decryptAes(iv, encryptedData, tag, aesKey){
    const ivBuf = Buffer.from(iv, "base64");
    const decipher = crypto.createDecipheriv(
        "aes-256-gcm",
        aesKey,
        Buffer.from(iv, "base64")
    );

    decipher.setAAD(ivBuf);
    decipher.setAuthTag(Buffer.from(tag, "base64"));

    let decryptedData = decipher.update(
        encryptedData,
        "base64",
        "utf-8"
    );

    decryptedData += decipher.final("utf-8")

    return JSON.parse(decryptedData);
}

// RSA Encrypt AES key
function encryptRSA(aesKey, publicKey){
    return crypto.publicEncrypt(
        {
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
        },
        aesKey
    ).toString("base64");
}
// RSA Decrypt AES key
function decryptRSA(encryptedKey, privateKey) {
    return crypto.privateDecrypt(
        {
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
        },
        Buffer.from(encryptedKey, "base64")
    );
}
function encryptPacket(data, publicKey){
    const aesKey = crypto.randomBytes(32);

    const aesEncrypted = encryptAes(data, aesKey);
    const encryptedKey = encryptRSA(aesKey, publicKey);

    return {
        encryptedKey,
        ...aesEncrypted
    };
}

function decryptPacket(packet, privateKey){
    const aesKey = decryptRSA(packet.encryptedKey, privateKey);

    return decryptAes(
        packet.iv,
        packet.ciphertext,
        packet.tag,
        aesKey,
    );
}


module.exports = {
    generateRSAKeys,
    encryptPacket,
    decryptPacket
};