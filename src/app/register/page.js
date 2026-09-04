"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const inputClass =
  "w-full bg-[#FAFAF8] dark:bg-[#14161B] border border-[#1C1F26]/15 dark:border-white/10 rounded-xl px-3 py-2 mb-4 text-[#1C1F26] dark:text-[#FAFAF8] outline-none focus:border-[#C2540A]/60 transition-colors";
const labelClass = "block mb-1 text-sm font-medium text-[#1C1F26] dark:text-[#FAFAF8]";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("client");
  const [category, setCategory] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role, category, bio }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.message);
      return;
    }

    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8] dark:bg-[#14161B] px-4 py-10">
      <form
        onSubmit={handleRegister}
        className="bg-white dark:bg-[#20242C] p-8 rounded-2xl border border-[#1C1F26]/10 dark:border-white/10 w-96"
      >
        <div className="flex flex-col items-center mb-6">
          <span className="w-9 h-9 rounded-lg bg-[#C2540A] flex items-center justify-center text-white text-base font-bold font-['Space_Grotesk',sans-serif] mb-3">
            S
          </span>
          <h1 className="text-xl font-bold text-[#1C1F26] dark:text-[#FAFAF8] font-['Space_Grotesk',sans-serif]">
            Create your account
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

        <label className={labelClass}>Full Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
          required
        />

        <label className={labelClass}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
          required
        />

        <label className={labelClass}>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
          required
        />

        <label className={labelClass}>I am a</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className={inputClass}
        >
          <option value="client">Client</option>
          <option value="provider">Service Provider</option>
        </select>

        {role === "provider" && (
          <>
            <label className={labelClass}>
              Category (e.g. Barber, Dentist, Coach)
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputClass}
            />

            <label className={labelClass}>Short bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className={inputClass}
              rows={3}
            />
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1C1F26] dark:bg-[#C2540A] text-white py-2.5 rounded-xl hover:bg-[#C2540A] dark:hover:bg-[#a3450a] disabled:opacity-60 transition-colors font-medium"
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        <p className="text-sm mt-4 text-center text-[#6B6A62] dark:text-[#9B9A92]">
          Already have an account?{" "}
          <Link href="/login" className="text-[#C2540A] font-medium">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}