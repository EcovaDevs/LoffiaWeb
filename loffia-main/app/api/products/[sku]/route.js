import { NextResponse } from "next/server";
import { revalidatePath } from 'next/cache';
import connectToMongoDB from "@/utils/db";
import Products from "@/models/Products";

export async function GET(request, { params }) {
  const { sku } = params;

  try {
    await connectToMongoDB();

    const product = await Products.findOne({ sku: sku });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    revalidatePath(request.url);
    return NextResponse.json(product);
  } catch (error) {
    console.error("Error in product detail API:", error);
    return NextResponse.json(
      { error: "Failed to fetch product details" },
      { status: 500 }
    );
  }
}