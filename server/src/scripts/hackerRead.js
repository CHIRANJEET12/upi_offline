const packet = require("./samplePacket.json");
const { decryptPacket } = require("../services/crypto.service");
const axios = require("axios");

// const PRIVATE_KEY = global.privateKey;



// //test1
const corrupted = { ...packet };
corrupted.tag = "AAAAAAAAAAAA";
corrupted.iv = "32r23r23";



//test2
async function run() {
    try {
        const res = await axios.post(
            "http://localhost:5000/api/bridge/ingest",
            corrupted
        );
        console.log("Server accepted:", res.data);
    } catch (err) {
        console.log("❌ Tampering detected by server");
        console.log(err.response.data);
    }
}

run();

// console.log("------------------------")
// console.log("Hacker Sees the packet");
// console.log(corrupted);
// console.log(packet);
