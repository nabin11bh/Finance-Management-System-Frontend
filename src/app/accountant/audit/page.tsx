"use client";

import { useState } from "react";
import { useListAuditLogsQuery } from "@/store/api/auditApi";

const ACTION_COLORS: Record<string, string> = {
  CREATED: "text-green-700 bg-green-50",
  UPDATED: "text-amber-700 bg-amber-50",
  DELETED: "text-red-700 bg-red-50",
  LOGIN: "text-brand bg-teal-50",
  LOGOUT: "text-slate-600 bg-slate-100",
  UPLOADED: "text-blue-700 bg-blue-50",
  EXPORTED: "text-purple-700 bg-purple-50",
};

function badgeClass(action: string) {
  const key = Object.keys(ACTION_COLORS).find((k) => action.includes(k));
  return key ? ACTION_COLORS[key] : "text-slate-600 bg-slate-100";
}

export default function AuditTrailPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useListAuditLogsQuery({ page });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-slate-900 mb-6">Audit Trail</h1>

      {isLoading ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : (
        <>
          <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead className="bg-slate-50 text-slate-500 text-left">
                <tr>
                  <th className="px-4 py-3">When</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Entity</th>
                </tr>
              </thead>
              <tbody>
                {data?.records.map((log) => (
                  <tr key={log.id} className="border-t border-slate-100">
                    <td className="px-4 py-3 text-slate-500">{new Date(log.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-3">{log.userName}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded ${badgeClass(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {log.entityType ? `${log.entityType}${log.entityId ? ` · ${log.entityId.slice(0, 8)}…` : ""}` : "—"}
                    </td>
                  </tr>
                ))}
                {data?.records.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                      No audit activity yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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