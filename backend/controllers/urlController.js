const store = require("../models/urlStore");
const Log = require("../../logging-middleware/logger");

exports.createShortUrl = async (req, res) => {
  try {
    const { nanoid } = await import("nanoid"); 
    const { url, validity = 30, shortcode } = req.body;

    if (!url) {
      await Log("backend", "error", "handler", "Missing URL");
      return res.status(400).json({ error: "URL is required" });
    }

    const code = shortcode || nanoid(6);

    if (store.has(code)) {
      await Log("backend", "warn", "handler", "Shortcode already exists");
      return res.status(400).json({ error: "Shortcode already in use" });
    }

    const expiry = new Date(Date.now() + validity * 60000).toISOString();

    store.set(code, {
      originalUrl: url,
      expiry,
      clicks: [],
      createdAt: new Date().toISOString(),
    });

    await Log("backend", "info", "handler", `Short URL created: ${code}`);

    return res.status(201).json({
      shortLink: `http://localhost:5000/${code}`,
      expiry,
    });
  } catch (err) {
    await Log("backend", "fatal", "handler", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getUrlStats = async (req, res) => {
  const { code } = req.params;

  if (!store.has(code)) {
    await Log("backend", "error", "handler", "Shortcode not found");
    return res.status(404).json({ error: "Shortcode not found" });
  }

  const data = store.get(code);

  return res.json({
    shortLink: `http://localhost:5000/${code}`,
    createdAt: data.createdAt,
    expiry: data.expiry,
    originalUrl: data.originalUrl,
    totalClicks: data.clicks.length,
    clicks: data.clicks,
  });
};

exports.redirectToOriginal = async (req, res) => {
  const { code } = req.params;

  if (!store.has(code)) {
    await Log("backend", "error", "route", "Invalid shortcode");
    return res.status(404).send("Short link not found");
  }

  const entry = store.get(code);
  const now = new Date();

  if (now > new Date(entry.expiry)) {
    await Log("backend", "warn", "route", "Expired short link accessed");
    return res.status(410).send("Link has expired");
  }

  entry.clicks.push({
    timestamp: now.toISOString(),
    referrer: req.get("Referrer") || "direct",
    geo: req.ip || "unknown",
  });

  await Log("backend", "info", "route", `Redirecting to ${entry.originalUrl}`);
  return res.redirect(entry.originalUrl);
};
