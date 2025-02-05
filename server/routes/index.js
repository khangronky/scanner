const express = require("express");
const router = express.Router();

router.use("/capture", require("./api/capture"));
router.use("/students", require("./api/students"));

module.exports = router;
