import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import { STATUS } from "@/lib/statusColors";
import { Users, Briefcase, Calendar, CircleCheck, CircleX } from "lucide-react";

export default async function AdminDashboard() {
  const totalUsers = await prisma.user.count();
  const totalProviders = await prisma.provider.count();
  const totalAppointments = await prisma.appointment.count();
  const completedAppointments = await prisma.appointment.count({
    where: { status: "completed" },
  });
  const cancelledAppointments = await prisma.appointment.count({
    where: { status: "cancelled" },
  });

  const stats = [
    { label: "Total Users", value: totalUsers, icon: Users, color: "#1C1F26" },
    { label: "Total Providers", value: totalProviders, icon: Briefcase, color: "#12665C" },
    { label: "Total Appointments", value: totalAppointments, icon: Calendar, color: "#C2540A" },
    { label: "Completed", value: completedAppointments, icon: CircleCheck, color: STATUS.completed.color },
    { label: "Cancelled", value: cancelledAppointments, icon: CircleX, color: STATUS.cancelled.color },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#14161B]">
      <Navbar role="admin" />

      <div className="p-6 sm:p-8 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-[#1C1F26] dark:text-[#FAFAF8] font-['Space_Grotesk',sans-serif]">
          System Statistics
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white dark:bg-[#20242C] border border-[#1C1F26]/10 dark:border-white/10 rounded-2xl p-5"
              >
                <span
                  className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${stat.color}14` }}
                >
                  <Icon className="w-5 h-5" strokeWidth={1.75} style={{ color: stat.color }} />
                </span>
                <p className="text-3xl font-bold text-[#1C1F26] dark:text-[#FAFAF8] font-['IBM_Plex_Mono',monospace]">
                  {stat.value}
                </p>
                <p className="text-sm text-[#6B6A62] dark:text-[#9B9A92] mt-1">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}