"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { STATUS } from "@/lib/statusColors";

const ROLE_COLORS = {
  client: "#12665C",
  provider: "#C2540A",
  admin: "#2F5D8A",
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(data.users);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = confirm("Delete this user?");
    if (!confirmed) return;

    await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    loadUsers();
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#14161B]">
      <Navbar role="admin" />

      <div className="p-6 sm:p-8 max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#1C1F26] dark:text-[#FAFAF8] font-['Space_Grotesk',sans-serif]">
            All Users
          </h1>
          <p className="text-sm text-[#6B6A62] dark:text-[#9B9A92] mt-0.5">
            {users.length} user{users.length === 1 ? "" : "s"} registered
          </p>
        </div>

        {users.length === 0 ? (
          <div className="border border-dashed border-[#1C1F26]/20 dark:border-white/15 rounded-2xl p-10 text-center">
            <p className="text-[#6B6A62] dark:text-[#9B9A92] text-sm">No users yet.</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#20242C] border border-[#1C1F26]/10 dark:border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1C1F26]/10 dark:border-white/10 text-left">
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#6B6A62] dark:text-[#9B9A92]">Name</th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#6B6A62] dark:text-[#9B9A92]">Email</th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#6B6A62] dark:text-[#9B9A92]">Role</th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#6B6A62] dark:text-[#9B9A92]">Joined</th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#6B6A62] dark:text-[#9B9A92]"></th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => {
                    const roleColor = ROLE_COLORS[u.role] || "#6B6A62";
                    return (
                      <tr
                        key={u.id}
                        className="border-b border-[#1C1F26]/8 dark:border-white/8 last:border-0 hover:bg-[#FAFAF8] dark:hover:bg-[#14161B]/60 transition-colors"
                      >
                        <td className="px-5 py-4 font-medium text-[#1C1F26] dark:text-[#FAFAF8] font-['Space_Grotesk',sans-serif]">
                          {u.name}
                        </td>
                        <td className="px-5 py-4 text-[#6B6A62] dark:text-[#9B9A92]">
                          {u.email}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className="text-xs font-semibold px-2.5 py-1 rounded-full capitalize"
                            style={{ color: roleColor, backgroundColor: `${roleColor}14` }}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-[#6B6A62] dark:text-[#9B9A92] font-['IBM_Plex_Mono',monospace]">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => handleDelete(u.id)}
                            className="text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors"
                            style={{ color: STATUS.cancelled.color, borderColor: `${STATUS.cancelled.color}55` }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}