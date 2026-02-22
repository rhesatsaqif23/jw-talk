import Link from "next/link";

export default function LoginCard() {
  return (
    <div className="bg-gray-100 w-[400px] rounded-xl shadow-lg p-8 text-center">
      <h2 className="text-2xl font-semibold text-blue-600 mb-6">
        JW-Talks
      </h2>

      <div className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="relative z-10 w-full p-3 rounded-lg bg-blue-100 outline-none text-blue-700"
        />

        <input
          type="password"
          placeholder="Password"
          className="relative z-10 w-full p-3 rounded-lg bg-blue-100 outline-none text-blue-700"
        />
        <Link href="/chat">
          <button className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition">
            Log In
          </button>
        </Link>
        </div>
      <p className="text-sm mt-4 underline text-blue-500 cursor-pointer">
        Lupa password?
      </p>

    </div>
  );
}