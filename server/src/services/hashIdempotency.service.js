const crypto = require("crypto");

const seen = new Set();

function hashFullPacket(packet){
    // console.log(packet)
    const raw = JSON.stringify(packet);
    return crypto.createHash("sha256")
        .update(raw)
        .digest("hex");
}


function preHashCheck(packet){
    const hash = hashFullPacket(packet);

    if(seen.has(hash)) return false;

    seen.add(hash);
    return true;
}

module.exports = { preHashCheck };