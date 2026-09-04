"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Phone, MapPin } from "lucide-react";

const PALETTE = ["#1f5c55", "#12665C", "#8A6D00", "#2F5D8A", "#4A7A5D", "#8A3B4A"];
function colorFor(text) {
  if (!text) return "#6B6A62";
  let hash = 0;
  for (let i = 0; i < text.length; i++) hash = text.charCodeAt(i) + ((hash << 5) - hash);
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

export default function ProviderProfilePage() {
  const { id } = useParams();

  const [provider, setProvider] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("services");

  useEffect(() => {
    fetch(`/api/services?providerId=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setServices(data.services || []);
        if (data.services && data.services.length > 0) {
          setProvider(data.services[0].provider);
        }
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#14161B]">
        <Navbar role="client" />
        <p className="p-8 text-[#6B6A62] dark:text-[#9B9A92] font-['IBM_Plex_Mono',monospace] text-sm">
          Loading...
        </p>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#14161B]">
        <Navbar role="client" />
        <p className="p-8 text-[#6B6A62] dark:text-[#9B9A92]">Provider not found.</p>
      </div>
    );
  }

  const accent = colorFor(provider.category);

  const prices = services.map((s) => s.price).filter((p) => typeof p === "number");
  const minPrice = prices.length ? Math.min(...prices) : null;
  const maxPrice = prices.length ? Math.max(...prices) : null;
  const priceRange =
    minPrice === null ? "—" : minPrice === maxPrice ? `$${minPrice}` : `$${minPrice}–$${maxPrice}`;

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#14161B]">
      <Navbar role="client" />



      <div className="relative h-28 sm:h-36 overflow-hidden" style={{ backgroundColor: accent }}>
        <div
          className="absolute inset-0 opacity-[0.12] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#fff 0.6px, transparent 0.6px)",
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      <div className="max-w-3xl mx-auto px-6">


        <div className="relative z-10 -mt-10 sm:-mt-12 flex items-end gap-4 pb-6">
          <span
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-tl-2xl rounded-br-2xl flex items-center justify-center text-3xl font-semibold text-white shrink-0 ring-4 ring-[#FAFAF8] dark:ring-[#14161B] shadow-md"
            style={{ backgroundColor: accent }}
          >
            {provider.user?.name?.[0]?.toUpperCase() || "?"}
          </span>
          <div className="pb-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-[#1C1F26] dark:text-[#FAFAF8] font-['Space_Grotesk',sans-serif] truncate">
              {provider.user?.name}
            </h1>
            <p className="text-sm text-[#6B6A62] dark:text-[#9B9A92]">
              <span className="font-medium" style={{ color: accent }}>{provider.category}</span>
              {provider.address && <> · {provider.address}</>}
            </p>
          </div>
        </div>

        <div className="pb-16">


          <div>

            <div className="flex gap-1 border-b border-[#1C1F26]/10 dark:border-white/10 mb-6">
              {[
                { key: "services", label: "Services" },
                { key: "about", label: "About" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${activeTab === tab.key
                      ? "border-[#0ac251] text-[#1C1F26] dark:text-[#FAFAF8]"
                      : "border-transparent text-[#6B6A62] dark:text-[#9B9A92] hover:text-[#1C1F26] dark:hover:text-[#FAFAF8]"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "services" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {services.map((s) => (
                  <div
                    key={s.id}
                    className="border border-[#1C1F26]/10 dark:border-white/10 rounded-2xl overflow-hidden bg-white dark:bg-[#20242C]"
                  >
                    {s.images && s.images.length > 0 ? (
                      <img
                        src={s.images[0].url}
                        alt={s.name}
                        className="w-full h-40 object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-40 flex items-center justify-center text-sm"
                        style={{ backgroundColor: `${accent}14`, color: accent }}
                      >
                        {s.name}
                      </div>
                    )}

                    <div className="p-3">
                      <p className="font-semibold text-[#1C1F26] dark:text-[#FAFAF8] font-['Space_Grotesk',sans-serif]">
                        {s.name}
                      </p>
                      <p className="text-sm text-[#6B6A62] dark:text-[#9B9A92] mb-3 font-['IBM_Plex_Mono',monospace]">
                        ${s.price} • {s.duration} min
                      </p>
                      <Link
                        href={`/client/book?providerId=${id}&serviceId=${s.id}`}
                        className="block text-center text-white py-2 rounded-xl text-sm font-medium transition-opacity hover:opacity-90"
                        style={{ backgroundColor: accent }}
                      >
                        Book
                      </Link>
                    </div>
                  </div>
                ))}

                {services.length === 0 && (
                  <p className="text-[#6B6A62] dark:text-[#9B9A92]">No services yet.</p>
                )}
              </div>
            )}

            {activeTab === "about" && (
              <div className="flex flex-col gap-4">


                <div className="grid grid-cols-2 gap-3">
                  <div
                    className="rounded-2xl p-4"
                    style={{ backgroundColor: `${accent}0F` }}
                  >
                    <p className="text-2xl font-bold font-['IBM_Plex_Mono',monospace]" style={{ color: accent }}>
                      {services.length}
                    </p>
                    <p className="text-xs text-[#6B6A62] dark:text-[#9B9A92] mt-0.5">
                      {services.length === 1 ? "Service offered" : "Services offered"}
                    </p>
                  </div>
                  <div
                    className="rounded-2xl p-4"
                    style={{ backgroundColor: `${accent}0F` }}
                  >
                    <p className="text-2xl font-bold font-['IBM_Plex_Mono',monospace]" style={{ color: accent }}>
                      {priceRange}
                    </p>
                    <p className="text-xs text-[#6B6A62] dark:text-[#9B9A92] mt-0.5">
                      Price range
                    </p>
                  </div>
                </div>

                <div className="bg-white dark:bg-[#20242C] border border-[#1C1F26]/10 dark:border-white/10 rounded-2xl p-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#6B6A62] dark:text-[#9B9A92] mb-2">
                    About
                  </p>
                  {provider.bio ? (
                    <p className="text-sm text-[#1C1F26] dark:text-[#FAFAF8] mb-5 leading-relaxed">
                      {provider.bio}
                    </p>
                  ) : (
                    <p className="text-sm text-[#6B6A62] dark:text-[#9B9A92] italic mb-5">
                      This provider hasn't added a bio yet.
                    </p>
                  )}

                  <p className="text-xs font-semibold uppercase tracking-wider text-[#6B6A62] dark:text-[#9B9A92] mb-2">
                    Contact
                  </p>
                  <div className="text-sm text-[#1C1F26] dark:text-[#FAFAF8] space-y-2">
                    {provider.user?.phone && (
                      <p className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-[#6B6A62] dark:text-[#9B9A92]" strokeWidth={1.75} />
                        {provider.user.phone}
                      </p>
                    )}
                    {provider.address && (
                      <p className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#6B6A62] dark:text-[#9B9A92]" strokeWidth={1.75} />
                        {provider.address}
                      </p>
                    )}
                    {!provider.user?.phone && !provider.address && (
                      <p className="text-[#6B6A62] dark:text-[#9B9A92] italic">
                        No contact details added yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 