import { getAdminSummary } from "@/src/lib/summary";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const runtime = "nodejs";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  const allowedEmails = process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim()) || [];
  if (!session.user?.email || !allowedEmails.includes(session.user.email)) {
    return Response.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const data = await getAdminSummary();
    return Response.json(data);
  } catch (error) {
    console.error("Failed to fetch admin summary:", error);
    return Response.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
