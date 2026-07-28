import { prisma } from "@/src/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const runtime = "nodejs";

function escapeCsvCell(value: string): string {
  const escaped = value.replace(/"/g, '""');
  return `"${escaped}"`;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  const allowedEmails = process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim()) || [];
  if (!session.user?.email || !allowedEmails.includes(session.user.email)) {
    return new Response("Forbidden", { status: 403 });
  }

  try {
    const submissions = await prisma.submission.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        feedback: true,
        imageUrl: true,
        screenshotUrl: true,
        createdAt: true,
      },
    });

    const header = [
      "ID",
      "Nama",
      "Masukan",
      "Gambar",
      "Screenshot",
      "Waktu",
    ];

    const rows = submissions.map((item) => [
      escapeCsvCell(item.id),
      escapeCsvCell(item.name),
      escapeCsvCell(item.feedback),
      escapeCsvCell(item.imageUrl || "-"),
      escapeCsvCell(item.screenshotUrl || "-"),
      escapeCsvCell(item.createdAt.toISOString()),
    ]);

    const csv = [header.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const filename = `hasil-kuesioner-${new Date().toISOString().slice(0, 10)}.csv`;

    return new Response(`\uFEFF${csv}`, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename=\"${filename}\"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Failed to export submissions:", error);
    return Response.json(
      { message: "Gagal mengekspor data" },
      { status: 500 }
    );
  }
}
