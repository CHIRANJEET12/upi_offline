const mongoose = require("mongoose");

const nonceSchema = new mongoose.Schema({
    nonce: {
        type: String,
        unique: true,
    },
    createdAt: { type: Date, default: Date.now, expires: 300 }
});

module.exports = mongoose.model("Nonce", nonceSchema);
