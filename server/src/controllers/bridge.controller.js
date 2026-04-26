const cryptoService = require("../services/crypto.service");


// temporary in-memory dedup store
const seen = new Set();

async function ingestPacket(req, res) {
    try{
        const packet = req.body;

        //hash packet
        const hash = require("crypto")
            .createHash("sha256")
            .update(packet.ciphertext)
            .digest("hex");

        //duplicate check
        if(seen.has(hash)){
            return res.status(200).json({
                status: "DUPLICATE_DROPPED"
            });
        }
        seen.add(hash);

        const PRIVATE_KEY = global.privateKey;

        const data = cryptoService.decryptPacket(
            packet,
            PRIVATE_KEY
        )
        console.log("TRANSACTION RECEIVED:", data);
        return res.status(200).json({
            status: "SUCCESS",
            data
        });
    }catch (err) {
        console.error(err);
        return res.status(500).json({
            status: "FAILED",
            error: err.message
        });
    }
}

module.exports = { ingestPacket };