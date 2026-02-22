"use client";

import LoginCard from "./LoginCard";
import Link from "next/link";

export default function Home() {
  return (
    <main className="h-screen overflow-hidden flex flex-col items-center justify-center bg-blue-500 relative">
        <p className="text-3xl font-bold text-white mb-6">
            Selamat Datang!
        </p>

        <div className="absolute w-[1200px] h-[1200px] border border-white/20 rounded-full pointer-events-none"></div>
        <div className="absolute w-[600px] h-[600px] border border-white/20 rounded-full pointer-events-none"></div>
      <LoginCard />
        <Link href="/register">
            <p className="text-sm mt-6">
                Belum punya akun?{" "}
                <span className="font-semibold underline cursor-pointer text-white">
                    Daftar
                </span>
            </p>
        </Link>
    </main>
  );
}