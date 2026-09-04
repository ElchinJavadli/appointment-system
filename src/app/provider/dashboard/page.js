"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import AppointmentCard, { STATUS } from "@/components/AppointmentCard";

export default function ProviderDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAppointments = async () => {
    const meRes = await fetch("/api/me");
    const me = await meRes.json();

    const res = await fetch(`/api/appointments?providerId=${me.providerId}`);
    const data = await res.json();

    setAppointments(data.appointments);
    setLoading(false);
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const changeStatus = async (id, status) => {
    await fetch(`/api/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    loadAppointments();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#14161B]">
        <Navbar role="provider" />
        <p className="p-8 text-[#6B6A62] dark:text-[#9B9A92] font-['IBM_Plex_Mono',monospace] text-sm">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#14161B]">
      <Navbar role="provider" />

      <div className="p-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-[#1C1F26] dark:text-[#FAFAF8] font-['Space_Grotesk',sans-serif]">
          Upcoming Appointments
        </h1>

        <div className="flex flex-col gap-4">
          {appointments.map((a) => (
            <AppointmentCard key={a.id} appointment={a}>
              <div className="flex gap-2">
                {a.status === "pending" && (
                  <button
                    onClick={() => changeStatus(a.id, "confirmed")}
                    className="text-sm px-3 py-1 rounded-lg border transition-colors"
                    style={{ color: STATUS.confirmed.color, borderColor: `${STATUS.confirmed.color}55` }}
                  >
                    Confirm
                  </button>
                )}
                {a.status === "confirmed" && (
                  <button
                    onClick={() => changeStatus(a.id, "completed")}
                    className="text-sm px-3 py-1 rounded-lg border transition-colors"
                    style={{ color: STATUS.completed.color, borderColor: `${STATUS.completed.color}55` }}
                  >
                    Mark Completed
                  </button>
                )}
                {a.status !== "cancelled" && a.status !== "completed" && (
                  <button
                    onClick={() => changeStatus(a.id, "cancelled")}
                    className="text-sm px-3 py-1 rounded-lg border transition-colors"
                    style={{ color: STATUS.cancelled.color, borderColor: `${STATUS.cancelled.color}55` }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </AppointmentCard>
          ))}

          {appointments.length === 0 && (
            <p className="text-[#6B6A62] dark:text-[#9B9A92] font-['IBM_Plex_Mono',monospace] text-sm">
              No appointments yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}