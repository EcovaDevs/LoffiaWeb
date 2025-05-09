import { NextResponse } from "next/server";
import { revalidatePath } from 'next/cache';
import connectToMongoDB from "@/utils/db";
import Cart from "@/models/Cart";

export async function GET(request, { params }) {
  const { userId } = params;

  try {
    await connectToMongoDB();

    // const cart = await Cart.findOne({ userId });
    const cart = await Cart.findOne({ userId })
      .populate({
        path: "items.productId",
        select: "_id title sku salePrice price variants",
      })
      .sort({ ["createdAt"]: "desc" })
      .lean();
    if (!cart) {
      return NextResponse.json({ error: "Cart not found", status: 404 });
    }

    revalidatePath(request.url);
    return NextResponse.json({
      message: `Cart found successfully`,
      status: 200,
      cart,
    });
  } catch (error) {
    console.error("Error finding user cart:", error);
    return NextResponse.json({
      error: "Failed to find user cart",
      status: 500,
    });
  }
}
