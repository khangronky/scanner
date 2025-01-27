const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/", (req, res) => {
  axios
    .post("http://localhost:5500/capture", req.body)
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      console.error("Error forwarding request:", error);
      res.status(500).send("Error forwarding request");
    });
});

module.exports = router;
