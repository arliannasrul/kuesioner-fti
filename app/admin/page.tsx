import { getAdminSummary } from "@/src/lib/summary";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { LogoutButton } from "@/src/components/LogoutButton";
import { redirect } from "next/navigation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  const data = await getAdminSummary();

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Dashboard Admin</h1>
              <p className="mt-2 text-slate-600">
                Total pengirim masukan: <strong>{data.totalRespondents}</strong>
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="text-sm text-slate-600 text-right mr-2 hidden sm:block">
                <p className="font-semibold text-slate-900">{session.user?.name}</p>
                <p>{session.user?.email}</p>
              </div>
              <a
                href="/api/admin/export"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
              >
                Download Hasil Kuesioner
              </a>
              <LogoutButton />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <h2 className="mb-4 text-xl font-bold text-slate-900">
            Masukan Terbaru
          </h2>

          <div className="space-y-4">
            {data.recentSubmissions.map((submission) => (
              <div
                key={submission.id}
                className="rounded-xl border border-slate-200 p-4"
              >
                <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                  <p className="font-semibold text-slate-900">{submission.name}</p>
                  <p className="text-sm text-slate-500">
                    {new Date(submission.createdAt).toLocaleString("id-ID")}
                  </p>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">
                  {submission.feedback}
                </p>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Gambar
                    </p>
                    {submission.imageUrl ? (
                      <a href={submission.imageUrl} target="_blank" rel="noreferrer">
                        <img
                          src={submission.imageUrl}
                          alt="Lampiran gambar"
                          className="max-h-64 w-full rounded-lg border border-slate-200 object-contain"
                        />
                      </a>
                    ) : (
                      <p className="text-sm text-slate-500">Tidak ada gambar.</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Screenshot
                    </p>
                    {submission.screenshotUrl ? (
                      <a
                        href={submission.screenshotUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          src={submission.screenshotUrl}
                          alt="Lampiran screenshot"
                          className="max-h-64 w-full rounded-lg border border-slate-200 object-contain"
                        />
                      </a>
                    ) : (
                      <p className="text-sm text-slate-500">Tidak ada screenshot.</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {data.recentSubmissions.length === 0 && (
              <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                Belum ada masukan yang masuk.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
