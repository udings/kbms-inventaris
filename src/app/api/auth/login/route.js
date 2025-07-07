import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    const client = await clientPromise;
    const user = await client
      .db()
      .collection("users")
      .findOne({ username });

    if (!user) {
      return NextResponse.json({ message: "User tidak ditemukan" }, { status: 401 });
    }

    // 🔥 Bandingkan password secara langsung (karena tidak di-hash)
    if (user.password !== password) {
      return NextResponse.json({ message: "Password salah" }, { status: 401 });
    }

    // ✅ Buat token JWT
    const token = jwt.sign(
      { username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return NextResponse.json({ 
  token, 
  user: {
    username: user.username,
    role: user.role
  }
});
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
