const fs = require("fs");
const path = require("path");

const LEDGER_FILE = path.join(__dirname, "../../ledger.json");

//ensure ledger file exists
if(!fs.existsSync(LEDGER_FILE)){
    fs.writeFileSync(LEDGER_FILE, JSON.stringify([], null, 2));
}

function readLedgerFile(){
    const data = fs.readFileSync(LEDGER_FILE, "utf-8")
    return JSON.parse(data);
}

function writeLedgerFile(data){
    fs.writeFileSync(LEDGER_FILE, JSON.stringify(data, null, 2));
}

function recordTransaction(txn){
    const ledger = readLedgerFile();
    ledger.push(txn)
    writeLedgerFile(ledger);
}

module.exports = {
    readLedgerFile,
    recordTransaction
};