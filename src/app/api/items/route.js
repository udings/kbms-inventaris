import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const items = await client.db().collection("items").find().toArray();
    return NextResponse.json(items); // <-- Semua orang bisa ambil data
  } catch (error) {
    console.error("GET /api/items error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}


export async function POST(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const user = verifyToken(token);
    if (!user || !authorizeRole(user, ["developer"])) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const client = await clientPromise;
    const result = await client.db().collection("items").insertOne(data);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("POST /api/items error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
