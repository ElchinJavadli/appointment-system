"use client";
import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.message);
      return;
    }

    if (data.role === "admin") {
      router.push("/admin/dashboard");
    }
    else if (data.role === "provider") {
      router.push("/provider/dashboard");
    }
    else {
      router.push("/client/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8] dark:bg-[#14161B] px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white dark:bg-[#20242C] p-8 rounded-2xl border border-[#1C1F26]/10 dark:border-white/10 w-96"
      >
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-xl font-bold text-[#1C1F26] dark:text-[#FAFAF8] font-['Space_Grotesk',sans-serif]">
            Welcome back
          </h1>
        </div>

        {error && (
          <p
            className="text-sm mb-4 text-center px-3 py-2 rounded-lg"
            style={{ color: "#8A3B4A", backgroundColor: "#8A3B4A14" }}
          >
            {error}
          </p>
        )}

        <label className="block mb-1 text-sm font-medium text-[#1C1F26] dark:text-[#FAFAF8]">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          className="w-full bg-[#FAFAF8] dark:bg-[#14161B] border border-[#1C1F26]/15 dark:border-white/10 rounded-xl px-3 py-2 mb-4 text-[#1C1F26] dark:text-[#FAFAF8] outline-none focus:border-[#72b0ab]/60 transition-colors"
          required
        />

        <label className="block mb-1 text-sm font-medium text-[#1C1F26] dark:text-[#FAFAF8]">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          className="w-full bg-[#FAFAF8] dark:bg-[#14161B] border border-[#1C1F26]/15 dark:border-white/10 rounded-xl px-3 py-2 mb-6 text-[#1C1F26] dark:text-[#FAFAF8] outline-none focus:border-[#72b0ab]/60 transition-colors"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1C1F26] dark:bg-[#72b0ab] text-white py-2.5 rounded-xl hover:bg-[#72b0ab] dark:hover:bg-[#5a8d8a] disabled:opacity-60 transition-colors font-medium"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm mt-4 text-center text-[#6B6A62] dark:text-[#9B9A92]">
          Don't have an account?{" "}
          <Link href="/register" className="text-[#72b0ab] font-medium">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}