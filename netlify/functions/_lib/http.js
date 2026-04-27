const json = (statusCode, body) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
  },
  body: JSON.stringify(body),
});

const readBody = (event) => {
  try {
    return JSON.parse(event.body || "{}");
  } catch (_) {
    return null;
  }
};

module.exports = { json, readBody };

