const express = require("express");
const router = express.Router();

router.use("/capture", require("./api/capture"));

module.exports = router;
