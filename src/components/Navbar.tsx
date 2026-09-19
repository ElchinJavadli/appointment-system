"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

type NavLink = { href: string; label: string };

const LINKS: Record<string, NavLink[]> = {
  client: [
    { href: "/client/dashboard", label: "Providers" },
    { href: "/client/profile", label: "Profile" },
  ],
  provider: [
    { href: "/provider/dashboard", label: "Appointments" },
    { href: "/provider/services", label: "Services" },
    { href: "/provider/schedule", label: "Schedule" },
    { href: "/provider/profile", label: "Profile" },
  ],
  admin: [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/providers", label: "Providers" },
  ],
};

const HOME: Record<string, string> = {
  client: "/client/dashboard",
  provider: "/provider/dashboard",
  admin: "/admin/dashboard",
};

export default function Navbar({ role }: { role?: string }) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const links = (role && LINKS[role]) || [];
  const homeLink = (role && HOME[role]) || "/";

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const logoutStyle = { backgroundColor: "#8A3B4A33", color: "#E8A5B0" };

  return (
    <nav className="relative z-50 bg-[#1C1F26] dark:bg-[#14161B] text-white transition-colors">
      <div className="px-4 sm:px-6 py-4 flex justify-between items-center gap-3">
        <Link
          href={homeLink}
          className="flex items-center gap-2.5 font-semibold text-lg tracking-tight font-['Space_Grotesk',sans-serif] shrink-0"
        >
          <span className="w-7 h-7 rounded-lg bg-[#72b0ab] flex items-center justify-center text-white text-sm font-bold">
            A
          </span>
          Appointment
        </Link>


        <div className="hidden md:flex items-center gap-4 text-sm">
          {links.map((l) => (
            <Link
              key={l.href + l.label}
              href={l.href}
              className="text-white/70 hover:text-white transition-colors"
            >
              {l.label}
            </Link>
          ))}

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
            style={logoutStyle}
          >
            Logout
          </button>
        </div>


        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>


      {open && (
        <div
          className="md:hidden fixed inset-0 -z-10"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}


      {open && (
        <div className="md:hidden absolute top-full inset-x-0 bg-[#1C1F26] dark:bg-[#14161B] border-t border-white/10 shadow-lg shadow-black/30 px-4 py-3 flex flex-col gap-1 text-sm">
          {links.map((l) => (
            <Link
              key={l.href + l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="py-2.5 px-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              {l.label}
            </Link>
          ))}

          <div className="h-px bg-white/10 my-1" />

          <div className="flex gap-2 pt-1">
            <button
              onClick={toggleTheme}
              className="flex-1 bg-white/10 hover:bg-white/20 px-3 py-2.5 rounded-lg transition-colors font-['IBM_Plex_Mono',monospace] text-xs"
            >
              {theme === "light" ? "Dark" : "Light"}
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 px-3 py-2.5 rounded-lg transition-colors"
              style={logoutStyle}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}