// require("dotenv").config({ path: "../../.env" });
// console.log("PUBLIC_KEY exists:", !!process.env.PUBLIC_KEY);
const fs = require("fs");
const path = require("path");

const PUBLIC_KEY = fs.readFileSync(path.join(__dirname, "../../keys/public.pem"), "utf8");
console.log("PUBLIC_KEY exists:", !!PUBLIC_KEY);


// const axios = require("axios");
const { simulateHops } = require("../../../mesh/meshSimulation");
const { encryptPacket } = require("../services/crypto.service");

// simulate offline payment
async function sendPacket() {
    const payment = {
        sender: "A",
        receiver: "D",
        amount: 110,
        nonce: crypto.randomUUID(),
        signedAt: Date.now()
    };

    console.log("📱 Original Payment:", payment);
    console.log("NEW NONCE GENERATED:", payment.nonce);

    // encrypt using backend public key
    const packet = encryptPacket(payment, PUBLIC_KEY);
    console.log("🔐 Encrypted Packet Created");

    fs.writeFileSync(
        "samplePacket.json",
        JSON.stringify(packet, null, 2)
    );
    console.log("📦 Packet saved to samplePacket.json");

    //send to backend
    // const res = await axios.post(
    //     "http://localhost:5000/api/bridge/ingest",
    //     packet
    // );

    simulateHops(packet);

    // console.log("📡 Backend Response:", res.data);

}

sendPacket();