import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function GET(req) {
  const authHeader = req.headers.get("authorization"); // ✅ ambil header Authorization
  const token = authHeader?.split(" ")[1];             // ✅ ambil token-nya saja

  if (!token) {
    return NextResponse.json({ message: "Token tidak ditemukan" }, { status: 401 });
  }

  const user = verifyToken(token); // ✅ sekarang token string yang dikirim
  if (!user) {
    return NextResponse.json({ message: "Token tidak valid" }, { status: 401 });
  }

  return NextResponse.json({
  token,
  user: {
    username: user.username,
    role: user.role
  }
});
}
