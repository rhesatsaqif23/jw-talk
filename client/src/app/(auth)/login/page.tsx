"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../../../contexts/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
    } catch (err: any) {
      alert(err.response?.data?.error?.message || "Login gagal");
    }
  };

  return (
    <main className="h-screen overflow-hidden flex flex-col items-center justify-center bg-primary-main relative">
      <div className="absolute w-300 h-300 border border-white/20 rounded-full pointer-events-none"></div>
      <div className="absolute w-150 h-150 border border-white/20 rounded-full pointer-events-none"></div>

      <form
        onSubmit={handleSubmit}
        className="bg-white w-105 rounded-xl shadow-lg p-8 z-10 relative"
      >
        <h1 className="text-3xl font-bold text-primary-main text-center mb-8">
          Selamat Datang!
        </h1>

        <div className="space-y-6 text-left">
          <div>
            <label className="block text-primary-main mb-2 font-semibold">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contoh@email.com"
              required
              className="w-full p-3 rounded-lg bg-primary-light outline-none text-text-main placeholder-text-muted focus:ring-2 focus:ring-primary-hover transition-all"
            />
          </div>

          <div>
            <label className="block text-primary-main mb-2 font-semibold">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
              className="w-full p-3 rounded-lg bg-primary-light outline-none text-text-main placeholder-text-muted focus:ring-2 focus:ring-primary-hover transition-all"
            />
          </div>

          <div className="flex justify-center pt-2">
            <button
              type="submit"
              className="bg-primary-main text-white w-full py-3 rounded-lg font-bold hover:bg-primary-hover transition"
            >
              Log In
            </button>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-text-muted">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="font-semibold text-primary-main underline hover:text-primary-hover transition"
            >
              Daftar
            </Link>
          </p>
        </div>
      </form>
    </main>
  );
}
