import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

// lib/auth.js
export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    console.error("❌ verifyToken error:", err);
    return null;
  }
}


export function authorizeRole(user, allowedRoles) {
  return allowedRoles.includes(user.role);
}
