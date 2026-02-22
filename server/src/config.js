const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";
const JWT_SECRET = process.env.JWT_SECRET;
const PORT = Number(process.env.PORT || 4000);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:3000";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is required in environment variables.");
}

module.exports = {
  JWT_EXPIRES_IN,
  JWT_SECRET,
  PORT,
  CLIENT_ORIGIN,
};
