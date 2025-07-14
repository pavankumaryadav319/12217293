const express = require("express");
const router = express.Router();
const {
  createShortUrl,
  getUrlStats,
  redirectToOriginal,
} = require("../controllers/urlController");

router.post("/shorturls", createShortUrl);
router.get("/shorturls/:code", getUrlStats);
router.get("/:code", redirectToOriginal);

module.exports = router;
