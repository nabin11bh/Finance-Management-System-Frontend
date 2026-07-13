"use client";

import { useGetKpisQuery } from "@/store/api/dashboardApi";

function formatNPR(amount: number) {
  return `Rs. ${amount.toLocaleString("en-NP", { minimumFractionDigits: 0 })}`;
}

const PERIODS: { key: "today" | "week" | "month" | "year"; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" },
  { key: "year", label: "This Year" },
];

export default function KpiCards() {
  const { data, isLoading } = useGetKpisQuery();

  if (isLoading || !data) {
    return <p className="text-sm text-slate-500">Loading KPIs…</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {PERIODS.map(({ key, label }) => {
        const kpi = data[key];
        const isProfit = kpi.profit >= 0;
        return (
          <div key={key} className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">{label}</p>
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Income</span>
                <span className="font-medium text-green-700">{formatNPR(kpi.income)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Expense</span>
                <span className="font-medium text-red-700">{formatNPR(kpi.expense)}</span>
              </div>
              <div className="flex justify-between text-sm border-t border-slate-100 pt-1.5 mt-1.5">
                <span className="text-slate-700 font-medium">Net Profit</span>
                <span className={`font-semibold ${isProfit ? "text-green-700" : "text-red-700"}`}>
                  {formatNPR(kpi.profit)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}