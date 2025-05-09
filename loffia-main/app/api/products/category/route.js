import { NextResponse } from "next/server";
import { revalidatePath } from 'next/cache';
import connectToMongoDB from "@/utils/db";
import Products from "@/models/Products";

export async function GET(request) {
  try {
    await connectToMongoDB();

    const categories = await Products.aggregate([
      {
        $group: {
          _id: "$category.title",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          title: "$_id",
          count: 1
        }
      },
      {
        $sort: { title: 1 }
      }
    ]);

    revalidatePath(request.url);
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error in categories API:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}