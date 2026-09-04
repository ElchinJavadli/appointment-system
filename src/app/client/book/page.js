"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { STATUS } from "@/components/AppointmentCard";
import { Phone, MapPin } from "lucide-react";

function Perforation() {
  return (
    <div className="relative h-0 border-t-2 border-dashed border-[#1C1F26]/15 dark:border-white/15">
      <span className="absolute -left-3 -top-3 w-6 h-6 rounded-full bg-[#FAFAF8] dark:bg-[#14161B]" />
      <span className="absolute -right-3 -top-3 w-6 h-6 rounded-full bg-[#FAFAF8] dark:bg-[#14161B]" />
    </div>
  );
}


function nextDays(n) {
  const out = [];
  const today = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    out.push({
      iso: d.toISOString().slice(0, 10),
      weekday: d.toLocaleDateString("en-US", { weekday: "short" }),
      day: d.getDate(),
      month: d.toLocaleDateString("en-US", { month: "short" }),
    });
  }
  return out;
}

export default function BookPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const providerId = searchParams.get("providerId");
  const preselectedServiceId = searchParams.get("serviceId");

  const [services, setServices] = useState([]);
  const [provider, setProvider] = useState(null);
  const [selectedService, setSelectedService] = useState(
    preselectedServiceId ? Number(preselectedServiceId) : ""
  );
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [date, setDate] = useState("");
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [message, setMessage] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);


  useEffect(() => {
    if (!providerId) return;
    fetch(`/api/services?providerId=${providerId}`)
      .then((res) => res.json())
      .then((data) => {
        setServices(data.services);
        if (data.services && data.services.length > 0) {
          setProvider(data.services[0].provider);
        }
      });
  }, [providerId]);


  useEffect(() => {
    if (!selectedService || !date) {
      setSlots([]);
      return;
    }

    setLoadingSlots(true);
    fetch(
      `/api/appointments/available-slots?providerId=${providerId}&serviceId=${selectedService}&date=${date}`
    )
      .then((res) => res.json())
      .then((data) => {
        setSlots(data.slots || []);
        setLoadingSlots(false);
      });
  }, [selectedService, date, providerId]);

  const handleBook = async () => {
    setMessage("");

    if (!selectedSlot) {
      setMessage("Please select a time slot");
      return;
    }


    const meRes = await fetch("/api/me");
    const me = await meRes.json();

    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId: me.id,
        providerId,
        serviceId: selectedService,
        date,
        startTime: selectedSlot.start,
        endTime: selectedSlot.end,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.message);
      return;
    }

    router.push("/client/profile");
  };

  const activeService = services.find((s) => s.id === selectedService);
  const activeImages = activeService?.images || [];
  const dateChips = nextDays(14);
  const selectedChip = dateChips.find((c) => c.iso === date);

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#14161B]">
      <Navbar role="client" />

      <div className="p-6 sm:p-8 max-w-xl mx-auto">
        <p className="text-[11px] tracking-[0.25em] uppercase text-[#12665C] dark:text-[#7FB5A8] font-['IBM_Plex_Mono',monospace] mb-1">
          Reservation
        </p>
        <h1 className="text-2xl font-bold mb-6 text-[#1C1F26] dark:text-[#FAFAF8] font-['Space_Grotesk',sans-serif]">
          Reserve your spot
        </h1>

        {message && (
          <p
            className="text-sm mb-5 px-3 py-2 rounded-lg"
            style={{ color: STATUS.cancelled.color, backgroundColor: `${STATUS.cancelled.color}14` }}
          >
            {message}
          </p>
        )}



        {provider && (
          <Link
            href={`/client/providers/${providerId}`}
            className="flex items-center gap-3 mb-6 group"
          >
            <span
              className="w-11 h-11 rounded-full flex items-center justify-center font-semibold shrink-0"
              style={{ color: "#C2540A", backgroundColor: "#C2540A14" }}
            >
              {provider.user?.name?.[0]?.toUpperCase() || "?"}
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-[#1C1F26] dark:text-[#FAFAF8] font-['Space_Grotesk',sans-serif] truncate group-hover:text-[#C2540A] transition-colors">
                {provider.user?.name}
              </p>
              <div className="flex items-center gap-3 text-xs text-[#6B6A62] dark:text-[#9B9A92]">
                <span>{provider.category}</span>
                {provider.user?.phone && (
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3" strokeWidth={1.75} />{provider.user.phone}</span>
                )}
                {provider.address && (
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" strokeWidth={1.75} />{provider.address}</span>
                )}
              </div>
            </div>
          </Link>
        )}

        {activeService && (
          <div className="rounded-2xl overflow-hidden border border-[#1C1F26]/10 dark:border-white/10 mb-6 bg-white dark:bg-[#20242C]">
            <div className="relative w-full h-52 bg-[#FAFAF8] dark:bg-[#14161B]">
              {activeImages.length > 0 ? (
                <img
                  src={activeImages[carouselIndex]?.url}
                  alt={activeService.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm text-[#6B6A62] dark:text-[#9B9A92]">
                  No image
                </div>
              )}

              {activeImages.length > 1 && (
                <>
                  <button
                    onClick={() => setCarouselIndex((i) => (i === 0 ? activeImages.length - 1 : i - 1))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/85 dark:bg-[#20242C]/85 hover:bg-white dark:hover:bg-[#20242C] text-[#1C1F26] dark:text-white rounded-full w-8 h-8 flex items-center justify-center text-lg"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => setCarouselIndex((i) => (i === activeImages.length - 1 ? 0 : i + 1))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/85 dark:bg-[#20242C]/85 hover:bg-white dark:hover:bg-[#20242C] text-[#1C1F26] dark:text-white rounded-full w-8 h-8 flex items-center justify-center text-lg"
                  >
                    ›
                  </button>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                    {activeImages.map((_, i) => (
                      <span key={i} className={`w-1.5 h-1.5 rounded-full ${i === carouselIndex ? "bg-white" : "bg-white/50"}`} />
                    ))}
                  </div>
                </>
              )}

              <div className="absolute top-3 right-3 w-12 h-12 rounded-full bg-[#C2540A] text-white flex items-center justify-center text-[11px] font-bold font-['IBM_Plex_Mono',monospace] leading-none text-center rotate-[6deg]">
                {activeService.duration}<br />min
              </div>
            </div>
            <div className="p-4">
              <p className="font-semibold text-[#1C1F26] dark:text-[#FAFAF8] font-['Space_Grotesk',sans-serif]">
                {activeService.name}
              </p>
              <p className="text-sm text-[#12665C] dark:text-[#7FB5A8] font-['IBM_Plex_Mono',monospace] mt-0.5">
                ${activeService.price}
              </p>
            </div>
          </div>
        )}






        <label className="block mb-2 text-xs font-semibold uppercase tracking-wider text-[#6B6A62] dark:text-[#9B9A92]">
          Choose a date
        </label>
        <div className="flex gap-2 overflow-x-auto pb-2 mb-1 -mx-1 px-1">
          {dateChips.map((c) => (
            <button
              key={c.iso}
              onClick={() => { setDate(c.iso); setSelectedSlot(null); }}
              className={`shrink-0 w-14 py-2 rounded-xl border flex flex-col items-center transition-colors ${
                date === c.iso
                  ? "bg-[#1C1F26] dark:bg-[#C2540A] border-[#1C1F26] dark:border-[#C2540A] text-white"
                  : "bg-white dark:bg-[#20242C] border-[#1C1F26]/15 dark:border-white/10 text-[#1C1F26] dark:text-[#FAFAF8] hover:border-[#C2540A]/50"
              }`}
            >
              <span className="text-[10px] uppercase tracking-wide opacity-70">{c.weekday}</span>
              <span className="text-base font-semibold font-['Space_Grotesk',sans-serif] leading-tight">{c.day}</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowCustomDate((v) => !v)}
          className="text-xs text-[#C2540A] hover:underline mb-4"
        >
          {showCustomDate ? "Hide custom date" : "Pick a date further out"}
        </button>

        {showCustomDate && (
          <input
            type="date"
            value={date}
            onChange={(e) => { setDate(e.target.value); setSelectedSlot(null); }}
            className="w-full bg-[#FAFAF8] dark:bg-[#14161B] border border-[#1C1F26]/15 dark:border-white/10 rounded-xl px-3 py-2 mb-4 text-[#1C1F26] dark:text-[#FAFAF8] outline-none focus:border-[#C2540A]/60 transition-colors"
          />
        )}

        {loadingSlots && (
          <p className="text-sm text-[#6B6A62] dark:text-[#9B9A92] mb-4 font-['IBM_Plex_Mono',monospace]">
            Loading slots...
          </p>
        )}

        {!loadingSlots && date && selectedService && (
          <div className="mb-6">
            <label className="block mb-2 text-xs font-semibold uppercase tracking-wider text-[#6B6A62] dark:text-[#9B9A92]">
              Choose a time
            </label>

            {slots.length === 0 ? (
              <p className="text-sm text-[#6B6A62] dark:text-[#9B9A92]">No available slots for this day</p>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {slots.map((slot) => (
                  <button
                    key={slot.start}
                    onClick={() => setSelectedSlot(slot)}
                    className={`border rounded-xl py-2 text-sm font-['IBM_Plex_Mono',monospace] transition-colors ${
                      selectedSlot?.start === slot.start
                        ? "bg-[#C2540A] border-[#C2540A] text-white"
                        : "bg-white dark:bg-[#20242C] border-[#1C1F26]/15 dark:border-white/10 text-[#1C1F26] dark:text-[#FAFAF8] hover:border-[#C2540A]/50"
                    }`}
                  >
                    {slot.start}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {activeService && (
          <div className="rounded-2xl bg-white dark:bg-[#20242C] border border-[#1C1F26]/10 dark:border-white/10 overflow-hidden">
            <div className="p-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="font-semibold text-[#1C1F26] dark:text-[#FAFAF8] font-['Space_Grotesk',sans-serif] truncate">
                  {activeService.name}
                </p>
                <p className="text-xs text-[#6B6A62] dark:text-[#9B9A92] font-['IBM_Plex_Mono',monospace] mt-0.5">
                  {selectedChip ? `${selectedChip.weekday} ${selectedChip.day} ${selectedChip.month}` : date || "No date selected"}
                  {selectedSlot ? ` · ${selectedSlot.start}` : ""}
                </p>
              </div>
              <p className="text-lg font-bold text-[#C2540A] font-['IBM_Plex_Mono',monospace] shrink-0">
                ${activeService.price}
              </p>
            </div>

            <div className="px-4">
              <Perforation />
            </div>

            <div className="p-4">
              <button
                onClick={handleBook}
                className="w-full bg-[#1C1F26] dark:bg-[#C2540A] text-white py-2.5 rounded-xl hover:bg-[#C2540A] dark:hover:bg-[#a3450a] transition-colors font-medium"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}