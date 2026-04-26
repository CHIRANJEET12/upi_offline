require("dotenv").config();

const app = require("./src/app");
const fs = require("fs");
const path = require("path");

const publicKey = fs.readFileSync(path.join(__dirname, "/keys/public.pem"), "utf8");
const privateKey = fs.readFileSync(path.join(__dirname, "/keys/private.pem"), "utf8");

const PORT = process.env.PORT || 5000;


global.publicKey = publicKey;
global.privateKey = privateKey;

console.log("🔐 RSA Keys Generated");

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});