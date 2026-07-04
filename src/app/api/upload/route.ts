import { requireRole } from "@/lib/api-auth";
import cloudinary from "@/lib/cloudinary/cloudinary";
import { NextRequest, NextResponse } from "next/server";

// Cloudinary's SDK needs Node APIs (streams, Buffer) — not the Edge runtime.
export const runtime = "nodejs";

const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];

export async function POST(request: NextRequest) {
  const { response: authError } = await requireRole();
  if (authError) return authError;

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { message: "Only PNG, JPG, and WebP images are allowed" },
      { status: 400 },
    );
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { message: "Image must be under 5MB" },
      { status: 400 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "blog/posts", resource_type: "image" },
          (error, uploadResult) => {
            if (error || !uploadResult) {
              reject(error ?? new Error("Upload failed"));
              return;
            }
            resolve(uploadResult as { secure_url: string; public_id: string });
          },
        );
        stream.end(buffer);
      },
    );

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch {
    return NextResponse.json(
      { message: "Image upload failed" },
      { status: 502 },
    );
  }
}

// Deletes a previously-uploaded image, e.g. when a post's featured image is
// replaced or the post itself is deleted.
export async function DELETE(request: NextRequest) {
  const { response: authError } = await requireRole();
  if (authError) return authError;

  const { publicId } = await request.json();
  if (!publicId || typeof publicId !== "string") {
    return NextResponse.json(
      { message: "publicId is required" },
      { status: 400 },
    );
  }

  await cloudinary.uploader.destroy(publicId);
  return NextResponse.json({ success: true });
}
