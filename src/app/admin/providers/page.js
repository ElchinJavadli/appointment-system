"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { STATUS } from "@/lib/statusColors";



const PALETTE = ["#C2540A", "#12665C", "#8A6D00", "#2F5D8A", "#4A7A5D", "#8A3B4A"];
function colorFor(text) {
  if (!text) return "#6B6A62";
  let hash = 0;
  for (let i = 0; i < text.length; i++) hash = text.charCodeAt(i) + ((hash << 5) - hash);
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

export default function AdminProviders() {
  const [providers, setProviders] = useState([]);

  const loadProviders = async () => {
    const res = await fetch("/api/admin/providers");
    const data = await res.json();
    setProviders(data.providers);
  };

  useEffect(() => {
    loadProviders();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = confirm("Delete this provider?");
    if (!confirmed) return;

    await fetch(`/api/admin/providers/${id}`, { method: "DELETE" });
    loadProviders();
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#14161B]">
      <Navbar role="admin" />

      <div className="p-6 sm:p-8 max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#1C1F26] dark:text-[#FAFAF8] font-['Space_Grotesk',sans-serif]">
            Providers
          </h1>
          <p className="text-sm text-[#6B6A62] dark:text-[#9B9A92] mt-0.5">
            {providers.length} provider{providers.length === 1 ? "" : "s"} registered
          </p>
        </div>

        {providers.length === 0 ? (
          <div className="border border-dashed border-[#1C1F26]/20 dark:border-white/15 rounded-2xl p-10 text-center">
            <p className="text-[#6B6A62] dark:text-[#9B9A92] text-sm">No providers yet.</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#20242C] border border-[#1C1F26]/10 dark:border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1C1F26]/10 dark:border-white/10 text-left">
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#6B6A62] dark:text-[#9B9A92]">Provider</th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#6B6A62] dark:text-[#9B9A92]">Category</th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#6B6A62] dark:text-[#9B9A92]">Services</th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#6B6A62] dark:text-[#9B9A92]"></th>
                  </tr>
                </thead>
                <tbody>
                  {providers.map((p) => {
                    const accent = colorFor(p.category);
                    return (
                      <tr
                        key={p.id}
                        className="border-b border-[#1C1F26]/8 dark:border-white/8 last:border-0 hover:bg-[#FAFAF8] dark:hover:bg-[#14161B]/60 transition-colors"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <span
                              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold text-white shrink-0"
                              style={{ backgroundColor: accent }}
                            >
                              {p.user.name?.[0]?.toUpperCase() || "?"}
                            </span>
                            <span className="font-medium text-[#1C1F26] dark:text-[#FAFAF8] font-['Space_Grotesk',sans-serif]">
                              {p.user.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className="text-xs font-semibold px-2.5 py-1 rounded-full"
                            style={{ color: accent, backgroundColor: `${accent}14` }}
                          >
                            {p.category}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-[#6B6A62] dark:text-[#9B9A92] font-['IBM_Plex_Mono',monospace]">
                          {p.services.length}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors"
                            style={{ color: STATUS.cancelled.color, borderColor: `${STATUS.cancelled.color}55` }}
                          >
                            Delete Provider
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}