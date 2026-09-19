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

      <div className="px-4 py-6 sm:p-8 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-[#1C1F26] dark:text-[#FAFAF8] font-['Space_Grotesk',sans-serif]">
          System Statistics
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;

            const spanLastOnMobile = i === stats.length - 1 && stats.length % 2 === 1;
            return (
              <div
                key={stat.label}
                className={`bg-white dark:bg-[#20242C] border border-[#1C1F26]/10 dark:border-white/10 rounded-2xl p-4 sm:p-5 min-w-0 ${
                  spanLastOnMobile ? "col-span-2 sm:col-span-1" : ""
                }`}
              >
                <span
                  className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${stat.color}14` }}
                >
                  <Icon className="w-5 h-5" strokeWidth={1.75} style={{ color: stat.color }} />
                </span>
                <p className="text-2xl sm:text-3xl font-bold text-[#1C1F26] dark:text-[#FAFAF8] font-['IBM_Plex_Mono',monospace] break-words">
                  {stat.value}
                </p>
                <p className="text-sm text-[#6B6A62] dark:text-[#9B9A92] mt-1 break-words">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}