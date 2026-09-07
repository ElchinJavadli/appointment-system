"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { STATUS } from "@/lib/statusColors";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const defaultDay = () => ({
  startTime: "09:00",
  endTime: "18:00",
  isDayOff: false,
  hasBreak: false,
  breakStart: "13:00",
  breakEnd: "14:00",
});

export default function ProviderSchedule() {
  const [providerId, setProviderId] = useState<number | null>(null);

  const [schedule, setSchedule] = useState<any[]>(days.map(() => defaultDay()));
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then(async (me) => {
        setProviderId(me.providerId);

        const res = await fetch(`/api/schedule?providerId=${me.providerId}`);
        const data = await res.json();

        if (data.hours.length > 0) {
          const updated = [...schedule];
          data.hours.forEach((h: any) => {
            updated[h.dayOfWeek] = {
              startTime: h.startTime,
              endTime: h.endTime,
              isDayOff: h.isDayOff,
              hasBreak: Boolean(h.breakStart && h.breakEnd),
              breakStart: h.breakStart || "13:00",
              breakEnd: h.breakEnd || "14:00",
            };
          });
          setSchedule(updated);
        }
      });

  }, []);

  const updateDay = (index: number, field: string, value: any) => {
    const updated = [...schedule];
    updated[index] = { ...updated[index], [field]: value };
    setSchedule(updated);
  };

  const handleSave = async () => {
    setMessage("");

    for (let i = 0; i < days.length; i++) {
      const day = schedule[i];
      await fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          providerId,
          dayOfWeek: i,
          startTime: day.startTime,
          endTime: day.endTime,
          isDayOff: day.isDayOff,
          breakStart: day.hasBreak ? day.breakStart : null,
          breakEnd: day.hasBreak ? day.breakEnd : null,
        }),
      });
    }

    setMessage("Schedule saved successfully");
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#14161B]">
      <Navbar role="provider" />

      <div className="p-6 sm:p-8 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#1C1F26] dark:text-[#FAFAF8] font-['Space_Grotesk',sans-serif]">
              Weekly Schedule
            </h1>
            <p className="text-sm text-[#6B6A62] dark:text-[#9B9A92] mt-0.5">
              Set your working hours and lunch break for each day
            </p>
          </div>
          <button
            onClick={handleSave}
            className="bg-[#1C1F26] dark:bg-[#C2540A] text-white px-5 py-2.5 rounded-xl hover:bg-[#C2540A] dark:hover:bg-[#a3450a] transition-colors font-medium text-sm shrink-0"
          >
            Save Schedule
          </button>
        </div>

        {message && (
          <p
            className="text-sm mb-4 px-3 py-2 rounded-lg w-fit"
            style={{ color: STATUS.confirmed.color, backgroundColor: `${STATUS.confirmed.color}14` }}
          >
            {message}
          </p>
        )}

        <div className="flex flex-col gap-3">
          {days.map((day, index) => {
            const d = schedule[index];
            return (
              <div
                key={day}
                className="bg-white dark:bg-[#20242C] border border-[#1C1F26]/10 dark:border-white/10 rounded-2xl p-4"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="w-24 text-sm font-medium text-[#1C1F26] dark:text-[#FAFAF8] font-['Space_Grotesk',sans-serif]">
                    {day}
                  </span>

                  <label className="flex items-center gap-1.5 text-sm text-[#6B6A62] dark:text-[#9B9A92] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={d.isDayOff}
                      onChange={(e) => updateDay(index, "isDayOff", e.target.checked)}
                      className="w-4 h-4 rounded accent-[#C2540A]"
                    />
                    Day off
                  </label>

                  {!d.isDayOff && (
                    <>
                      <input
                        type="time"
                        value={d.startTime}
                        onChange={(e) => updateDay(index, "startTime", e.target.value)}
                        className="bg-[#FAFAF8] dark:bg-[#14161B] border border-[#1C1F26]/15 dark:border-white/10 rounded-lg px-2.5 py-1.5 text-sm text-[#1C1F26] dark:text-[#FAFAF8] outline-none focus:border-[#C2540A]/60 transition-colors font-['IBM_Plex_Mono',monospace]"
                      />
                      <span className="text-[#6B6A62] dark:text-[#9B9A92]">–</span>
                      <input
                        type="time"
                        value={d.endTime}
                        onChange={(e) => updateDay(index, "endTime", e.target.value)}
                        className="bg-[#FAFAF8] dark:bg-[#14161B] border border-[#1C1F26]/15 dark:border-white/10 rounded-lg px-2.5 py-1.5 text-sm text-[#1C1F26] dark:text-[#FAFAF8] outline-none focus:border-[#C2540A]/60 transition-colors font-['IBM_Plex_Mono',monospace]"
                      />

                      <label className="flex items-center gap-1.5 text-sm text-[#6B6A62] dark:text-[#9B9A92] cursor-pointer ml-2">
                        <input
                          type="checkbox"
                          checked={d.hasBreak}
                          onChange={(e) => updateDay(index, "hasBreak", e.target.checked)}
                          className="w-4 h-4 rounded accent-[#12665C]"
                        />
                        Lunch break
                      </label>
                    </>
                  )}
                </div>

                {!d.isDayOff && d.hasBreak && (
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-dashed border-[#1C1F26]/10 dark:border-white/10">
                    <span
                      className="text-xs font-semibold px-2 py-1 rounded-full shrink-0"
                      style={{ color: "#12665C", backgroundColor: "#12665C14" }}
                    >
                      Break
                    </span>
                    <input
                      type="time"
                      value={d.breakStart}
                      onChange={(e) => updateDay(index, "breakStart", e.target.value)}
                      className="bg-[#FAFAF8] dark:bg-[#14161B] border border-[#1C1F26]/15 dark:border-white/10 rounded-lg px-2.5 py-1.5 text-sm text-[#1C1F26] dark:text-[#FAFAF8] outline-none focus:border-[#12665C]/60 transition-colors font-['IBM_Plex_Mono',monospace]"
                    />
                    <span className="text-[#6B6A62] dark:text-[#9B9A92]">–</span>
                    <input
                      type="time"
                      value={d.breakEnd}
                      onChange={(e) => updateDay(index, "breakEnd", e.target.value)}
                      className="bg-[#FAFAF8] dark:bg-[#14161B] border border-[#1C1F26]/15 dark:border-white/10 rounded-lg px-2.5 py-1.5 text-sm text-[#1C1F26] dark:text-[#FAFAF8] outline-none focus:border-[#12665C]/60 transition-colors font-['IBM_Plex_Mono',monospace]"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}