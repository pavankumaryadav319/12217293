const axios = require("axios");

const LOG_ENDPOINT = "http://20.244.56.144/evaluation-service/logs";

const Log = async (stack, level, pkg, message) => {
  try {
    const payload = {
      stack: stack.toLowerCase(),
      level: level.toLowerCase(),
      package: pkg.toLowerCase(),
      message,
    };
    await axios.post(LOG_ENDPOINT, payload);
  } catch (err) {
    console.error("Logging failed", err.message);
  }
};

module.exports = Log;
