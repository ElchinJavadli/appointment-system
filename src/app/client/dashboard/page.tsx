"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Search, Heart, Filter, X, Clock } from "lucide-react";
import { CategoryIcon } from "@/components/icons";
import type { MouseEvent, ChangeEvent } from "react";

const CATEGORY_COLORS: any = {
  Massage: "#C2540A",
  Hair: "#8A6D00",
  Skincare: "#12665C",
  Fitness: "#2F5D8A",
  Dental: "#4A7A5D",
  Nails: "#8A3B4A",
};

export default function ClientDashboard() {
  const [user, setUser] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const [meRes, servicesRes, favoritesRes] = await Promise.all([
      fetch("/api/me"),
      fetch("/api/services"),
      fetch("/api/favorites"),
    ]);

    const me = await meRes.json();
    const servicesData = await servicesRes.json();
    const favoritesData = await favoritesRes.json();

    setUser(me);
    setServices(servicesData.services || []);
    setFavoriteIds(new Set((favoritesData.favorites || []).map((f: any) => f.serviceId)));
    setLoading(false);
  }

  const toggleFavorite = async (e: MouseEvent, serviceId: number) => {
    e.preventDefault();
    e.stopPropagation();

    const wasFavorite = favoriteIds.has(serviceId);

    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (wasFavorite) next.delete(serviceId);
      else next.add(serviceId);
      return next;
    });

    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId }),
      });
      if (!res.ok) throw new Error("Failed to update favorite");
    } catch (err) {
      console.error(err);
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (wasFavorite) next.add(serviceId);
        else next.delete(serviceId);
        return next;
      });
    }
  };

  const categories: string[] = [];
  for (const s of services) {
    const cat = s.provider?.category;
    if (cat && !categories.includes(cat)) categories.push(cat);
  }

  const filtered = services.filter((s) => {
    const matchSearch =
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.provider?.user?.name?.toLowerCase().includes(search.toLowerCase());
    const matchCat = !category || s.provider?.category === category;
    const matchMin = !minPrice || s.price >= Number(minPrice);
    const matchMax = !maxPrice || s.price <= Number(maxPrice);
    return matchSearch && matchCat && matchMin && matchMax;
  });

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#14161B] font-[Inter,sans-serif] text-[#1C1F26] dark:text-[#FAFAF8]">
      <Navbar role="client" />

      <section className="pt-16 pb-16 px-6 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.4] dark:opacity-[0.15] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#1C1F26 0.6px, transparent 0.6px)",
            backgroundSize: "22px 22px",
            maskImage: "radial-gradient(ellipse 60% 50% at 50% 20%, black, transparent)",
          }}
        />

        <div className="relative max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 text-[#12665C] dark:text-[#7FB5A8] text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full border border-[#12665C]/30 mb-5">
            Online Booking
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4 font-['Space_Grotesk',sans-serif] tracking-tight">
            Welcome back<span className="text-[#72b0ab]">{user?.name ? `, ${user.name}` : ""}</span>
          </h1>
          <p className="text-[#6B6A62] dark:text-[#9B9A92] text-lg mb-10 leading-relaxed">
            Pick a service below and book your next appointment.
          </p>

          <div className="bg-white dark:bg-[#20242C] rounded-2xl shadow-sm p-2 flex gap-2 max-w-xl mx-auto border border-[#1C1F26]/10 dark:border-white/10">
            <div className="flex-1 flex items-center gap-3 px-4">
              <Search className="w-4 h-4 text-[#6B6A62] dark:text-[#9B9A92] shrink-0" strokeWidth={2} />
              <input
                type="text"
                placeholder="Search services or providers..."
                value={search}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                className="flex-1 text-sm bg-transparent outline-none placeholder-[#6B6A62]/70 dark:placeholder-[#9B9A92]/70"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 mb-8">
        <div className="bg-white dark:bg-[#20242C] rounded-2xl border border-[#1C1F26]/10 dark:border-white/10 p-4 flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2 text-[#6B6A62] dark:text-[#9B9A92]">
            <Filter className="w-4 h-4" strokeWidth={2} />
            <span className="text-xs font-semibold uppercase tracking-wider">Filter</span>
          </div>

          <div className="w-px h-5 bg-[#1C1F26]/10 dark:bg-white/10" />

          <select
            value={category}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value)}
            className="text-sm bg-[#FAFAF8] dark:bg-[#14161B] border border-[#1C1F26]/15 dark:border-white/10 rounded-xl px-4 py-2.5 outline-none cursor-pointer hover:border-[#72b0ab]/50 focus:border-[#72b0ab] transition-colors"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <div className="flex items-center gap-2 bg-[#FAFAF8] dark:bg-[#14161B] border border-[#1C1F26]/15 dark:border-white/10 rounded-xl px-4 py-2.5 hover:border-[#72b0ab]/50 focus-within:border-[#72b0ab] transition-colors">
            <span className="text-[#6B6A62] dark:text-[#9B9A92] text-sm font-['IBM_Plex_Mono',monospace]">$</span>
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setMinPrice(e.target.value)}
              className="w-16 text-sm bg-transparent outline-none placeholder-[#6B6A62]/60 dark:placeholder-[#9B9A92]/60 font-['IBM_Plex_Mono',monospace]"
            />
          </div>

          <div className="flex items-center gap-2 bg-[#FAFAF8] dark:bg-[#14161B] border border-[#1C1F26]/15 dark:border-white/10 rounded-xl px-4 py-2.5 hover:border-[#72b0ab]/50 focus-within:border-[#72b0ab] transition-colors">
            <span className="text-[#6B6A62] dark:text-[#9B9A92] text-sm font-['IBM_Plex_Mono',monospace]">$</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setMaxPrice(e.target.value)}
              className="w-16 text-sm bg-transparent outline-none placeholder-[#6B6A62]/60 dark:placeholder-[#9B9A92]/60 font-['IBM_Plex_Mono',monospace]"
            />
          </div>

          {(search || category || minPrice || maxPrice) && (
            <button
              onClick={() => { setSearch(""); setCategory(""); setMinPrice(""); setMaxPrice(""); }}
              className="ml-auto text-xs text-[#72b0ab] hover:text-[#5c8d89] font-semibold flex items-center gap-1 transition-colors"
            >
              <X className="w-3.5 h-3.5" strokeWidth={2.5} />
              Clear filters
            </button>
          )}
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 pb-20">
        <div className="flex items-center justify-between mb-5">
          <p className="text-[#6B6A62] dark:text-[#9B9A92] text-sm">
            <span className="font-semibold text-[#1C1F26] dark:text-[#FAFAF8] font-['IBM_Plex_Mono',monospace]">{filtered.length}</span> services available
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-[#72b0ab] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-24">
            <Search className="w-10 h-10 mx-auto mb-4 text-[#1C1F26]/20 dark:text-white/20" strokeWidth={2} />
            <h3 className="font-semibold text-lg mb-1 font-['Space_Grotesk',sans-serif]">No services found</h3>
            <p className="text-[#6B6A62] dark:text-[#9B9A92] text-sm">Try adjusting your filters or search term.</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((s) => {
            const cat = s.provider?.category || "";
            const color = CATEGORY_COLORS[cat] || "#6B6A62";
            const initials = s.provider?.user?.name?.[0]?.toUpperCase() || "?";
            const isFavorite = favoriteIds.has(s.id);

            return (
              <Link
                key={s.id}
                href={`/client/book?providerId=${s.providerId}&serviceId=${s.id}`}
                className="group relative bg-white dark:bg-[#20242C] rounded-2xl border border-[#1C1F26]/10 dark:border-white/10 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
              >
                <button
                  onClick={(e: MouseEvent) => toggleFavorite(e, s.id)}
                  className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 dark:bg-[#20242C]/90 flex items-center justify-center hover:scale-105 transition-transform"
                  title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart
                    className="w-4 h-4"
                    strokeWidth={1.75}
                    fill={isFavorite ? "currentColor" : "none"}
                    style={{ color: isFavorite ? "#e8022e" : "#6B6A62" }}
                  />
                </button>

                {s.images && s.images.length > 0 ? (
                  <img
                    src={s.images[0].url}
                    alt={s.name}
                    className="w-full h-44 object-cover"
                  />
                ) : (
                  <div className="w-full h-44 flex items-center justify-center" style={{ backgroundColor: `${color}14` }}>
                    <CategoryIcon category={cat} className="w-10 h-10" style={{ color }} />
                  </div>
                )}

                <div className="p-5 flex flex-col flex-1">
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full mb-3 w-fit"
                    style={{ color, backgroundColor: `${color}14` }}
                  >
                    <CategoryIcon category={cat} className="w-3 h-3" />
                    {cat}
                  </span>

                  <p className="font-semibold text-[#1C1F26] dark:text-[#FAFAF8] text-base mb-1 group-hover:text-[#72b0ab] transition-colors leading-snug font-['Space_Grotesk',sans-serif]">
                    {s.name}
                  </p>

                  <div className="flex items-center gap-3 text-sm text-[#6B6A62] dark:text-[#9B9A92] mb-4 font-['IBM_Plex_Mono',monospace]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" strokeWidth={2} />
                      {s.duration} min
                    </span>
                    <span className="w-1 h-1 rounded-full bg-[#1C1F26]/20 dark:bg-white/20" />
                    <span className="font-semibold text-[#1C1F26] dark:text-[#FAFAF8]">${s.price}</span>
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    <Link
                      href={`/client/providers/${s.providerId}`}
                      onClick={(e: MouseEvent) => e.stopPropagation()}
                      className="flex items-center gap-2 text-sm text-[#6B6A62] dark:text-[#9B9A92] hover:text-[#72b0ab] transition-colors"
                    >
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                        style={{ backgroundColor: color }}
                      >
                        {initials}
                      </div>
                      <span>{s.provider?.user?.name || "Unknown"}</span>
                    </Link>

                    <span className="text-xs font-semibold text-[#72b0ab] bg-[#72b0ab]/10 group-hover:bg-[#72b0ab] group-hover:text-white px-3 py-1.5 rounded-xl transition-colors">
                      Book now
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}