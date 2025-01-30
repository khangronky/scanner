const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/", async (req, res) => {
  try {
    const response = await axios.post("http://localhost:5500/capture", req.body);
    res.send(response.data);
  } catch (e) {
    console.error(e);
    res.status(500).send("Error forwarding request");
  }
});

module.exports = router;
