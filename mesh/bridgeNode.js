const fs = require('fs');
const path = require('path');
const axios = require('axios');

const STORE_FILE = path.join(__dirname, "packetStore.json");
const SERVER_URL = "http://localhost:5000/api/bridge/ingest";

function readStoredPackets(){
    const data = fs.readFileSync(STORE_FILE, "utf-8");
    return JSON.parse(data);
}

function writeStoredPackets(data){
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2));
}

const seen = new Set();

function receivePackets(packet){
    const id = packet.ciphertext;
    if(seen.has(id)){
        console.log("⚠️ Local duplicate dropped");
        return;
    }
    seen.add(id);
    const store = readStoredPackets();
    store.push(packet);
    writeStoredPackets(store);
    console.log("📦 Packet received and stored locally");
}

async function goOnlineandFlush(){
    const store = readStoredPackets();

    if (store.length === 0) {
        console.log("No packets to upload.");
        return;
    }

    console.log("📡 Internet found. Uploading packets...");

    for(const packet of store){
        try {
            const res = await axios.post(SERVER_URL, packet);
            console.log("Server:", res.data.status);
        }catch(err){
            if (err.response) {
                console.log("Server response:", err.response.data.status);
            } else {
                console.log("Network error:", err.message);
            }
        }
    }

    writeStoredPackets([]);
    console.log("🧹 Store cleared after upload");
}

function forwardPacket(packet, otherNodes){
    console.log("📲 Forwarding packet to another bridge node...");
    otherNodes(packet);
}




module.exports = { receivePackets, goOnlineandFlush };