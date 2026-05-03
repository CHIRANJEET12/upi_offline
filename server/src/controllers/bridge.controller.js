const cryptoService = require("../services/crypto.service");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const PRIVATE_KEY1 = fs.readFileSync(path.join(__dirname, "../../keys/private.pem"), "utf8");

function hashFullPacket(packet){
    console.log(packet)
    const raw = JSON.stringify(packet);
    return crypto.createHash("sha256")
        .update(raw)
        .digest("hex");
}

// temporary in-memory dedup store
const seen = new Set();

async function ingestPacket(req, res) {
    try{
        const packet = req.body;
        const PRIVATE_KEY = PRIVATE_KEY1;

        let data;
        try{
             data = cryptoService.decryptPacket(
                packet,
                PRIVATE_KEY
            )
            console.log(data);
        }catch (e){
            console.error("⚠️ Tampered packet detected!");
            return res.status(400).json({
                status: "TAMPER_DETECTED",
                error: e.message
            });
        }

        //hash packet
        const hash = hashFullPacket(packet)

        //duplicate check
        if(seen.has(hash)){
            return res.status(200).json({
                status: "DUPLICATE_DROPPED"
            });
        }
        seen.add(hash);


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