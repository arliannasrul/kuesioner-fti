import { prisma } from "@/src/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

export const runtime = "nodejs";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

// Cloudinary config
cloudinary.config({
  // CLOUDINARY_URL is automatically picked up, but we can be explicit if we want:
  // url: process.env.CLOUDINARY_URL
});

async function uploadImageFile(value: FormDataEntryValue | null): Promise<string | null> {
  if (!value || typeof value === "string") {
    return null;
  }

  if (value.size === 0) {
    return null;
  }

  if (!value.type || !value.type.startsWith("image/")) {
    throw new Error("FILE_TYPE_INVALID");
  }

  if (value.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error("FILE_TOO_LARGE");
  }

  const arrayBuffer = await value.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64String = buffer.toString("base64");
  const dataUri = `data:${value.type};base64,${base64String}`;

  try {
    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      folder: "kuesioner-app",
    });
    return uploadResult.secure_url;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    throw new Error("UPLOAD_FAILED");
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const name = String(formData.get("name") ?? "").trim();
    const feedback = String(formData.get("feedback") ?? "").trim();

    if (!name) {
      return Response.json({ message: "Nama wajib diisi" }, { status: 400 });
    }

    if (!feedback) {
      return Response.json(
        { message: "Masukan/tulisan wajib diisi" },
        { status: 400 }
      );
    }

    const imageUrl = await uploadImageFile(formData.get("image"));
    const screenshotUrl = await uploadImageFile(formData.get("screenshot"));

    const created = await prisma.submission.create({
      data: {
        name,
        feedback,
        imageUrl,
        screenshotUrl,
      },
      select: {
        id: true,
        name: true,
        feedback: true,
        imageUrl: true,
        screenshotUrl: true,
        createdAt: true,
      },
    });

    return Response.json({
      message: "Masukan berhasil dikirim",
      data: created,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "FILE_TYPE_INVALID") {
        return Response.json(
          { message: "File harus berupa gambar" },
          { status: 400 }
        );
      }

      if (error.message === "FILE_TOO_LARGE") {
        return Response.json(
          { message: "Ukuran file maksimal 5MB" },
          { status: 400 }
        );
      }

      if (error.message === "UPLOAD_FAILED") {
        return Response.json(
          { message: "Gagal mengunggah gambar ke cloud" },
          { status: 500 }
        );
      }
    }

    console.error("Failed to submit feedback:", error);
    return Response.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
