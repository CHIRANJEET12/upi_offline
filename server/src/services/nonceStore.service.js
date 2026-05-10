// const NONCE_TTL_MS = 5 * 60 * 1000;
//
// // Map<nonce, ExpiryTime>
// const nonceMAP = new Map();
//
// function isReplay(nonce){
//     const now = Date.now();
//
//     //clears the nonce key
//     for(const [non, exp] of nonceMAP.entries()){
//         if(exp < now){
//             nonceMAP.delete(non);
//             console.log("cleared the nonce key after being expired");
//         }
//     }
//
//     //checks for the nonce
//     if(nonceMAP.has(nonce)){
//         console.log("checked for the nonce -- true");
//         return true;
//     }
//
//     //set the nonce with the ttl
//     nonceMAP.set(nonce, now + NONCE_TTL_MS);
//     console.log("set the nonce with the ttl");
//     return false;
// }


const Nonce = require("../models/nonce.models");

async function isReplay(nonce){
    try{
        console.log("➡️ nonce received:", nonce);
        const existing = await Nonce.findOne({nonce});

        if(existing){
            console.log("existing nonce found:", nonce);
            return true;
        }

        console.log("➡️ nonce received:", nonce);
        const saved = await Nonce.create({ nonce });
        console.log("Saved nonce:", saved);
        return false;
    }catch (err) {
        console.error("Nonce error:", err);
    }
}

module.exports = { isReplay };