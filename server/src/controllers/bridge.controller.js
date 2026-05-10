const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const cryptoService = require("../services/crypto.service");
const { isReplay } = require("../services/nonceStore.service");
const { preHashCheck } = require("../services/hashIdempotency.service")
const { recordTransaction } = require("../services/ledger.service");
const { paymentProcess } = require("../services/wallet.service")
const { checkPacket } = require("../services/idempotency.service");
const PRIVATE_KEY1 = fs.readFileSync(path.join(__dirname, "../../keys/private.pem"), "utf8");


const MAX_PACKET_AGE_MS = 5 * 60 * 1000;

// temporary in-memory dedup store
// const seen = new Set();

async function ingestPacket(req, res) {
    try{
        const packet = req.body;
        if(!checkPacket(packet)){
            return res.status(200).json({
                status: "DUPLICATE_DROPPED_BY_INDEMPOTENCY_CHECK"
            });
        }
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
            console.log("RECEIVED NONCE:", data.nonce);
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
        if(await isReplay(data.nonce)){
            return res.status(400).json({
                status: "REPLAY_DETECTED"
            });
        }
        // seen.add(hash);


        console.log("TRANSACTION RECEIVED TO BE PROCESSED:", data);

        // payment process
        try{
            const paymentDetails = paymentProcess(data.sender, data.receiver, data.amount);

            if (paymentDetails.status !== "BALANCE_UPDATED") {
                return res.status(400).json(paymentDetails);
            }

            console.log("TRANSACTION UPDATED");
        }catch (err){
            console.error(err);
            return res.status(500).json({
                status: "FAILED",
                error: err.message
            });
        }

        // record each transaction
        try{
            recordTransaction(data);

            console.log("TRANSACTION LOGGED");
        }catch (err) {
            console.error(err);
            return res.status(500).json({
                status: "FAILED",
                error: err.message
            });
        }

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