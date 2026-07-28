# Kuesioner App (with Google OAuth)

Aplikasi kuesioner berbasis Next.js dengan fitur autentikasi Google OAuth untuk proteksi halaman dan API Admin.

## Fitur Baru (Ujian Akhir Semester)

- **Login Google OAuth:** Halaman admin kini dilindungi menggunakan Google OAuth via `next-auth`.
- **Proteksi API Admin:** API `/api/admin/*` diproteksi dari akses tanpa login dan akses selain admin menggunakan middleware dan validasi session di tiap endpoint.
- **Penyimpanan Gambar ke Cloudinary:** Semua lampiran gambar dan screenshot kini diunggah dan disimpan di Cloudinary, bukan lagi memberatkan database.
- **Fitur Logout:** Fitur untuk keluar dari sesi admin pada halaman dashboard.
- **Akses Publik:** Halaman utama untuk mengisi kuesioner tetap terbuka untuk publik.

## Persiapan & Konfigurasi

### 1. Environment Variables

Duplikat file `.env.example` menjadi `.env` lalu isikan sesuai dengan konfigurasi Anda.

```bash
cp .env.example .env
```

Contoh konfigurasi `.env`:
```
DATABASE_URL="postgresql://neondb_owner:npg_SQqz5RYa7shE@ep-restless-sun-az3cv189-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
GOOGLE_CLIENT_ID="409081526568-8nilctdj34c53j0i9a109rufphes50tc.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="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"
NEXTAUTH_SECRET="a_very_secret_string_for_nextauth_kuesioner_app"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_EMAILS="admin@gmail.com,dosen@gmail.com"
CLOUDINARY_URL="cloudinary://417413897598697:Re-8jAl4AgQ4n0Ulxt2p2IGCdbo@dpxd2wzjr"
```

### 2. Instalasi Dependencies

Jalankan perintah berikut untuk menginstal package (termasuk `next-auth` yang baru ditambahkan):

```bash
npm install
```

### 3. Migrasi Database (Opsional jika schema berubah)

Pastikan skema prisma sudah tersinkronisasi dengan database:

```bash
npx prisma generate
npx prisma db push
```

## Cara Menjalankan Aplikasi

Jalankan development server:

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

1. **Halaman Publik:** Akses `/` untuk melihat dan mengisi kuesioner tanpa login.
2. **Halaman Admin:** Akses `/admin` akan otomatis diarahkan ke halaman login. Anda harus login menggunakan akun Google dengan email yang terdaftar di `ADMIN_EMAILS`.
