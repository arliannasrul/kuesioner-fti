"use client";

import { FormEvent, useState, useRef } from "react";

// Helper components for inline icons
const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
);

const DocumentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
  </svg>
);

export default function QuestionnaireForm() {
  const [name, setName] = useState("");
  const [feedback, setFeedback] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const screenshotInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const file = e.target.files?.[0] || null;
    setFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    if (!name.trim()) {
      setMessage({ type: 'error', text: "Nama wajib diisi" });
      return;
    }

    if (!feedback.trim()) {
      setMessage({ type: 'error', text: "Masukan/tulisan wajib diisi" });
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("feedback", feedback.trim());

      if (imageFile) formData.append("image", imageFile);
      if (screenshotFile) formData.append("screenshot", screenshotFile);

      const res = await fetch("/api/submit", {
        method: "POST",
        body: formData,
      });

      const data = (await res.json()) as { message?: string };

      if (!res.ok) {
        setMessage({ type: 'error', text: data.message ?? "Gagal menyimpan" });
        return;
      }

      setMessage({ type: 'success', text: "Terima kasih! Masukan Anda berhasil dikirim." });
      setName("");
      setFeedback("");
      setImageFile(null);
      setImagePreview(null);
      setScreenshotFile(null);
      setScreenshotPreview(null);
      if (imageInputRef.current) imageInputRef.current.value = "";
      if (screenshotInputRef.current) screenshotInputRef.current.value = "";
    } catch (error) {
      console.error("Submit failed:", error);
      setMessage({ type: 'error', text: "Terjadi kesalahan saat mengirim data" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 lg:py-12">
      <form
        onSubmit={handleSubmit}
        className="overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 transition-all"
      >
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-8 text-center sm:px-12 sm:py-10">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Form Masukan FTI</h1>
          <p className="mt-3 text-blue-100 sm:text-lg">
            Kami menghargai setiap saran dan masukan Anda untuk perbaikan website Fakultas.
          </p>
        </div>

        <div className="px-8 py-8 sm:px-12 sm:py-10 space-y-8">
          {/* Name Input */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-semibold text-slate-800">Nama Lengkap</label>
            <div className="relative">
              <UserIcon />
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Misal: Budi Santoso"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-slate-800 transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </div>

          {/* Feedback Input */}
          <div className="space-y-2">
            <label htmlFor="feedback" className="text-sm font-semibold text-slate-800">Masukan & Tindak Lanjut</label>
            <div className="relative">
              <DocumentIcon />
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Ceritakan kendala atau ide Anda secara detail..."
                rows={5}
                className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-slate-800 transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </div>

          {/* File Uploads Grid */}
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Image Upload */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-800">Foto / Bukti Dukung</label>
              <div 
                onClick={() => imageInputRef.current?.click()}
                className={`relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-all hover:bg-slate-50 ${imagePreview ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200'}`}
                style={{ height: '160px' }}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-cover opacity-60 transition-opacity hover:opacity-40" />
                ) : (
                  <div className="flex flex-col items-center p-4 text-center">
                    <UploadIcon />
                    <span className="text-sm font-medium text-slate-600">Klik untuk upload</span>
                    <span className="mt-1 text-xs text-slate-400">JPG, PNG, GIF up to 5MB</span>
                  </div>
                )}
                {imagePreview && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity hover:opacity-100">
                     <span className="rounded-lg bg-black/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">Ubah Foto</span>
                  </div>
                )}
              </div>
              <input
                ref={imageInputRef}
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, setImageFile, setImagePreview)}
                className="hidden"
              />
            </div>

            {/* Screenshot Upload */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-800">Screenshot Kendala</label>
              <div 
                onClick={() => screenshotInputRef.current?.click()}
                className={`relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-all hover:bg-slate-50 ${screenshotPreview ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-200'}`}
                style={{ height: '160px' }}
              >
                {screenshotPreview ? (
                  <img src={screenshotPreview} alt="Preview" className="h-full w-full object-cover opacity-60 transition-opacity hover:opacity-40" />
                ) : (
                  <div className="flex flex-col items-center p-4 text-center">
                    <UploadIcon />
                    <span className="text-sm font-medium text-slate-600">Klik untuk upload</span>
                    <span className="mt-1 text-xs text-slate-400">Tangkapan layar error dll.</span>
                  </div>
                )}
                {screenshotPreview && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity hover:opacity-100">
                     <span className="rounded-lg bg-black/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">Ubah Screenshot</span>
                  </div>
                )}
              </div>
              <input
                ref={screenshotInputRef}
                id="screenshot"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, setScreenshotFile, setScreenshotPreview)}
                className="hidden"
              />
            </div>
          </div>


          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="group relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-slate-900 px-6 py-4 text-base font-semibold text-white transition-all hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-900/20 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {submitting ? (
              <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <>
                Kirim Masukan Sekarang
                <svg className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Modal Notification */}
      {message && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm transition-all">
          <div className="w-full max-w-md animate-in fade-in zoom-in-95 rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex flex-col items-center text-center">
              {message.type === 'success' ? (
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                  <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : (
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                  <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              )}
              <h3 className="mb-2 text-xl font-bold text-slate-900">
                {message.type === 'success' ? 'Berhasil!' : 'Terjadi Kesalahan'}
              </h3>
              <p className="mb-6 text-slate-600">{message.text}</p>
              <button
                type="button"
                onClick={() => setMessage(null)}
                className="w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
