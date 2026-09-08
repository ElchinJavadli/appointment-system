"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { STATUS } from "@/components/AppointmentCard";
import type { FormEvent, ChangeEvent } from "react";

const inputClass =
  "w-full bg-[#FAFAF8] dark:bg-[#14161B] border border-[#1C1F26]/15 dark:border-white/10 rounded-xl px-3 py-2 text-[#1C1F26] dark:text-[#FAFAF8] outline-none focus:border-[#C2540A]/60 transition-colors text-sm";
const labelClass = "block text-xs font-semibold uppercase tracking-wide mb-1 text-[#6B6A62] dark:text-[#9B9A92]";

export default function ProviderServices() {
  const [providerId, setProviderId] = useState<number | null>(null);
  const [services, setServices] = useState<any[]>([]);
  const [message, setMessage] = useState("");



  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");


  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editDuration, setEditDuration] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const loadServices = async (pid: number | null) => {
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

  const handleAddService = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    const res = await fetch("/api/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price, duration, providerId, description }),
    });

    if (!res.ok) {
      const data = await res.json();
      setMessage(data.message);
      return;
    }

    setName("");
    setPrice("");
    setDuration("");
    setDescription("");
    loadServices(providerId);
  };

  const startEditing = (s: any) => {
    setEditingId(s.id);
    setEditName(s.name);
    setEditPrice(String(s.price));
    setEditDuration(String(s.duration));
    setEditDescription(s.description || "");
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

    const saveEditing = async (id: number) => {
    setMessage("");

    const res = await fetch(`/api/services/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editName,
        price: editPrice,
        duration: editDuration,
        description: editDescription,
      }),
    });

    const text = await res.text();
    const data = text ? JSON.parse(text) : {};

    if (!res.ok) {
      setMessage(data.message || "Something went wrong while saving");
      return;
    }

    setEditingId(null);
    loadServices(providerId);
  };

    const handleDeleteService = async (id: number) => {
    const confirmed = confirm("Are you sure you want to delete this service?");
    if (!confirmed) return;

    const res = await fetch(`/api/services/${id}`, { method: "DELETE" });

    const text = await res.text();
    const data = text ? JSON.parse(text) : {};

    if (!res.ok) {
      setMessage(data.message || "Something went wrong while deleting");
      return;
    }

    loadServices(providerId);
  };

  const handleImageDelete = async (imageId: number) => {
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

  const handleImageUpload = async (serviceId: number, file: File) => {
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

        {message && (
          <p
            className="text-sm mb-4 px-3 py-2 rounded-lg"
            style={{ color: STATUS.cancelled.color, backgroundColor: `${STATUS.cancelled.color}14` }}
          >
            {message}
          </p>
        )}

        <form
          onSubmit={handleAddService}
          className="bg-white dark:bg-[#20242C] border border-[#1C1F26]/10 dark:border-white/10 rounded-2xl p-5 mb-6"
        >
          <h2 className="text-xs font-semibold uppercase tracking-wide text-[#6B6A62] dark:text-[#9B9A92] mb-3">
            Add a new service
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            <div>
              <label className={labelClass}>Service name</label>
              <input
                type="text"
                value={name}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Price ($)</label>
              <input
                type="number"
                value={price}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPrice(e.target.value)}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Duration (min)</label>
              <input
                type="number"
                value={duration}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setDuration(e.target.value)}
                className={inputClass}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className={labelClass}>Description</label>
            <textarea
              value={description}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
              rows={3}
              placeholder="Optional description of the service"
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            className="bg-[#1C1F26] dark:bg-[#72b0ab] text-white px-5 py-2 rounded-xl hover:bg-[#72b0ab] dark:hover:bg-[#4e9690] transition-colors font-medium text-sm"
          >
            Add Service
          </button>
        </form>

        {services.length === 0 ? (
          <div className="border border-dashed border-[#1C1F26]/20 dark:border-white/15 rounded-2xl p-10 text-center">
            <p className="text-[#6B6A62] dark:text-[#9B9A92] text-sm">
              You haven't added any services yet — use the form above to add your first one.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {services.map((s) => {
              const isEditing = editingId === s.id;

              return (
                <div
                  key={s.id}
                  className="bg-white dark:bg-[#20242C] border border-[#1C1F26]/10 dark:border-white/10 rounded-2xl p-5"
                >
                  {!isEditing ? (
                    <>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 min-w-0">
                          {s.images && s.images.length > 0 ? (
                            <img src={s.images[0].url} alt={s.name} className="w-14 h-14 rounded-lg object-cover shrink-0" />
                          ) : (
                            <div className="w-14 h-14 rounded-lg bg-[#FAFAF8] dark:bg-[#14161B] shrink-0" />
                          )}

                          <div className="min-w-0">
                            <p className="font-semibold text-[#1C1F26] dark:text-[#FAFAF8] font-['Space_Grotesk',sans-serif]">
                              {s.name}
                            </p>
                            <p className="text-sm text-[#6B6A62] dark:text-[#9B9A92] font-['IBM_Plex_Mono',monospace] mt-0.5">
                              ${s.price} · {s.duration} min
                            </p>
                            {s.description ? (
                              <p className="text-sm text-[#1C1F26] dark:text-[#FAFAF8] mt-2 leading-relaxed">
                                {s.description}
                              </p>
                            ) : (
                              <p className="text-sm text-[#6B6A62] dark:text-[#9B9A92] italic mt-2">
                                No description added yet.
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => startEditing(s)}
                            className="text-xs font-medium px-3 py-1.5 rounded-lg bg-[#C2540A]/10 text-[#72b0ab] hover:bg-[#C2540A]/20 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteService(s.id)}
                            className="text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors"
                            style={{ color: STATUS.cancelled.color, borderColor: `${STATUS.cancelled.color}55` }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-dashed border-[#1C1F26]/10 dark:border-white/10">
                        <p className={labelClass}>Photos</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          {s.images && s.images.map((img: any) => (
                            <div key={img.id} className="relative inline-block">
                              <img
                                src={img.url}
                                alt={s.name}
                                className="w-14 h-14 object-cover rounded-lg border border-[#1C1F26]/10 dark:border-white/10"
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

                          <label className="inline-flex items-center justify-center cursor-pointer w-14 h-14 rounded-lg border border-dashed border-[#1C1F26]/20 dark:border-white/15 text-xs text-[#6B6A62] dark:text-[#9B9A92] hover:border-[#C2540A]/50 hover:text-[#72b0ab] transition-colors">
                            + Add
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageUpload(s.id, file);
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                        <div>
                          <label className={labelClass}>Service name</label>
                          <input
                            type="text"
                            value={editName}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setEditName(e.target.value)}
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Price ($)</label>
                          <input
                            type="number"
                            value={editPrice}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setEditPrice(e.target.value)}
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Duration (min)</label>
                          <input
                            type="number"
                            value={editDuration}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setEditDuration(e.target.value)}
                            className={inputClass}
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className={labelClass}>Description</label>
                        <textarea
                          value={editDescription}
                          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setEditDescription(e.target.value)}
                          rows={3}
                          className={inputClass}
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => saveEditing(s.id)}
                          className="bg-[#1C1F26] dark:bg-[#72b0ab] text-white px-4 py-2 rounded-xl hover:bg-[#72b0ab] dark:hover:bg-[#4e9690] transition-colors font-medium text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="px-4 py-2 rounded-xl border border-[#1C1F26]/15 dark:border-white/10 text-[#1C1F26] dark:text-[#FAFAF8] text-sm hover:border-[#C2540A]/50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}