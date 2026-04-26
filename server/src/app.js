const express = require('express');
const cors = require('cors');

const bridgeRoutes = require("./routes/bridge.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/bridge", bridgeRoutes);

module.exports = app;