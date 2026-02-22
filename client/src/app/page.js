"use client";

import { useEffect, useState } from "react";
import { api } from "../lib/api";
import {
  clearAccessToken,
  getAccessToken,
  saveAccessToken,
} from "../lib/session";

const initialForm = { username: "", password: "" };

export default function Home() {
  const [registerForm, setRegisterForm] = useState(initialForm);
  const [loginForm, setLoginForm] = useState(initialForm);
  const [currentUser, setCurrentUser] = useState(null);
  const [status, setStatus] = useState("Ready");
  const [loading, setLoading] = useState(false);

  async function loadCurrentUser() {
    const token = getAccessToken();
    if (!token) {
      setCurrentUser(null);
      return;
    }

    try {
      const response = await api.get("/auth/me");
      setCurrentUser(response.data);
    } catch (_err) {
      clearAccessToken();
      setCurrentUser(null);
    }
  }

  useEffect(() => {
    loadCurrentUser();
  }, []);

  async function handleRegister(event) {
    event.preventDefault();
    setLoading(true);
    setStatus("Registering account...");

    try {
      await api.post("/auth/register", registerForm);
      setRegisterForm(initialForm);
      setStatus("Register success. You can login now.");
    } catch (err) {
      setStatus(err?.response?.data?.message || "Register failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(event) {
    event.preventDefault();
    setLoading(true);
    setStatus("Signing in...");

    try {
      const response = await api.post("/auth/login", loginForm);
      saveAccessToken(response.data.accessToken);
      setLoginForm(initialForm);
      await loadCurrentUser();
      setStatus("Login success.");
    } catch (err) {
      setStatus(err?.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    setLoading(true);
    setStatus("Signing out...");

    try {
      await api.post("/auth/logout");
    } catch (_err) {
      // Even if server rejects, local session should be terminated.
    } finally {
      clearAccessToken();
      setCurrentUser(null);
      setLoading(false);
      setStatus("Logout success.");
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 p-6">
      <h1 className="text-2xl font-bold">JW Talk Auth Session Demo</h1>

      <section className="rounded border p-4">
        <p className="text-sm text-gray-600">Session status: {status}</p>
        <p className="mt-2">
          Current user:{" "}
          <span className="font-semibold">
            {currentUser ? currentUser.username : "Not logged in"}
          </span>
        </p>
        {currentUser && (
          <button
            type="button"
            onClick={handleLogout}
            disabled={loading}
            className="mt-4 rounded bg-black px-4 py-2 text-white disabled:opacity-50"
          >
            Logout
          </button>
        )}
      </section>

      <section className="rounded border p-4">
        <h2 className="mb-3 text-lg font-semibold">Register</h2>
        <form className="flex flex-col gap-3" onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Username"
            value={registerForm.username}
            onChange={(event) =>
              setRegisterForm((prev) => ({
                ...prev,
                username: event.target.value,
              }))
            }
            className="rounded border px-3 py-2"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={registerForm.password}
            onChange={(event) =>
              setRegisterForm((prev) => ({
                ...prev,
                password: event.target.value,
              }))
            }
            className="rounded border px-3 py-2"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded bg-blue-700 px-4 py-2 text-white disabled:opacity-50"
          >
            Register
          </button>
        </form>
      </section>

      <section className="rounded border p-4">
        <h2 className="mb-3 text-lg font-semibold">Login</h2>
        <form className="flex flex-col gap-3" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={loginForm.username}
            onChange={(event) =>
              setLoginForm((prev) => ({
                ...prev,
                username: event.target.value,
              }))
            }
            className="rounded border px-3 py-2"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={loginForm.password}
            onChange={(event) =>
              setLoginForm((prev) => ({
                ...prev,
                password: event.target.value,
              }))
            }
            className="rounded border px-3 py-2"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded bg-green-700 px-4 py-2 text-white disabled:opacity-50"
          >
            Login
          </button>
        </form>
      </section>
    </main>
  );
}
