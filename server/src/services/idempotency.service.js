const crypto = require("crypto")
const {model} = require("mongoose");

const seenPackets = new Map();
const PACKET_TTL = 10 * 60 * 1000;

function hashPack(packet){
    const raw = JSON.stringify(packet);
    return crypto.createHash("sha256")
        .update(raw)
        .digest("hex");
}

function checkPacket(packet){
    const hash = hashPack(packet);
    const now = Date.now();

    // old entires
    for(const[val, exp] of seenPackets.entries()){
        if(exp < now) seenPackets.delete(val);
    }

    if (seenPackets.has(hash)) {
        return false; // duplicate
    }

    seenPackets.set(hash, now + PACKET_TTL);
    return true; // first claimer
}

module.exports = {
    checkPacket,
};