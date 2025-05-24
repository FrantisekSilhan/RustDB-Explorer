import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const apiKey = request.headers.get("x-api-key");
  if (apiKey !== process.env.REVALIDATE_API_KEY) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid API key",
      },
      { status: 403 }
    );
  }

  const body = await request.json();
  const { item_id, class_id, name } = body;

  if (item_id) {
    await revalidateTag(`item-${item_id}`);
  }
  if (class_id) {
    await revalidateTag(`class-${class_id}`);
  }
  if (name) {
    await revalidateTag(`name-${name.toLowerCase().replace(/\s+/g, "-")}`);
  }

  return NextResponse.json({
    success: true,
    message: "Market data revalidated successfully",
    item_id,
    class_id,
    name,
  });
};