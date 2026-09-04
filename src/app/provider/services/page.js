"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { STATUS } from "@/components/AppointmentCard";

const inputClass =
  "w-full bg-[#FAFAF8] dark:bg-[#14161B] border border-[#1C1F26]/15 dark:border-white/10 rounded-xl px-3 py-2 text-[#1C1F26] dark:text-[#FAFAF8] outline-none focus:border-[#C2540A]/60 transition-colors text-sm";
const labelClass = "block text-xs font-semibold uppercase tracking-wide mb-1 text-[#6B6A62] dark:text-[#9B9A92]";

export default function ProviderServices() {
  const [providerId, setProviderId] = useState(null);
  const [services, setServices] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [message, setMessage] = useState("");

  const loadServices = async (pid) => {
    const res = await fetch(`/api/services?providerId=${pid}`);
    const data = await res.json();
    setServices(data.services);
  };

  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((me) => {
        setProviderId(me.providerId);
        loadServices(me.providerId);
      });
  }, []);

  const handleImageDelete = async (imageId) => {
    const res = await fetch(`/api/services/images/${imageId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      loadServices(providerId);
    } 
    else {
      setMessage("Image delete failed");
    }
  };

  const handleImageUpload = async (serviceId, file) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`/api/services/${serviceId}/images`, {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      loadServices(providerId);
    }
    else {
      setMessage("Image upload failed");
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    setMessage("");

    const res = await fetch("/api/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price, duration, providerId }),
    });

    if (!res.ok) {
      const data = await res.json();
      setMessage(data.message);
      return;
    }

    setName("");
    setPrice("");
    setDuration("");
    loadServices(providerId);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#14161B]">
      <Navbar role="provider" />

      <div className="p-6 sm:p-8 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#1C1F26] dark:text-[#FAFAF8] font-['Space_Grotesk',sans-serif]">
              My Services
            </h1>
            <p className="text-sm text-[#6B6A62] dark:text-[#9B9A92] mt-0.5">
              {services.length} service{services.length === 1 ? "" : "s"} listed
            </p>
          </div>
        </div>



        <form
          onSubmit={handleAddService}
          className="bg-white dark:bg-[#20242C] border border-[#1C1F26]/10 dark:border-white/10 rounded-2xl p-5 mb-6"
        >
          <h2 className="text-xs font-semibold uppercase tracking-wide text-[#6B6A62] dark:text-[#9B9A92] mb-3">
            Add a new service
          </h2>

          {message && (
            <p
              className="text-sm mb-3 px-3 py-2 rounded-lg"
              style={{ color: STATUS.cancelled.color, backgroundColor: `${STATUS.cancelled.color}14` }}
            >
              {message}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_auto] gap-3 items-end">
            <div>
              <label className={labelClass}>Service name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Price ($)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Duration (min)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className={inputClass}
                required
              />
            </div>

            <button
              type="submit"
              className="bg-[#1C1F26] dark:bg-[#C2540A] text-white px-5 py-2 rounded-xl hover:bg-[#C2540A] dark:hover:bg-[#a3450a] transition-colors font-medium text-sm h-[38px]"
            >
              Add Service
            </button>
          </div>
        </form>



        {services.length === 0 ? (
          <div className="border border-dashed border-[#1C1F26]/20 dark:border-white/15 rounded-2xl p-10 text-center">
            <p className="text-[#6B6A62] dark:text-[#9B9A92] text-sm">
              You haven't added any services yet — use the form above to add your first one.
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#20242C] border border-[#1C1F26]/10 dark:border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1C1F26]/10 dark:border-white/10 text-left">
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#6B6A62] dark:text-[#9B9A92]">Service</th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#6B6A62] dark:text-[#9B9A92]">Price</th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#6B6A62] dark:text-[#9B9A92]">Duration</th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#6B6A62] dark:text-[#9B9A92]">Photos</th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#6B6A62] dark:text-[#9B9A92]"></th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((s) => (
                    <tr key={s.id} className="border-b border-[#1C1F26]/8 dark:border-white/8 last:border-0 hover:bg-[#FAFAF8] dark:hover:bg-[#14161B]/60 transition-colors align-top">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {s.images && s.images.length > 0 ? (
                            <img src={s.images[0].url} alt={s.name} className="w-11 h-11 rounded-lg object-cover shrink-0" />
                          ) : (
                            <div className="w-11 h-11 rounded-lg bg-[#FAFAF8] dark:bg-[#14161B] shrink-0" />
                          )}
                          <span className="font-medium text-[#1C1F26] dark:text-[#FAFAF8] font-['Space_Grotesk',sans-serif]">
                            {s.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-[#1C1F26] dark:text-[#FAFAF8] font-['IBM_Plex_Mono',monospace]">
                        ${s.price}
                      </td>
                      <td className="px-5 py-4 text-[#6B6A62] dark:text-[#9B9A92] font-['IBM_Plex_Mono',monospace]">
                        {s.duration} min
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 flex-wrap max-w-[220px]">
                          {s.images && s.images.map((img) => (
                            <div key={img.id} className="relative inline-block">
                              <img
                                src={img.url}
                                alt={s.name}
                                className="w-9 h-9 object-cover rounded-md border border-[#1C1F26]/10 dark:border-white/10"
                              />
                              <button
                                onClick={() => handleImageDelete(img.id)}
                                className="absolute -top-1.5 -right-1.5 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center"
                                style={{ backgroundColor: STATUS.cancelled.color }}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <label className="inline-block cursor-pointer text-xs font-medium px-3 py-1.5 rounded-lg bg-[#C2540A]/10 text-[#C2540A] hover:bg-[#C2540A]/20 transition-colors">
                          Upload
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) handleImageUpload(s.id, file);
                            }}
                          />
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}