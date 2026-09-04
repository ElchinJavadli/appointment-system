"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { STATUS } from "@/components/AppointmentCard";

const inputClass =
  "w-full bg-[#FAFAF8] dark:bg-[#14161B] border border-[#1C1F26]/15 dark:border-white/10 rounded-xl px-3 py-2 text-[#1C1F26] dark:text-[#FAFAF8] outline-none focus:border-[#C2540A]/60 transition-colors";
const labelClass = "block mb-1 text-sm font-medium text-[#1C1F26] dark:text-[#FAFAF8]";

export default function ProviderProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [category, setCategory] = useState("");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");
  const [createdAt, setCreatedAt] = useState(null);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);



  useEffect(() => {
    async function loadProfile() {
      const res = await fetch("/api/profile");
      const data = await res.json();

      setName(data.name || "");
      setEmail(data.email || "");
      setPhone(data.phone || "");
      setCreatedAt(data.createdAt || null);
      setTotalAppointments(data.totalAppointments || 0);
      setAvatarUrl(data.avatarUrl || null);

      if (data.provider) {
        setBio(data.provider.bio || "");
        setCategory(data.provider.category || "");
        setAddress(data.provider.address || "");
        setWebsite(data.provider.website || "");
      }

      setLoading(false);
    }

    loadProfile();
  }, []);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
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

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, bio, category, address, website }),
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#14161B]">
        <Navbar role="provider" />
        <p className="p-6 text-[#6B6A62] dark:text-[#9B9A92] font-['IBM_Plex_Mono',monospace] text-sm">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#14161B]">
      <Navbar role="provider" />

      <div className="p-6 sm:p-8 lg:p-10 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-[#1C1F26] dark:text-[#FAFAF8] font-['Space_Grotesk',sans-serif]">
          My Profile
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 items-start">
         
         

          <div className="bg-white dark:bg-[#20242C] border border-[#1C1F26]/10 dark:border-white/10 rounded-2xl p-6 lg:sticky lg:top-24">
            <label className="relative inline-block cursor-pointer mb-4 group">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <span className="w-16 h-16 rounded-full bg-[#C2540A] text-white flex items-center justify-center text-2xl font-bold font-['Space_Grotesk',sans-serif]">
                  {name?.[0]?.toUpperCase() || "?"}
                </span>
              )}
              <span className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-medium transition-opacity">
                {avatarUploading ? "..." : "Change"}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
            <p className="font-semibold text-[#1C1F26] dark:text-[#FAFAF8] font-['Space_Grotesk',sans-serif] mb-0.5 break-words">
              {name || "Your name"}
            </p>
            {category && (
              <p className="text-xs font-semibold uppercase tracking-wide text-[#C2540A] mb-3">
                {category}
              </p>
            )}
            <div className="text-sm text-[#6B6A62] dark:text-[#9B9A92] space-y-1 break-words mb-4">
              <p>{email}</p>
              {phone && <p>{phone}</p>}
              {address && <p>{address}</p>}
              {website && (
                <a
                  href={website.startsWith("http") ? website : `https://${website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-[#C2540A] hover:underline truncate"
                >
                  {website}
                </a>
              )}
            </div>

            <div className="pt-4 border-t border-dashed border-[#1C1F26]/10 dark:border-white/10 space-y-2">
              <div>
                <p className="text-[10px] text-[#6B6A62] dark:text-[#9B9A92] uppercase tracking-wide">Membership Date</p>
                <p className="text-sm font-semibold text-[#1C1F26] dark:text-[#FAFAF8] font-['IBM_Plex_Mono',monospace]">
                  {createdAt ? new Date(createdAt).toLocaleDateString() : "—"}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-[#6B6A62] dark:text-[#9B9A92] uppercase tracking-wide">Total Appointments</p>
                <p className="text-sm font-semibold text-[#1C1F26] dark:text-[#FAFAF8] font-['IBM_Plex_Mono',monospace]">
                  {totalAppointments}
                </p>
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
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+994 XX XXX XX XX"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g., Haircut, Photography"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g., Nizami Street 10, Baku"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Website / Instagram</label>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="instagram.com/yourprofile"
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

            <div>
              <label className={labelClass}>About Me</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                placeholder="Write a short bio about yourself and your services"
                className={inputClass}
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="bg-[#1C1F26] dark:bg-[#C2540A] text-white rounded-xl px-6 py-2.5 hover:bg-[#C2540A] dark:hover:bg-[#a3450a] transition-colors font-medium"
              >
                Save Changes
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
      </div>
    </div>
  );
}