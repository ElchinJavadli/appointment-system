"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import AppointmentCard from "@/components/AppointmentCard";
import { STATUS } from "@/lib/statusColors";
import { CategoryIcon } from "@/components/icons";
import { X } from "lucide-react";
import type { ChangeEvent, FormEvent } from "react";

const inputClass =
  "w-full bg-[#FAFAF8] dark:bg-[#14161B] border border-[#1C1F26]/15 dark:border-white/10 rounded-xl px-3 py-2 text-[#1C1F26] dark:text-[#FAFAF8] outline-none focus:border-[#C2540A]/60 transition-colors";
const labelClass = "block mb-1 text-sm font-medium text-[#1C1F26] dark:text-[#FAFAF8]";

const CATEGORY_COLORS: any = {
  Massage: "#C2540A",
  Hair: "#8A6D00",
  Skincare: "#12665C",
  Fitness: "#2F5D8A",
  Dental: "#4A7A5D",
  Nails: "#8A3B4A",
};

function nextDays(n: number) {
  const out: any[] = [];
  const today = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    out.push({
      iso: d.toISOString().slice(0, 10),
      weekday: d.toLocaleDateString("en-US", { weekday: "short" }),
      day: d.getDate(),
    });
  }
  return out;
}

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function ClientProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarRemoving, setAvatarRemoving] = useState(false);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const [reschedulingId, setReschedulingId] = useState<number | null>(null);
  const [rDate, setRDate] = useState("");
  const [rShowCustomDate, setRShowCustomDate] = useState(false);
  const [rSlots, setRSlots] = useState<any[]>([]);
  const [rSelectedSlot, setRSelectedSlot] = useState<any>(null);
  const [rLoadingSlots, setRLoadingSlots] = useState(false);
  const [rMessage, setRMessage] = useState("");
  const [rSaving, setRSaving] = useState(false);

  const loadProfile = async () => {
    const res = await fetch("/api/profile");
    const data = await res.json();
    setName(data.name || "");
    setEmail(data.email || "");
    setPhone(data.phone || "");
    setCreatedAt(data.createdAt || null);
    setAvatarUrl(data.avatarUrl || null);
  };

  const loadFavorites = async () => {
    const res = await fetch("/api/favorites");
    const data = await res.json();
    setFavorites(data.favorites || []);
  };

  const loadAppointments = async () => {
    const meRes = await fetch("/api/me");
    const me = await meRes.json();
    const res = await fetch(`/api/appointments?clientId=${me.id}`);
    const data = await res.json();
    setAppointments(data.appointments || []);
  };

  useEffect(() => {
    Promise.all([loadProfile(), loadFavorites(), loadAppointments()]).then(() =>
      setLoading(false)
    );
  }, []);

  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarUploading(true);
    const formData = new FormData();
    formData.append("avatar", file);

    const res = await fetch("/api/profile/avatar", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setAvatarUploading(false);

    if (res.ok) {
      setAvatarUrl(data.avatarUrl);
    }
  };

  const handleAvatarRemove = async () => {
    if (avatarRemoving) return;
    setAvatarRemoving(true);
    const res = await fetch("/api/profile/avatar", { method: "DELETE" });
    setAvatarRemoving(false);
    if (res.ok) setAvatarUrl(null);
  };

  const removeFavorite = async (serviceId: number) => {
    setFavorites((prev) => prev.filter((f) => f.serviceId !== serviceId));
    await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serviceId }),
    });
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone }),
    });

    if (res.ok) {
      setError(false);
      setMessage("Your profile has been updated successfully.");
    }
    else {
      setError(true);
      setMessage("An error occurred while updating your profile. Please try again.");
    }
  }

  const handleCancel = async (id: number) => {
    const confirmed = confirm("Are you sure you want to cancel this appointment?");
    if (!confirmed) return;

    await fetch(`/api/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "cancelled" }),
    });

    loadAppointments();
  };

  const openReschedule = (a: any) => {
    setReschedulingId(a.id);
    setRDate("");
    setRShowCustomDate(false);
    setRSlots([]);
    setRSelectedSlot(null);
    setRMessage("");
  };

  const closeReschedule = () => {
    setReschedulingId(null);
    setRDate("");
    setRShowCustomDate(false);
    setRSlots([]);
    setRSelectedSlot(null);
    setRMessage("");
  };

  useEffect(() => {
    if (!reschedulingId || !rDate) {
      setRSlots([]);
      return;
    }

    const appointment = appointments.find((a) => a.id === reschedulingId);
    if (!appointment) return;

    setRLoadingSlots(true);
    fetch(
      `/api/appointments/available-slots?providerId=${appointment.providerId}&serviceId=${appointment.serviceId}&date=${rDate}`
    )
      .then((res) => res.json())
      .then((data) => {
        setRSlots(data.slots || []);
        setRLoadingSlots(false);
      });
  }, [rDate, reschedulingId]);

  const confirmReschedule = async (id: number) => {
    if (!rSelectedSlot) {
      setRMessage("Please select a time slot");
      return;
    }

    setRSaving(true);
    setRMessage("");

    const res = await fetch(`/api/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: rDate,
        startTime: rSelectedSlot.start,
        endTime: rSelectedSlot.end,
      }),
    });

    const data = await res.json();
    setRSaving(false);

    if (!res.ok) {
      setRMessage(data.message || "Something went wrong");
      return;
    }

    closeReschedule();
    loadAppointments();
  };

  const isUpcoming = (a: any) =>
    a.status !== "cancelled" &&
    a.status !== "completed" &&
    new Date(a.date) >= startOfToday();

  const upcomingAppointments = appointments.filter(isUpcoming);
  const pastAppointments = appointments.filter((a) => !isUpcoming(a));

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

  const renderAppointmentList = (list: any[], { modifiable }: { modifiable: boolean }) => {
    if (list.length === 0) {
      return (
        <p className="text-[#6B6A62] dark:text-[#9B9A92] font-['IBM_Plex_Mono',monospace] text-sm">
          Nothing here yet.
        </p>
      );
    }

    const dateChips = nextDays(14);

    return (
      <div className="flex flex-col gap-4">
        {list.map((a) => {
          const isOpen = reschedulingId === a.id;
          const accent = CATEGORY_COLORS[a.provider?.category] || "#6B6A62";

          return (
            <div key={a.id}>
              <AppointmentCard
                appointment={a}
                accentColor={accent}
                icon={<CategoryIcon category={a.provider?.category} className="w-5 h-5" style={{ color: accent }} />}
              >
                {modifiable && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => (isOpen ? closeReschedule() : openReschedule(a))}
                      className="text-sm px-3 py-1 rounded-lg border transition-colors"
                      style={{ color: "#72b0ab", borderColor: "#72b0ab55" }}
                    >
                      {isOpen ? "Close" : "Reschedule"}
                    </button>
                    <button
                      onClick={() => handleCancel(a.id)}
                      className="text-sm px-3 py-1 rounded-lg border transition-colors"
                      style={{ color: STATUS.cancelled.color, borderColor: `${STATUS.cancelled.color}55` }}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </AppointmentCard>

              {isOpen && (
                <div className="mt-2 bg-white dark:bg-[#20242C] border border-dashed border-[#1C1F26]/20 dark:border-white/15 rounded-2xl p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#6B6A62] dark:text-[#9B9A92] mb-2">
                    Pick a new date
                  </p>
                  <div className="flex gap-2 overflow-x-auto pb-2 mb-3 -mx-1 px-1">
                    {dateChips.map((c) => (
                      <button
                        key={c.iso}
                        onClick={() => { setRDate(c.iso); setRSelectedSlot(null); }}
                        className={`shrink-0 w-14 py-2 rounded-xl border flex flex-col items-center transition-colors ${
                          rDate === c.iso
                            ? "bg-[#1C1F26] dark:bg-[#72b0ab] border-[#1C1F26] dark:border-[#72b0ab] text-white"
                            : "bg-[#FAFAF8] dark:bg-[#14161B] border-[#1C1F26]/15 dark:border-white/10 text-[#1C1F26] dark:text-[#FAFAF8] hover:border-[#72b0ab]/50"
                        }`}
                      >
                        <span className="text-[10px] uppercase tracking-wide opacity-70">{c.weekday}</span>
                        <span className="text-base font-semibold font-['Space_Grotesk',sans-serif] leading-tight">{c.day}</span>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setRShowCustomDate((v) => !v)}
                    className="text-xs text-[#72b0ab] hover:underline mb-3"
                  >
                    {rShowCustomDate ? "Hide custom date" : "Pick a date further out"}
                  </button>

                  {rShowCustomDate && (
                    <input
                      type="date"
                      value={rDate}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => { setRDate(e.target.value); setRSelectedSlot(null); }}
                      className="block w-full bg-[#FAFAF8] dark:bg-[#14161B] border border-[#1C1F26]/15 dark:border-white/10 rounded-xl px-3 py-2 mb-3 text-[#1C1F26] dark:text-[#FAFAF8] outline-none focus:border-[#72b0ab]/60 transition-colors text-sm"
                    />
                  )}

                  {rLoadingSlots && (
                    <p className="text-sm text-[#6B6A62] dark:text-[#9B9A92] mb-3 font-['IBM_Plex_Mono',monospace]">
                      Loading slots...
                    </p>
                  )}

                  {!rLoadingSlots && rDate && (
                    rSlots.length === 0 ? (
                      <p className="text-sm text-[#6B6A62] dark:text-[#9B9A92] mb-3">
                        No available slots for this day
                      </p>
                    ) : (
                      <div className="grid grid-cols-4 gap-2 mb-3">
                        {rSlots.map((slot) => (
                          <button
                            key={slot.start}
                            onClick={() => setRSelectedSlot(slot)}
                            className={`border rounded-xl py-2 text-sm font-['IBM_Plex_Mono',monospace] transition-colors ${
                              rSelectedSlot?.start === slot.start
                                ? "bg-[#72b0ab] border-[#72b0ab] text-white"
                                : "bg-[#FAFAF8] dark:bg-[#14161B] border-[#1C1F26]/15 dark:border-white/10 text-[#1C1F26] dark:text-[#FAFAF8] hover:border-[#72b0ab]/50"
                            }`}
                          >
                            {slot.start}
                          </button>
                        ))}
                      </div>
                    )
                  )}

                  {rMessage && (
                    <p
                      className="text-sm mb-3 px-3 py-2 rounded-lg"
                      style={{ color: STATUS.cancelled.color, backgroundColor: `${STATUS.cancelled.color}14` }}
                    >
                      {rMessage}
                    </p>
                  )}

                  <button
                    onClick={() => confirmReschedule(a.id)}
                    disabled={rSaving}
                    className="w-full bg-[#1C1F26] dark:bg-[#72b0ab] text-white py-2 rounded-xl hover:bg-[#72b0ab] dark:hover:bg-[#5a8d8a] disabled:opacity-60 transition-colors font-medium text-sm"
                  >
                    {rSaving ? "Saving..." : "Confirm new time"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

    return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#14161B]">
      <Navbar role="client" />

      <div className="p-6 sm:p-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">

          <div className="bg-white dark:bg-[#20242C] border border-[#1C1F26]/10 dark:border-white/10 rounded-2xl overflow-hidden lg:sticky lg:top-24">
            <div className="relative h-20" style={{ backgroundColor: "#72b0ab" }}>
              <div
                className="absolute inset-0 opacity-[0.12] pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(#fff 0.6px, transparent 0.6px)",
                  backgroundSize: "18px 18px",
                }}
              />
            </div>

            <div className="px-6 pb-6">
              <div className="relative z-10 -mt-8 mb-3">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="w-16 h-16 rounded-full object-cover ring-4 ring-white dark:ring-[#20242C] shadow-md"
                  />
                ) : (
                  <span className="w-16 h-16 rounded-full bg-[#1C1F26] dark:bg-[#72b0ab] text-white flex items-center justify-center text-2xl font-bold font-['Space_Grotesk',sans-serif] ring-4 ring-white dark:ring-[#20242C] shadow-md">
                    {name?.[0]?.toUpperCase() || "?"}
                  </span>
                )}
              </div>

              <p className="font-semibold text-[#1C1F26] dark:text-[#FAFAF8] font-['Space_Grotesk',sans-serif] break-words">
                {name || "Your name"}
              </p>
              <p className="text-sm text-[#6B6A62] dark:text-[#9B9A92] break-words">{email}</p>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="bg-[#FAFAF8] dark:bg-[#14161B] rounded-xl p-3">
                  <p className="text-xl font-bold text-[#1C1F26] dark:text-[#FAFAF8] font-['IBM_Plex_Mono',monospace]">
                    {appointments.length}
                  </p>
                  <p className="text-[11px] text-[#6B6A62] dark:text-[#9B9A92] mt-0.5">Bookings</p>
                </div>
                <div className="bg-[#FAFAF8] dark:bg-[#14161B] rounded-xl p-3">
                  <p className="text-xl font-bold text-[#1C1F26] dark:text-[#FAFAF8] font-['IBM_Plex_Mono',monospace]">
                    {upcomingAppointments.length}
                  </p>
                  <p className="text-[11px] text-[#6B6A62] dark:text-[#9B9A92] mt-0.5">Upcoming</p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-dashed border-[#1C1F26]/10 dark:border-white/10">
                <p className="text-[10px] text-[#6B6A62] dark:text-[#9B9A92] uppercase tracking-wide">
                  Member since
                </p>
                <p className="text-sm font-semibold text-[#1C1F26] dark:text-[#FAFAF8] font-['IBM_Plex_Mono',monospace]">
                  {createdAt
                    ? new Date(createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
                    : "—"}
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex gap-1 bg-white dark:bg-[#20242C] border border-[#1C1F26]/10 dark:border-white/10 rounded-2xl p-1.5 mb-5 w-fit">
              {[
                { key: "upcoming", label: "Upcoming" },
                { key: "past", label: "Past" },
                { key: "favorites", label: "Favorites" },
                { key: "settings", label: "Settings" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
                    activeTab === tab.key
                      ? "bg-[#72b0ab] text-white"
                      : "text-[#6B6A62] dark:text-[#9B9A92] hover:text-[#1C1F26] dark:hover:text-[#FAFAF8]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "upcoming" && renderAppointmentList(upcomingAppointments, { modifiable: true })}
            {activeTab === "past" && renderAppointmentList(pastAppointments, { modifiable: false })}

            {activeTab === "favorites" && (
              favorites.length === 0 ? (
                <div className="border border-dashed border-[#1C1F26]/20 dark:border-white/15 rounded-2xl p-6 text-center">
                  <p className="text-[#6B6A62] dark:text-[#9B9A92] text-sm">
                    You haven't selected any favorite services yet.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {favorites.map((f) => (
                    <div
                      key={f.id}
                      className="bg-white dark:bg-[#20242C] border border-[#1C1F26]/10 dark:border-white/10 rounded-2xl p-3 flex items-center gap-3"
                    >
                      <Link
                        href={`/client/book?providerId=${f.service?.providerId}&serviceId=${f.serviceId}`}
                        className="flex items-center gap-3 flex-1 min-w-0"
                      >
                        {f.service?.images && f.service.images.length > 0 ? (
                          <img
                            src={f.service.images[0].url}
                            alt={f.service.name}
                            className="w-10 h-10 rounded-lg object-cover shrink-0"
                          />
                        ) : (
                          <span className="w-10 h-10 rounded-lg bg-[#8A3B4A]/10 shrink-0" />
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-[#1C1F26] dark:text-[#FAFAF8] font-['Space_Grotesk',sans-serif] truncate">
                            {f.service?.name}
                          </p>
                          <p className="text-xs text-[#6B6A62] dark:text-[#9B9A92] truncate font-['IBM_Plex_Mono',monospace]">
                            ${f.service?.price} · {f.service?.provider?.user?.name}
                          </p>
                        </div>
                      </Link>
                      <button
                        onClick={() => removeFavorite(f.serviceId)}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors shrink-0"
                        style={{ color: "#8A3B4A", borderColor: "#8A3B4A55" }}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )
            )}

            {activeTab === "settings" && (
              <div className="flex flex-col gap-5 max-w-xl">
                <div className="bg-white dark:bg-[#20242C] border border-[#1C1F26]/10 dark:border-white/10 rounded-2xl p-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#6B6A62] dark:text-[#9B9A92] mb-4">
                    Profile photo
                  </p>
                  <div className="flex items-center gap-4">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Avatar"
                        className="w-14 h-14 rounded-full object-cover"
                      />
                    ) : (
                      <span className="w-14 h-14 rounded-full bg-[#1C1F26] dark:bg-[#72b0ab] text-white flex items-center justify-center text-xl font-bold font-['Space_Grotesk',sans-serif]">
                        {name?.[0]?.toUpperCase() || "?"}
                      </span>
                    )}

                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer text-xs font-medium px-3 py-1.5 rounded-lg border border-[#1C1F26]/15 dark:border-white/10 text-[#1C1F26] dark:text-[#FAFAF8] hover:border-[#72b0ab]/50 hover:text-[#72b0ab] transition-colors">
                        {avatarUploading ? "Uploading..." : "Change"}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          disabled={avatarUploading}
                          className="hidden"
                        />
                      </label>

                      {avatarUrl && (
                        <button
                          type="button"
                          onClick={handleAvatarRemove}
                          disabled={avatarRemoving}
                          className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-50"
                          style={{ color: "#8A3B4A", borderColor: "#8A3B4A55" }}
                        >
                          <X className="w-3 h-3" strokeWidth={2.5} />
                          {avatarRemoving ? "Removing..." : "Remove"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="bg-white dark:bg-[#20242C] border border-[#1C1F26]/10 dark:border-white/10 rounded-2xl p-6 flex flex-col gap-4"
                >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Phone</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                      placeholder="+994 XX XXX XX XX"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Email</label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full bg-[#1C1F26]/5 dark:bg-white/5 border border-[#1C1F26]/10 dark:border-white/10 rounded-xl px-3 py-2 text-[#6B6A62] dark:text-[#9B9A92]"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    className="bg-[#1C1F26] dark:bg-[#72b0ab] text-white rounded-xl px-6 py-2.5 hover:bg-[#72b0ab] dark:hover:bg-[#5a8d8a] transition-colors font-medium"
                  >
                    Save
                  </button>

                  {message && (
                    <p
                      className="text-sm px-3 py-2 rounded-lg"
                      style={{
                        color: error ? STATUS.cancelled.color : STATUS.confirmed.color,
                        backgroundColor: error ? `${STATUS.cancelled.color}14` : `${STATUS.confirmed.color}14`,
                      }}
                    >
                      {message}
                    </p>
                  )}
                </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}