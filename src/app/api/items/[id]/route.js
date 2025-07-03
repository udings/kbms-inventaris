import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { verifyToken, authorizeRole } from "@/lib/auth";

// ✅ PUT /api/items/[id]
export async function PUT(request, context) {
  try {
    const { id } = await context.params; // ✅ FIXED: await context.params directly

    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const user = verifyToken(token);
    if (!user || !authorizeRole(user, ["developer"])) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    delete data._id;

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection("items").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: data },
      { returnDocument: "after" }
    );

    const updated = result.value;
    if (updated) updated._id = id;

    return NextResponse.json(updated || { message: "Updated" });
  } catch (error) {
    console.error("❌ Error updating item:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// ✅ DELETE /api/items/[id]
export async function DELETE(request, context) {
  try {
    const { id } = await context.params; // ✅ Already correct!

    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const user = verifyToken(token);
    if (!user || !authorizeRole(user, ["developer"])) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection("items").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Item deleted", result });
  } catch (error) {
    console.error("❌ Error deleting item:", error);
    return NextResponse.json({ message: "Failed to delete item" }, { status: 500 });
  }
}