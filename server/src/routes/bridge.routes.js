const express = require("express");
const router = express.Router();

const { ingestPacket } = require("../controllers/bridge.controller");

router.post("/ingest", ingestPacket);

module.exports = router;