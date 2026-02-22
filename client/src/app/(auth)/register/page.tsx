"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../../../contexts/AuthContext";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await register({
        email,
        password,
        name: username,
      });
      alert("Registrasi berhasil! Silakan login.");
    } catch (err: any) {
      alert(
        err.response?.data?.error?.message || "Registrasi gagal. Coba lagi.",
      );
    } finally {
      setIsLoading(false);
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
          Pendaftaran
        </h1>

        <div className="space-y-6">
          <div>
            <label className="block text-primary-main mb-2 font-semibold">
              Username
            </label>
            <input
              type="text"
              placeholder="Masukkan nama"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-3 rounded-lg bg-primary-light outline-none text-text-main placeholder-text-muted focus:ring-2 focus:ring-primary-hover transition-all"
            />
          </div>

          <div>
            <label className="block text-primary-main mb-2 font-semibold">
              Email
            </label>
            <input
              type="email"
              placeholder="contoh@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full p-3 rounded-lg bg-primary-light outline-none text-text-main placeholder-text-muted focus:ring-2 focus:ring-primary-hover transition-all"
            />
          </div>

          <div className="flex justify-center pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary-main text-white w-full py-3 rounded-lg font-bold hover:bg-primary-hover transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Mendaftar..." : "Daftar"}
            </button>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-text-muted">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary-main underline hover:text-primary-hover transition"
            >
              Masuk
            </Link>
          </p>
        </div>
      </form>
    </main>
  );
}
