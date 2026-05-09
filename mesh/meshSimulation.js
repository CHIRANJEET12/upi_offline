const { receivePackets, goOnlineandFlush } = require("./bridgeNode");

function nodeA(packet){
    receivePackets(packet);
}

function nodeB(packet) {
    receivePackets(packet);
}

function nodeC(packet) {
    receivePackets(packet);
}

function simulateHops(packet){
    console.log("\n--- Mesh Simulation Start ---\n");

    nodeA(packet);          // sender meets A
    nodeB(packet);          // A passes to B
    nodeC(packet);          // B passes to C

    console.log("\nNode C walks outside and gets internet...\n");
    goOnlineandFlush();
}


module.exports = { simulateHops };