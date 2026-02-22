const { verifyAccessToken } = require("../auth");

function authenticateToken(req, res, next) {
  const authorization = req.headers.authorization || "";

  if (!authorization.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid bearer token." });
  }

  const token = authorization.slice("Bearer ".length).trim();

  if (!token) {
    return res.status(401).json({ message: "Missing access token." });
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id: Number(payload.sub),
      username: payload.username,
    };
    return next();
  } catch (_err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}

module.exports = {
  authenticateToken,
};
