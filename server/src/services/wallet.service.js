const fs = require("fs");
const path = require("path");

const WALLET_FILE = path.join(__dirname, "../../wallets.json");

if(!fs.existsSync(WALLET_FILE)){
    fs.writeFileSync(WALLET_FILE, JSON.stringify({
        A: 50000,
        B: 20000,
        D: 10000
        }, null, 2)
    );
}

function readWallets(){
    const data = fs.readFileSync(WALLET_FILE, "utf-8");
    return JSON.parse(data);
}

function writeWallets(data){
    fs.writeFileSync(WALLET_FILE, JSON.stringify(data, null, 2));
}

function paymentProcess(sender, receiver, amount){
    const wallets = readWallets();
    if(!wallets[sender] || wallets[sender] < amount){
        return { status: "INSUFFICIENT_FUNDS" };
    }
    wallets[sender] -= amount;
    wallets[receiver] = (wallets[receiver] || 0) + amount;

    writeWallets(wallets);

    console.log(wallets);

    return { status: "BALANCE_UPDATED" };
}

module.exports = {
    paymentProcess,
};