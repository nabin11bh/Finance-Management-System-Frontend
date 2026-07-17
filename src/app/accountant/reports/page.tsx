"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

type ReportType = "income" | "expense";
type Format = "pdf" | "excel" | "csv";

export default function ReportsPage() {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [downloading, setDownloading] = useState<string | null>(null);

  async function handleDownload(reportType: ReportType, format: Format) {
    const key = `${reportType}-${format}`;
    setDownloading(key);
    try {
      const params = new URLSearchParams({ format });
      if (from) params.set("from", from);
      if (to) params.set("to", to);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/reports/${reportType}?${params}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      const ext = format === "excel" ? "xlsx" : format;
      a.href = url;
      a.download = `${reportType}-report.${ext}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Failed to download report. Please try again.");
    } finally {
      setDownloading(null);
    }
  }

  const reportCards: { type: ReportType; label: string }[] = [
    { type: "income", label: "Income Report" },
    { type: "expense", label: "Expense Report" },
  ];

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-semibold text-slate-900 mb-6">Reports</h1>

      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 flex gap-4 items-end">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">From</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">To</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <p className="text-xs text-slate-400 pb-2">Leave blank to include all records</p>
      </div>

      <div className="space-y-4">
        {reportCards.map(({ type, label }) => (
          <div key={type} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-900">{label}</span>
            <div className="flex gap-2">
              {(["pdf", "excel", "csv"] as Format[]).map((format) => {
                const key = `${type}-${format}`;
                return (
                  <button
                    key={format}
                    onClick={() => handleDownload(type, format)}
                    disabled={downloading === key}
                    className="text-xs font-medium border border-slate-300 rounded-md px-3 py-1.5 hover:bg-slate-50 disabled:opacity-50 uppercase"
                  >
                    {downloading === key ? "..." : format}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}