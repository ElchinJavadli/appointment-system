"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";

export default function Navbar({ role }: { role?: string }) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  let homeLink = "/";
  if (role === "client") homeLink = "/client/dashboard";
  if (role === "provider") homeLink = "/provider/dashboard";
  if (role === "admin") homeLink = "/admin/dashboard";

  return (
    <nav className="bg-[#1C1F26] dark:bg-[#14161B] text-white px-6 py-4 flex justify-between items-center transition-colors">
      <Link
        href={homeLink}
        className="flex items-center gap-2.5 font-semibold text-lg tracking-tight font-['Space_Grotesk',sans-serif]"
      >
        <span className="w-7 h-7 rounded-lg bg-[#72b0ab] flex items-center justify-center text-white text-sm font-bold">
          A
        </span>
        Appointment
      </Link>

      <div className="flex items-center gap-5 text-sm">
        {role === "client" && (
          <>
            <Link href="/client/dashboard" className="text-white/70 hover:text-white transition-colors">Providers</Link>
            <Link href="/client/profile" className="text-white/70 hover:text-white transition-colors">Profile</Link>
          </>
        )}

        {role === "provider" && (
          <>
            <Link href="/provider/dashboard" className="text-white/70 hover:text-white transition-colors">Appointments</Link>
            <Link href="/provider/services" className="text-white/70 hover:text-white transition-colors">Services</Link>
            <Link href="/provider/schedule" className="text-white/70 hover:text-white transition-colors">Schedule</Link>
            <Link href="/provider/profile" className="text-white/70 hover:text-white transition-colors">Profile</Link>
          </>
        )}

        {role === "admin" && (
          <>
            <Link href="/admin/dashboard" className="text-white/70 hover:text-white transition-colors">Dashboard</Link>
            <Link href="/admin/users" className="text-white/70 hover:text-white transition-colors">Users</Link>
            <Link href="/admin/providers" className="text-white/70 hover:text-white transition-colors">Providers</Link>
          </>
        )}

        <div className="w-px h-5 bg-white/15" />

        <button
          onClick={toggleTheme}
          className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors font-['IBM_Plex_Mono',monospace] text-xs"
          title="Toggle dark mode"
        >
          {theme === "light" ? "Dark" : "Light"}
        </button>

        <button
          onClick={handleLogout}
          className="px-3 py-1.5 rounded-lg transition-colors"
          style={{ backgroundColor: "#8A3B4A33", color: "#E8A5B0" }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}