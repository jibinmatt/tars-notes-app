import jwt from "jsonwebtoken";

export function getUserFromToken(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);
    return decoded.userId; // ✅ Return userId from JWT
  } catch (error) {
    console.error("JWT Decode Error:", error.message);
    return null;
  }
}
