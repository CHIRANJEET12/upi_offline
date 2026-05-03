const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const cryptoService = require("../services/crypto.service");
const { isReplay } = require("../services/nonceStore.service");
const { preHashCheck } = require("../services/hashIdempotency.service")
const PRIVATE_KEY1 = fs.readFileSync(path.join(__dirname, "../../keys/private.pem"), "utf8");


const MAX_PACKET_AGE_MS = 5 * 60 * 1000;

// temporary in-memory dedup store
// const seen = new Set();

async function ingestPacket(req, res) {
    try{
        const packet = req.body;
        const PRIVATE_KEY = PRIVATE_KEY1;

        if(!preHashCheck(packet)){
            return res.status(200).json({
                status: "DUPLICATE_DROPPED"
            });
        }

        let data;
        try{
             data = cryptoService.decryptPacket(
                packet,
                PRIVATE_KEY
            )
        }catch (e){
            console.error("⚠️ Tampered packet detected!");
            return res.status(400).json({
                status: "TAMPER_DETECTED",
                error: e.message
            });
        }

        const now = Date.now();

        if(now - data.signedAt > MAX_PACKET_AGE_MS){
            return res.status(400).json({
                status: "PACKET_EXPIRED"
            });
        }

        //hash packet
        // const hash = hashFullPacket(packet)

        //duplicate check
        if(isReplay(data.nonce)){
            return res.status(400).json({
                status: "REPLAY_DETECTED"
            });
        }
        // seen.add(hash);


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