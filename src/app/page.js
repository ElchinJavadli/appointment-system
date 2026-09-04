"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Filter, X, Clock } from "lucide-react";
import { CategoryIcon } from "@/components/icons";



const CATEGORY_COLORS = {
  Massage: "#C2540A",
  Hair: "#8A6D00",
  Skincare: "#12665C",
  Fitness: "#2F5D8A",
  Dental: "#4A7A5D",
  Nails: "#8A3B4A",
};

export default function App() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => {
        setServices(data.services || []);
        setLoading(false);
      });
  }, []);

  const categories = [
    ...new Set(services.map((s) => s.provider?.category).filter(Boolean)),
  ];

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
    <div className="min-h-screen bg-[#FAFAF8] font-[Inter,sans-serif] text-[#1C1F26]">



      <nav className="fixed top-0 inset-x-0 z-50 bg-[#FAFAF8]/90 backdrop-blur-sm border-b border-[#1C1F26]/10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#C2540A] flex items-center justify-center text-white text-sm font-bold font-['Space_Grotesk',sans-serif]">A</div>
            <span className="font-semibold text-lg tracking-tight font-['Space_Grotesk',sans-serif]">Appointment</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-[#1C1F26]/70 hover:text-[#1C1F26] text-sm font-medium transition-colors px-4 py-2 rounded-lg hover:bg-[#1C1F26]/5"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="bg-[#1C1F26] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-[#C2540A] transition-colors duration-200"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>



      <section className="pt-32 pb-20 px-6 text-center relative overflow-hidden">

        <div
          className="absolute inset-0 opacity-[0.4] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#1C1F26 0.6px, transparent 0.6px)",
            backgroundSize: "22px 22px",
            maskImage: "radial-gradient(ellipse 60% 50% at 50% 20%, black, transparent)",
          }}
        />

        <div className="relative max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 text-[#12665C] text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full border border-[#12665C]/30 mb-5">
            Online Booking
          </span>
          <h1 className="text-5xl font-bold leading-tight mb-4 font-['Space_Grotesk',sans-serif] tracking-tight">
            Book your next<br />
            <span className="text-[#C2540A]">appointment</span> instantly
          </h1>
          <p className="text-[#6B6A62] text-lg mb-10 leading-relaxed">
            Discover top-rated professionals near you. Compare services, check availability, and book in seconds.
          </p>



          <div className="bg-white rounded-2xl shadow-sm p-2 flex gap-2 max-w-xl mx-auto border border-[#1C1F26]/10">
            <div className="flex-1 flex items-center gap-3 px-4">
              <Search className="w-4 h-4 text-[#6B6A62] shrink-0" strokeWidth={2} />
              <input
                type="text"
                placeholder="Search services or providers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 text-sm bg-transparent outline-none placeholder-[#6B6A62]/70"
              />
            </div>
            <button className="bg-[#C2540A] text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-[#a3450a] transition-colors duration-200">
              Search
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 mb-8">
        <div className="bg-white rounded-2xl border border-[#1C1F26]/10 p-4 flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2 text-[#6B6A62]">
            <Filter className="w-4 h-4" strokeWidth={2} />
            <span className="text-xs font-semibold uppercase tracking-wider">Filter</span>
          </div>

          <div className="w-px h-5 bg-[#1C1F26]/10" />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="text-sm bg-[#FAFAF8] border border-[#1C1F26]/15 rounded-xl px-4 py-2.5 outline-none cursor-pointer hover:border-[#C2540A]/50 transition-colors focus:border-[#C2540A] focus:ring-2 focus:ring-[#C2540A]/10"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <div className="flex items-center gap-2 bg-[#FAFAF8] border border-[#1C1F26]/15 rounded-xl px-4 py-2.5 hover:border-[#C2540A]/50 transition-colors focus-within:border-[#C2540A] focus-within:ring-2 focus-within:ring-[#C2540A]/10">
            <span className="text-[#6B6A62] text-sm font-['IBM_Plex_Mono',monospace]">$</span>
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-16 text-sm bg-transparent outline-none placeholder-[#6B6A62]/60 font-['IBM_Plex_Mono',monospace]"
            />
          </div>

          <div className="flex items-center gap-2 bg-[#FAFAF8] border border-[#1C1F26]/15 rounded-xl px-4 py-2.5 hover:border-[#C2540A]/50 transition-colors focus-within:border-[#C2540A] focus-within:ring-2 focus-within:ring-[#C2540A]/10">
            <span className="text-[#6B6A62] text-sm font-['IBM_Plex_Mono',monospace]">$</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-16 text-sm bg-transparent outline-none placeholder-[#6B6A62]/60 font-['IBM_Plex_Mono',monospace]"
            />
          </div>

          {(search || category || minPrice || maxPrice) && (
            <button
              onClick={() => { setSearch(""); setCategory(""); setMinPrice(""); setMaxPrice(""); }}
              className="ml-auto text-xs text-[#C2540A] hover:text-[#a3450a] font-semibold flex items-center gap-1 transition-colors"
            >
              <X className="w-3.5 h-3.5" strokeWidth={2.5} />
              Clear filters
            </button>
          )}
        </div>
      </section>


      <main className="max-w-6xl mx-auto px-6 pb-20">
        <div className="flex items-center justify-between mb-5">
          <p className="text-[#6B6A62] text-sm">
            <span className="font-semibold text-[#1C1F26] font-['IBM_Plex_Mono',monospace]">{filtered.length}</span> services available
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-[#C2540A] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-24">
            <Search className="w-10 h-10 mx-auto mb-4 text-[#1C1F26]/20" strokeWidth={2} />
            <h3 className="font-semibold text-lg mb-1 font-['Space_Grotesk',sans-serif]">No services found</h3>
            <p className="text-[#6B6A62] text-sm">Try adjusting your filters or search term.</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((s) => {
            const cat = s.provider?.category || "";
            const color = CATEGORY_COLORS[cat] || "#6B6A62";
            const initials = s.provider?.user?.name?.[0]?.toUpperCase() || "?";

            return (
              <Link
                key={s.id}
                href={`/client/book?providerId=${s.providerId}&serviceId=${s.id}`}
                className="group bg-white rounded-2xl border border-[#1C1F26]/10 overflow-hidden hover:shadow-lg hover:shadow-[#1C1F26]/5 hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >


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

                  <p className="font-semibold text-[#1C1F26] text-base mb-1 group-hover:text-[#C2540A] transition-colors leading-snug font-['Space_Grotesk',sans-serif]">
                    {s.name}
                  </p>

                  <div className="flex items-center gap-3 text-sm text-[#6B6A62] mb-4 font-['IBM_Plex_Mono',monospace]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#6B6A62]" strokeWidth={2} />
                      {s.duration} min
                    </span>
                    <span className="w-1 h-1 rounded-full bg-[#1C1F26]/20" />
                    <span className="font-semibold text-[#1C1F26]">${s.price}</span>
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    <Link
                      href={`/client/providers/${s.providerId}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-2 text-sm text-[#6B6A62] hover:text-[#C2540A] transition-colors"
                    >
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                        style={{ backgroundColor: color }}
                      >
                        {initials}
                      </div>
                      <span>{s.provider?.user?.name || "Unknown"}</span>
                    </Link>

                    <span className="text-xs font-semibold text-[#C2540A] bg-[#C2540A]/10 group-hover:bg-[#C2540A] group-hover:text-white px-3 py-1.5 rounded-xl transition-all duration-200">
                      Book now
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>


      <footer className="border-t border-[#1C1F26]/10 py-8 text-center text-[#6B6A62] text-sm">
        © {new Date().getFullYear()} Slotly · All rights reserved
      </footer>
    </div>
  );
} 