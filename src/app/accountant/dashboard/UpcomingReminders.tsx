"use client";

import { useGetUpcomingRemindersQuery } from "@/store/api/dashboardApi";

export default function UpcomingReminders() {
  const { data, isLoading } = useGetUpcomingRemindersQuery();

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-slate-700 mb-4">Upcoming Reminders</h3>
      {isLoading ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : !data || data.length === 0 ? (
        <p className="text-sm text-slate-400">Nothing due in the next 7 days.</p>
      ) : (
        <div className="divide-y divide-slate-100">
          {data.map((r) => (
            <div key={r.id} className="flex items-center justify-between py-2">
              <span className="text-sm text-slate-900">{r.title}</span>
              <span className="text-xs text-slate-500">{new Date(r.reminderDate).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}