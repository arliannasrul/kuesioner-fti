"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="inline-flex items-center justify-center rounded-xl bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
    >
      Logout
    </button>
  );
}
