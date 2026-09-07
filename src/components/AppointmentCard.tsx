import { STATUS } from "@/lib/statusColors";
export { STATUS };

export default function AppointmentCard({ appointment, children, accentColor, icon }: any) {
  const dateStr = new Date(appointment.date).toLocaleDateString();
  const status = STATUS[appointment.status] || STATUS.completed;

  return (
    <div className="flex rounded-2xl overflow-hidden border border-[#1C1F26]/10 dark:border-white/10">
      {accentColor && <span className="w-1.5 shrink-0" style={{ backgroundColor: accentColor }} />}

      <div className="flex-1 bg-white dark:bg-[#20242C] p-4 flex items-center gap-4">
        {icon && (
          <span
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${accentColor}14` }}
          >
            {icon}
          </span>
        )}

        <div className="flex-1 flex justify-between items-center gap-4">
          <div>
            <p className="font-semibold text-[#1C1F26] dark:text-[#FAFAF8] font-['Space_Grotesk',sans-serif]">
              {appointment.service?.name}
            </p>
            <p className="text-sm text-[#6B6A62] dark:text-[#9B9A92] font-['IBM_Plex_Mono',monospace] mt-0.5">
              {dateStr} • {appointment.startTime} – {appointment.endTime}
            </p>
            {appointment.provider?.user && (
              <p className="text-sm text-[#6B6A62] dark:text-[#9B9A92] mt-0.5">
                Provider: {appointment.provider.user.name}
              </p>
            )}
            {appointment.client && (
              <p className="text-sm text-[#6B6A62] dark:text-[#9B9A92] mt-0.5">
                Client: {appointment.client.name}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ color: status.color, backgroundColor: `${status.color}1A` }}
            >
              {status.label}
            </span>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}