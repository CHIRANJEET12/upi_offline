const NONCE_TTL_MS = 5 * 60 * 1000;

// Map<nonce, ExpiryTime>
const nonceMAP = new Map();

function isReplay(nonce){
    const now = Date.now();

    //clears the nonce key
    for(const [non, exp] of nonceMAP.entries()){
        if(exp < now){
            nonceMAP.delete(non);
        }
    }

    //checks for the nonce
    if(nonceMAP.has(nonce)){
        return true;
    }

    //set the nonce with the ttl
    nonceMAP.set(nonce, now + NONCE_TTL_MS);
    return false;
}

module.exports = { isReplay };