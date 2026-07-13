"use client";

import { useGetRecentTransactionsQuery } from "@/store/api/dashboardApi";

function formatNPR(amount: number) {
  return `Rs. ${amount.toLocaleString("en-NP", { minimumFractionDigits: 0 })}`;
}

export default function RecentTransactions() {
  const { data, isLoading } = useGetRecentTransactionsQuery();

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-slate-700 mb-4">Recent Transactions</h3>
      {isLoading ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : !data || data.length === 0 ? (
        <p className="text-sm text-slate-400">No transactions yet.</p>
      ) : (
        <div className="divide-y divide-slate-100">
          {data.map((tx) => (
            <div key={`${tx.type}-${tx.id}`} className="flex items-center justify-between py-2.5">
              <div>
                <p className="text-sm font-medium text-slate-900">{tx.category}</p>
                <p className="text-xs text-slate-500">
                  {tx.counterparty ?? "—"} · {new Date(tx.date).toLocaleDateString()}
                </p>
              </div>
              <span className={`text-sm font-semibold ${tx.type === "income" ? "text-green-700" : "text-red-700"}`}>
                {tx.type === "income" ? "+" : "-"}
                {formatNPR(tx.amount)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}