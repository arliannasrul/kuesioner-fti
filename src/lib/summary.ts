import { prisma } from "@/src/lib/prisma";

export type RecentSubmissionItem = {
  id: string;
  name: string;
  feedback: string;
  createdAt: Date;
  hasImage: boolean;
  hasScreenshot: boolean;
  imageUrl: string | null;
  screenshotUrl: string | null;
};

export type AdminSummary = {
  totalRespondents: number;
  recentSubmissions: RecentSubmissionItem[];
};

export async function getAdminSummary(): Promise<AdminSummary> {
  const [submissionsCount, recentSubmissionsRaw] = await Promise.all([
    prisma.submission.count(),
    prisma.submission.findMany({
      take: 50,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        feedback: true,
        createdAt: true,
        imageUrl: true,
        screenshotUrl: true,
      },
    }),
  ]);

  const recentSubmissions: RecentSubmissionItem[] = recentSubmissionsRaw.map(
    (item) => ({
      id: item.id,
      name: item.name,
      feedback: item.feedback,
      createdAt: item.createdAt,
      hasImage: Boolean(item.imageUrl),
      hasScreenshot: Boolean(item.screenshotUrl),
      imageUrl: item.imageUrl,
      screenshotUrl: item.screenshotUrl,
    })
  );

  return {
    totalRespondents: submissionsCount,
    recentSubmissions,
  };
}
