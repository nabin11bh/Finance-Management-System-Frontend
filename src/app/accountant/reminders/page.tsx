"use client";

import { useState } from "react";
import { useListRemindersQuery, useCreateReminderMutation, useMarkCompleteMutation, useDeleteReminderMutation } from "@/store/api/reminderApi";
import { getErrorMessage } from "@/lib/apiError";
import AttachmentManager from "@/components/AttachmentManager";

const PRIORITIES = ["LOW", "MEDIUM", "HIGH"] as const;
const STATUSES = ["PENDING", "COMPLETED"] as const;

export default function RemindersPage() {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useListRemindersQuery({
    page,
    status: (statusFilter || undefined) as "PENDING" | "COMPLETED" | undefined,
    priority: (priorityFilter || undefined) as "LOW" | "MEDIUM" | "HIGH" | undefined,
  });
  const [createReminder, { isLoading: isCreating }] = useCreateReminderMutation();
  const [markComplete] = useMarkCompleteMutation();
  const [deleteReminder] = useDeleteReminderMutation();

  const [form, setForm] = useState({
    title: "",
    reminderDate: new Date().toISOString().slice(0, 10),
    priority: "MEDIUM" as (typeof PRIORITIES)[number],
  });
  const [error, setError] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await createReminder(form).unwrap();
      setForm({ ...form, title: "" });
    } catch (err) {
      setError(getErrorMessage(err, "Failed to create reminder."));
    }
  }

  const priorityColor: Record<string, string> = { LOW: "text-slate-500", MEDIUM: "text-amber-600", HIGH: "text-red-600" };

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-semibold text-slate-900 mb-6">Reminders</h1>

      <form onSubmit={handleCreate} className="bg-white border border-slate-200 rounded-xl p-4 mb-4 flex gap-3 items-end flex-wrap">
        <div className="flex-1 min-w-[160px]">
          <label className="block text-xs font-medium text-slate-700 mb-1">Title</label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Date</label>
          <input
            type="date"
            required
            value={form.reminderDate}
            onChange={(e) => setForm({ ...form, reminderDate: e.target.value })}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Priority</label>
          <select
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value as (typeof PRIORITIES)[number] })}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={isCreating}
          className="bg-brand hover:bg-brand-dark text-white text-sm font-medium px-4 py-2 rounded-md disabled:opacity-60"
        >
          Add
        </button>
      </form>
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      <div className="flex items-center gap-3 mb-4">
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => {
            setPriorityFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">All priorities</option>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : (
        <>
          <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100">
            {data?.records.map((reminder) => (
              <div key={reminder.id} className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${reminder.status === "COMPLETED" ? "line-through text-slate-400" : "text-slate-900"}`}>
                      {reminder.title}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(reminder.reminderDate).toLocaleDateString()} ·{" "}
                      <span className={priorityColor[reminder.priority]}>{reminder.priority}</span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {reminder.status === "PENDING" && (
                      <button onClick={() => markComplete(reminder.id)} className="text-xs text-green-700 hover:underline">
                        Complete
                      </button>
                    )}
                    <button onClick={() => deleteReminder(reminder.id)} className="text-xs text-red-600 hover:underline">
                      Delete
                    </button>
                  </div>
                </div>
                <AttachmentManager entityType="reminder" entityId={reminder.id} />
              </div>
            ))}
            {data?.records.length === 0 && (
              <p className="text-sm text-slate-400 px-4 py-8 text-center">No reminders match your filters.</p>
            )}
          </div>

          {data && data.meta.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 text-sm">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 border border-slate-300 rounded-md disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-slate-500">
                Page {data.meta.page} of {data.meta.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(data.meta.totalPages, p + 1))}
                disabled={page === data.meta.totalPages}
                className="px-3 py-1.5 border border-slate-300 rounded-md disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}