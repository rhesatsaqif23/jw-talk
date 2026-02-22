"use client";

import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="h-screen overflow-hidden flex flex-col items-center justify-center bg-blue-500 relative">
      <div className="absolute w-[1200px] h-[1200px] border border-white/20 rounded-full pointer-events-none"></div>
      <div className="absolute w-[600px] h-[600px] border border-white/20 rounded-full pointer-events-none"></div>
      <div className="bg-gray-100 w-[420px] rounded-xl shadow-lg p-8">

        <h1 className="text-3xl font-bold text-blue-600 text-center mb-8">
          Pendaftaran
        </h1>

        <div className="space-y-6">

          <div>
            <label className="block text-blue-600 mb-2">Username</label>
            <input
              type="text"
              placeholder="Username"
              className="relative z-10 w-full p-3 rounded-lg bg-blue-100 outline-none text-blue-700"
            />
          </div>

          <div>
            <label className="block text-blue-600 mb-2">Email</label>
            <input
              type="email"
              placeholder="Email"
              className="relative z-10 w-full p-3 rounded-lg bg-blue-100 outline-none text-blue-700"
            />
          </div>

          <div>
            <label className="block text-blue-600 mb-2">Password</label>
            <input
              type="password"
              placeholder="********"
              className="relative z-10 w-full p-3 rounded-lg bg-blue-100 outline-none text-blue-700"
            />
          </div>

          <div className="flex justify-center">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              Daftar
            </button>
          </div>

        </div>
        <Link href="/chat">
            <p className="text-center text-sm mt-6 text-blue-600">
                Sudah punya akun?{" "}
                <span className="font-semibold underline cursor-pointer">
                    Masuk
                </span>
            </p>
        </Link>
      </div>

    </main>
  );
}